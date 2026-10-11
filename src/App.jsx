import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
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
  getTrending,
  getTopRatedMovies,
  getPopularTV,
  getTamilTrending,
  getTamilTopRated,
  getTamilNowPlaying,
  getMoviesByLanguage,
  discoverByGenre,
  getMovieDetails,
  searchMovies,
  LANGUAGES,
} from './services/tmdbApi';
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

  // Filters & Sorting (70% Tamil by default)
  const [selectedLanguage, setSelectedLanguage] = useState('ta'); // 'ta' by default!
  const [typeFilter, setTypeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Year Discovery State (Active live filtering when year is entered)
  const [yearMovies, setYearMovies] = useState([]);
  const [isLoadingYear, setIsLoadingYear] = useState(false);

  // Modal State
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalTrailerAutoPlay, setModalTrailerAutoPlay] = useState(false);

  // Dynamic Feeds State
  const [heroMovies, setHeroMovies] = useState([]);
  const [feeds, setFeeds] = useState({
    primaryTrending: [],
    primaryTopRated: [],
    primaryLatest: [],
    globalTrending: [],
    popularTV: [],
    genreMovies: [],
  });
  const [feedsLoading, setFeedsLoading] = useState(true);

  // Load Feeds based on Selected Language (70% Tamil / 30% Global by default)
  useEffect(() => {
    let isMounted = true;

    async function loadFeeds() {
      setFeedsLoading(true);
      try {
        if (selectedLanguage === 'ta') {
          // 70% Tamil cinema prominence + 30% global blockbusters
          const [tamilTrending, tamilTopRated, tamilLatest, globalTrending, popularTV] =
            await Promise.all([
              getTamilTrending(1),
              getTamilTopRated(1),
              getTamilNowPlaying(1),
              getTrending({ mediaType: 'all', timeWindow: 'day' }),
              getPopularTV(1),
            ]);

          if (isMounted) {
            setFeeds({
              primaryTrending: tamilTrending,
              primaryTopRated: tamilTopRated,
              primaryLatest: tamilLatest,
              globalTrending: globalTrending,
              popularTV: popularTV,
              genreMovies: [],
            });

            // Rotating Hero Banner: 70% Tamil candidates + top global hits
            const tamilCandidates = (tamilTrending || []).filter((m) => m.backdrop_path).slice(0, 5);
            const globalCandidates = (globalTrending || []).filter((m) => m.backdrop_path).slice(0, 2);
            const combinedHero = [...tamilCandidates, ...globalCandidates];

            setHeroMovies(combinedHero);

            // Fetch details for taglines & trailers
            Promise.all(
              combinedHero.map((m) => getMovieDetails(m.id, m.media_type || 'movie'))
            ).then((detailed) => {
              const valid = detailed.filter(Boolean);
              if (isMounted && valid.length > 0) {
                setHeroMovies(valid);
              }
            });
          }
        } else if (selectedLanguage === 'all') {
          // Global all-languages cinema
          const [trending, topRated, popularTV] = await Promise.all([
            getTrending({ mediaType: 'all', timeWindow: 'day' }),
            getTopRatedMovies(1),
            getPopularTV(1),
          ]);

          if (isMounted) {
            setFeeds({
              primaryTrending: trending,
              primaryTopRated: topRated,
              primaryLatest: [],
              globalTrending: trending,
              popularTV: popularTV,
              genreMovies: [],
            });

            const topCandidates = trending.filter((m) => m.backdrop_path).slice(0, 7);
            setHeroMovies(topCandidates);
          }
        } else {
          // Selected specific language (Telugu, Malayalam, Hindi, Korean, etc.)
          const [langTrending, langTopRated, globalTrending, popularTV] = await Promise.all([
            getMoviesByLanguage({ language: selectedLanguage, sortBy: 'popularity.desc', page: 1 }),
            getMoviesByLanguage({ language: selectedLanguage, sortBy: 'vote_average.desc', page: 1 }),
            getTrending({ mediaType: 'all', timeWindow: 'day' }),
            getPopularTV(1),
          ]);

          if (isMounted) {
            setFeeds({
              primaryTrending: langTrending,
              primaryTopRated: langTopRated,
              primaryLatest: [],
              globalTrending: globalTrending,
              popularTV: popularTV,
              genreMovies: [],
            });

            const langHero = (langTrending || []).filter((m) => m.backdrop_path).slice(0, 5);
            const fallback = (globalTrending || []).filter((m) => m.backdrop_path).slice(0, 2);
            setHeroMovies(langHero.length > 0 ? [...langHero, ...fallback] : globalTrending.slice(0, 6));
          }
        }
      } catch (err) {
        console.error('Error loading language feeds:', err);
      } finally {
        if (isMounted) setFeedsLoading(false);
      }
    }

    loadFeeds();

    return () => {
      isMounted = false;
    };
  }, [selectedLanguage]);

  const isYearActive = Boolean(yearFilter && /^\d{4}$/.test(yearFilter.trim()));

  // Handle Genre selection discovery (respects selected language and year)
  useEffect(() => {
    if (!selectedGenre) return;

    let isMounted = true;
    async function loadGenreFeed() {
      try {
        const results = await discoverByGenre({
          genreId: selectedGenre,
          mediaType: typeFilter === 'series' ? 'tv' : 'movie',
          language: selectedLanguage,
          year: isYearActive ? yearFilter.trim() : '',
          page: 1,
        });
        if (isMounted) {
          setFeeds((prev) => ({ ...prev, genreMovies: results }));
        }
      } catch (err) {
        console.error('Error fetching genre movies:', err);
      }
    }

    loadGenreFeed();
    return () => {
      isMounted = false;
    };
  }, [selectedGenre, typeFilter, selectedLanguage, yearFilter, isYearActive]);

  // Live Year Discovery Effect (Reflects immediately in UI when user enters a year)
  useEffect(() => {
    if (!isYearActive) {
      setYearMovies([]);
      setIsLoadingYear(false);
      return;
    }

    // If an active text search is running, search handler handles year filtering
    if (activeSearch) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsLoadingYear(true);
      try {
        let tmdbSort = 'popularity.desc';
        if (sortBy === 'rating-desc') tmdbSort = 'vote_average.desc';
        else if (sortBy === 'year-desc') tmdbSort = 'primary_release_date.desc';
        else if (sortBy === 'year-asc') tmdbSort = 'primary_release_date.asc';
        else if (sortBy === 'title-asc') tmdbSort = 'title.asc';

        const results = await getMoviesByLanguage({
          language: selectedLanguage,
          mediaType: typeFilter === 'series' ? 'tv' : 'movie',
          year: yearFilter.trim(),
          genreId: selectedGenre || '',
          sortBy: tmdbSort,
          page: 1,
        });

        if (isMounted) {
          setYearMovies(results);
        }
      } catch (err) {
        console.error('Error discovering movies for year:', err);
      } finally {
        if (isMounted) setIsLoadingYear(false);
      }
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [yearFilter, isYearActive, typeFilter, selectedLanguage, selectedGenre, sortBy, activeSearch]);

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
          language: selectedLanguage !== 'all' ? selectedLanguage : '',
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
        console.error('TMDB Search error:', err);
      } finally {
        setIsLoadingSearch(false);
        setIsLoadingMore(false);
      }
    },
    [typeFilter, yearFilter, selectedLanguage]
  );

  // Trigger search whenever filters change on an active search
  useEffect(() => {
    if (activeSearch) {
      executeSearch(activeSearch, 1, false);
    }
  }, [typeFilter, yearFilter, selectedLanguage, executeSearch]);

  const handleOpenMovie = async (movie, autoPlayTrailer = false) => {
    setModalTrailerAutoPlay(autoPlayTrailer);
    const fullDetails = await getMovieDetails(
      movie.id || movie.imdbID,
      movie.media_type || (movie.Type === 'series' ? 'tv' : 'movie')
    );
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
    setSelectedGenre(null);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    executeSearch(activeSearch, nextPage, true);
  };

  // Sort Search Results
  const sortedSearchResults = [...searchResults].sort((a, b) => {
    if (sortBy === 'rating-desc') {
      return (b.vote_average || 0) - (a.vote_average || 0);
    }
    if (sortBy === 'year-desc') {
      return parseInt(b.Year || '0', 10) - parseInt(a.Year || '0', 10);
    }
    if (sortBy === 'year-asc') {
      return parseInt(a.Year || '0', 10) - parseInt(b.Year || '0', 10);
    }
    if (sortBy === 'title-asc') {
      return (a.Title || '').localeCompare(b.Title || '');
    }
    return (b.popularity || 0) - (a.popularity || 0);
  });

  // Sort Year Results
  const sortedYearMovies = [...yearMovies].sort((a, b) => {
    if (sortBy === 'rating-desc') {
      return (b.vote_average || 0) - (a.vote_average || 0);
    }
    if (sortBy === 'year-desc') {
      return parseInt(b.Year || '0', 10) - parseInt(a.Year || '0', 10);
    }
    if (sortBy === 'year-asc') {
      return parseInt(a.Year || '0', 10) - parseInt(b.Year || '0', 10);
    }
    if (sortBy === 'title-asc') {
      return (a.Title || '').localeCompare(b.Title || '');
    }
    return (b.popularity || 0) - (a.popularity || 0);
  });

  const activeLangMeta = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[1];

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onPerformSearch={(term) => executeSearch(term, 1, false)}
        onSelectMovie={(movie) => handleOpenMovie(movie)}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
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
            {/* Filter Bar with Language Explorer & Genre Pills */}
            <FilterBar
              type={typeFilter}
              setType={setTypeFilter}
              year={yearFilter}
              setYear={setYearFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              onReset={() => {
                setTypeFilter('');
                setYearFilter('');
                setSortBy('relevance');
                setSelectedGenre(null);
                setSelectedLanguage('ta');
                setYearMovies([]);
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
                    Clear Search & Back to Showcase
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
                        <div
                          key={movie.id || movie.imdbID}
                          className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                        >
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
                              Loading more titles...
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
                    <h4>No movies or shows found for "{activeSearch}"</h4>
                    <p className="text-muted small mb-3">
                      Try checking the spelling, resetting filters, or searching for broader terms like "Leo", "Vikram", or "Maharaja".
                    </p>
                    <button
                      className="btn btn-primary rounded-pill px-4"
                      onClick={handleClearSearch}
                    >
                      Return to Showcase
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Curated Showcase Feed */
              <>
                {/* Active Live Year Filter Discovery Section */}
                {isYearActive && (
                  <div className="mb-5 p-4 rounded-4 glass-panel border border-primary border-opacity-25 shadow-sm">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                      <div>
                        <h3 className="fw-bold mb-1 fs-4 d-flex align-items-center flex-wrap gap-2">
                          <span className="d-flex align-items-center gap-2">
                            <FaCalendarAlt className="text-warning" /> Releases from
                          </span>
                          <span className="gradient-text-cinema">{yearFilter}</span>
                          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 rounded-pill fs-6 px-3 py-1">
                            {activeLangMeta?.name || 'Cinema'}
                          </span>
                          {typeFilter && (
                            <span className="badge bg-secondary bg-opacity-25 text-body rounded-pill fs-6 px-3 py-1">
                              {typeFilter === 'series' ? 'TV Series' : 'Movies'}
                            </span>
                          )}
                        </h3>
                        <p className="text-muted small mb-0">
                          {isLoadingYear
                            ? `Finding titles from ${yearFilter}...`
                            : sortedYearMovies.length > 0
                            ? `Found ${sortedYearMovies.length} popular titles released in ${yearFilter}`
                            : `No titles found for year ${yearFilter}`}
                        </p>
                      </div>

                      <button
                        className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1"
                        onClick={() => setYearFilter('')}
                      >
                        <FaTimes /> Clear Year ({yearFilter})
                      </button>
                    </div>

                    {isLoadingYear ? (
                      <div className="row g-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <SkeletonCard />
                          </div>
                        ))}
                      </div>
                    ) : sortedYearMovies.length > 0 ? (
                      <div className="row g-4">
                        {sortedYearMovies.map((movie) => (
                          <div
                            key={movie.id || movie.imdbID}
                            className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                          >
                            <MovieCard
                              movie={movie}
                              onClick={() => handleOpenMovie(movie)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted mb-2">
                          No titles found for year {yearFilter} in {activeLangMeta?.name}.
                        </p>
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill"
                          onClick={() => setYearFilter('')}
                        >
                          Clear Year Filter
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Hero Banner Spotlight Carousel (70% Tamil Blockbusters + Global Hits) */}
                <HeroBanner
                  movies={heroMovies}
                  onOpenModal={(movie) => handleOpenMovie(movie, false)}
                  onOpenTrailer={(movie) => handleOpenMovie(movie, true)}
                />

                {/* Genre Filter Carousel if Genre Selected */}
                {selectedGenre && feeds.genreMovies.length > 0 && (
                  <MovieCarousel
                    title="🎯 Genre Discoveries"
                    subtitle="Titles tailored to your selected genre filter"
                    movies={feeds.genreMovies}
                    loading={false}
                    onMovieClick={(movie) => handleOpenMovie(movie)}
                  />
                )}

                {/* 1. Primary Trending (70% Tamil by default) */}
                <MovieCarousel
                  title={
                    selectedLanguage === 'ta'
                      ? '🔥 Trending Tamil Blockbusters'
                      : `🔥 Trending ${activeLangMeta.name} Cinema`
                  }
                  subtitle={
                    selectedLanguage === 'ta'
                      ? 'Hot Tamil releases, box-office monsters, and trending films'
                      : `Top trending titles in ${activeLangMeta.name}`
                  }
                  movies={feeds.primaryTrending}
                  loading={feedsLoading}
                  onMovieClick={(movie) => handleOpenMovie(movie)}
                />

                {/* 2. All-Time Masterpieces */}
                <MovieCarousel
                  title={
                    selectedLanguage === 'ta'
                      ? '🏆 All-Time Tamil Masterpieces & Classics'
                      : `🏆 Top Rated ${activeLangMeta.name} Classics`
                  }
                  subtitle={
                    selectedLanguage === 'ta'
                      ? 'Critically acclaimed masterpieces that defined Tamil cinema history'
                      : `Highest-rated films in ${activeLangMeta.name}`
                  }
                  movies={feeds.primaryTopRated}
                  loading={feedsLoading}
                  onMovieClick={(movie) => handleOpenMovie(movie)}
                />

                {/* 3. Latest Tamil Releases / In Theaters (if Tamil) */}
                {selectedLanguage === 'ta' && feeds.primaryLatest.length > 0 && (
                  <MovieCarousel
                    title="🍿 Latest Tamil Releases & In Theaters"
                    subtitle="Fresh Kollywood films and recent theatrical premieres"
                    movies={feeds.primaryLatest}
                    loading={feedsLoading}
                    onMovieClick={(movie) => handleOpenMovie(movie)}
                  />
                )}

                {/* 4. Global & Worldwide Blockbusters (30% Balance) */}
                <MovieCarousel
                  title="🌟 Global & Hollywood Hits"
                  subtitle="Top 30% global blockbusters and international sensations"
                  movies={feeds.globalTrending}
                  loading={feedsLoading}
                  onMovieClick={(movie) => handleOpenMovie(movie)}
                />

                {/* 5. Popular TV & Web Series */}
                <MovieCarousel
                  title="📺 Top Web Series & TV Shows"
                  subtitle="Gripping episodic shows and top television hits"
                  movies={feeds.popularTV}
                  loading={feedsLoading}
                  onMovieClick={(movie) => handleOpenMovie(movie)}
                />
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
          onSelectMovie={handleOpenMovie}
          initialShowTrailer={modalTrailerAutoPlay}
        />
      )}

      {/* Toast Feedback */}
      <Toast />

      {/* Footer */}
      <footer className="py-4 border-top border-secondary border-opacity-25 text-center text-muted small mt-auto">
        <div className="container">
          <p className="mb-1">
            🎬 <strong>Movie Explorer Pro</strong> — Powered by <strong>The Movie Database (TMDB) API</strong>.
          </p>
          <p className="mb-0 text-secondary" style={{ fontSize: '0.8rem' }}>
            70% Tamil Cinema Focus • Multi-Language Discovery • 4K Backdrops • Official Trailers • Personal Lounge
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
