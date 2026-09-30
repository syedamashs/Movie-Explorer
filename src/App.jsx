import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MovieCarousel from './components/MovieCarousel';
import MovieCard from './components/MovieCard';
import SkeletonCard from './components/SkeletonCard';
import FilterBar from './components/FilterBar';
import MovieModal from './components/MovieModal';
import UserLibrary from './components/UserLibrary';
import TasteProfile from './components/TasteProfile';
import Toast from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { PersonalizationProvider } from './context/PersonalizationContext';
import {
  searchMovies,
  getMovieDetails,
  CURATED_COLLECTIONS,
  FEATURED_HERO_ID,
} from './services/omdbApi';
import './index.css';

function MainApp() {
  const [activeView, setActiveView] = useState('explore'); // 'explore' | 'watchlist' | 'favorites' | 'taste'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filters & Sorting
  const [typeFilter, setTypeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Modal State
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalTrailerAutoPlay, setModalTrailerAutoPlay] = useState(false);

  // Curated Content State
  const [heroMovie, setHeroMovie] = useState(null);
  const [curatedData, setCuratedData] = useState({});
  const [curatedLoading, setCuratedLoading] = useState(true);

  // Load Curated Collections on Mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialFeed() {
      setCuratedLoading(true);
      try {
        // Fetch hero movie
        const hero = await getMovieDetails(FEATURED_HERO_ID);
        if (isMounted && hero) setHeroMovie(hero);

        // Fetch curated collections
        const collectionsMap = {};
        for (const col of CURATED_COLLECTIONS) {
          const moviePromises = col.imdbIDs.map((id) => getMovieDetails(id));
          const loadedMovies = await Promise.all(moviePromises);
          collectionsMap[col.id] = loadedMovies.filter(Boolean);
        }

        if (isMounted) {
          setCuratedData(collectionsMap);
        }
      } catch (err) {
        console.error('Error loading curated feeds:', err);
      } finally {
        if (isMounted) setCuratedLoading(false);
      }
    }

    loadInitialFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search Executor
  const executeSearch = useCallback(
    async (term, page = 1, append = false) => {
      if (!term || !term.trim()) return;

      if (page === 1) {
        setIsLoadingSearch(true);
        setActiveSearch(term);
        setActiveView('explore');
      } else {
        setIsLoadingMore(true);
      }

      try {
        const res = await searchMovies({
          query: term,
          page,
          type: typeFilter,
          year: yearFilter,
        });

        if (res.Response === 'True') {
          if (append) {
            setSearchResults((prev) => [...prev, ...res.Search]);
          } else {
            setSearchResults(res.Search);
          }
          setTotalResults(res.totalResults);
          setCurrentPage(page);
        } else {
          if (!append) {
            setSearchResults([]);
            setTotalResults(0);
          }
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoadingSearch(false);
        setIsLoadingMore(false);
      }
    },
    [typeFilter, yearFilter]
  );

  // Trigger search whenever filters change on an active search
  useEffect(() => {
    if (activeSearch) {
      executeSearch(activeSearch, 1, false);
    }
  }, [typeFilter, yearFilter, executeSearch]);

  const handleOpenMovie = async (movie, autoPlayTrailer = false) => {
    setModalTrailerAutoPlay(autoPlayTrailer);
    // Fetch full details
    const fullDetails = await getMovieDetails(movie.imdbID);
    setSelectedMovie(fullDetails || movie);
  };

  const handleSearchPerson = (name) => {
    setSearchQuery(name);
    executeSearch(name, 1, false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    setSearchResults([]);
    setTotalResults(0);
    setCurrentPage(1);
    setTypeFilter('');
    setYearFilter('');
    setSortBy('relevance');
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    executeSearch(activeSearch, nextPage, true);
  };

  // Sorted Results
  const sortedSearchResults = [...searchResults].sort((a, b) => {
    if (sortBy === 'year-desc') {
      return parseInt(b.Year || '0', 10) - parseInt(a.Year || '0', 10);
    }
    if (sortBy === 'year-asc') {
      return parseInt(a.Year || '0', 10) - parseInt(b.Year || '0', 10);
    }
    if (sortBy === 'title-asc') {
      return (a.Title || '').localeCompare(b.Title || '');
    }
    return 0; // relevance
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onPerformSearch={(term) => executeSearch(term, 1, false)}
        onSelectMovie={(movie) => handleOpenMovie(movie)}
      />

      <main className="container flex-grow-1 pb-5">
        {/* Watchlist View */}
        {activeView === 'watchlist' && (
          <UserLibrary
            onSelectMovie={(movie) => handleOpenMovie(movie)}
            onExploreMovies={() => setActiveView('explore')}
          />
        )}

        {/* Favorites View */}
        {activeView === 'favorites' && (
          <UserLibrary
            onSelectMovie={(movie) => handleOpenMovie(movie)}
            onExploreMovies={() => setActiveView('explore')}
          />
        )}

        {/* Taste & Stats View */}
        {activeView === 'taste' && (
          <TasteProfile
            onSelectMovie={(movie) => handleOpenMovie(movie)}
            onExploreMovies={() => setActiveView('explore')}
          />
        )}

        {/* Explore / Home View */}
        {activeView === 'explore' && (
          <>
            {/* Filter Bar (Visible whenever there is a search or recent searches) */}
            <FilterBar
              type={typeFilter}
              setType={setTypeFilter}
              year={yearFilter}
              setYear={setYearFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onReset={() => {
                setTypeFilter('');
                setYearFilter('');
                setSortBy('relevance');
              }}
              onSelectSearchHistory={(term) => {
                setSearchQuery(term);
                executeSearch(term, 1, false);
              }}
            />

            {/* When there is an Active Search query */}
            {activeSearch ? (
              <div className="mb-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                  <div>
                    <h3 className="fw-bold mb-1 fs-4">
                      Results for <span className="gradient-text-cinema">"{activeSearch}"</span>
                    </h3>
                    <p className="text-muted small mb-0">
                      {totalResults > 0
                        ? `Found ${totalResults} titles matching your search`
                        : 'No matches found'}
                    </p>
                  </div>

                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={handleClearSearch}
                  >
                    Clear Search & Back to Curated Feeds
                  </button>
                </div>

                {isLoadingSearch ? (
                  <div className="row g-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <SkeletonCard />
                      </div>
                    ))}
                  </div>
                ) : sortedSearchResults.length > 0 ? (
                  <>
                    <div className="row g-4">
                      {sortedSearchResults.map((movie) => (
                        <div key={movie.imdbID} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                          <MovieCard
                            movie={movie}
                            onClick={() => handleOpenMovie(movie)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Pagination / Load More */}
                    {sortedSearchResults.length < totalResults && (
                      <div className="text-center mt-5">
                        <button
                          className="btn btn-primary rounded-pill px-5 py-2 fw-bold"
                          style={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            border: 'none',
                          }}
                          disabled={isLoadingMore}
                          onClick={handleLoadMore}
                        >
                          {isLoadingMore ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Loading more films...
                            </>
                          ) : (
                            `Load More Movies (${sortedSearchResults.length} of ${totalResults})`
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-5 glass-panel rounded-4">
                    <h4>No movies found for "{activeSearch}"</h4>
                    <p className="text-muted small mb-3">
                      Try checking the spelling, removing filters, or searching for broader terms like "Batman", "Sci-Fi", or "Marvel".
                    </p>
                    <button
                      className="btn btn-primary rounded-pill px-4"
                      onClick={handleClearSearch}
                    >
                      Return to Curated Feed
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Curated Showcase Feed (When not searching) */
              <>
                {/* Hero Banner Spotlight */}
                <HeroBanner
                  movie={heroMovie}
                  onOpenModal={(movie) => handleOpenMovie(movie, false)}
                  onOpenTrailer={(movie) => handleOpenMovie(movie, true)}
                />

                {/* Curated Category Carousels */}
                {CURATED_COLLECTIONS.map((col) => (
                  <MovieCarousel
                    key={col.id}
                    title={col.title}
                    subtitle={col.subtitle}
                    movies={curatedData[col.id] || []}
                    loading={curatedLoading}
                    onMovieClick={(movie) => handleOpenMovie(movie)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSearchPerson={handleSearchPerson}
          initialShowTrailer={modalTrailerAutoPlay}
        />
      )}

      {/* Toast Feedback */}
      <Toast />

      {/* Footer */}
      <footer className="py-4 border-top border-secondary border-opacity-25 text-center text-muted small mt-auto">
        <div className="container">
          <p className="mb-1">
            🎬 <strong>Movie Explorer Pro</strong> — Built with React & OMDb API.
          </p>
          <p className="mb-0 text-secondary" style={{ fontSize: '0.8rem' }}>
            Personalized Watchlists • Smart Recommendations • Instant Trailing • Glassmorphism Design
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PersonalizationProvider>
        <MainApp />
      </PersonalizationProvider>
    </ThemeProvider>
  );
}
