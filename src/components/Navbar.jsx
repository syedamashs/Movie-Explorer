import React, { useState, useEffect, useRef } from 'react';
import {
  FaFilm,
  FaSearch,
  FaTimes,
  FaSun,
  FaMoon,
  FaBookmark,
  FaHeart,
  FaChartPie,
  FaCompass,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { usePersonalization } from '../context/PersonalizationContext';
import { searchMovies } from '../services/omdbApi';

export default function Navbar({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  onPerformSearch,
  onSelectMovie,
}) {
  const { isDark, toggleTheme } = useTheme();
  const { watchlist, favorites, addSearchHistory } = usePersonalization();

  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced autocomplete search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setAutocompleteResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchMovies({ query: searchQuery.trim(), page: 1 });
      if (res && res.Search) {
        setAutocompleteResults(res.Search.slice(0, 5));
        setShowDropdown(true);
      } else {
        setAutocompleteResults([]);
      }
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    addSearchHistory(searchQuery.trim());
    onPerformSearch(searchQuery.trim());
  };

  const handleSelectAutocomplete = (movie) => {
    setShowDropdown(false);
    addSearchHistory(movie.Title);
    onSelectMovie(movie);
  };

  return (
    <nav className="glass-navbar sticky-top py-3 mb-4">
      <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
        {/* Brand Logo */}
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveView('explore')}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-3 shadow-sm text-white"
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            }}
          >
            <FaFilm className="fs-5" />
          </div>
          <div>
            <span className="brand-font fw-bold fs-4 gradient-text-cinema">
              Movie Explorer
            </span>
            <span className="d-block text-muted" style={{ fontSize: '0.68rem', marginTop: '-4px' }}>
              PRO CINEMA LOUNGE
            </span>
          </div>
        </div>

        {/* Search Bar with Autocomplete */}
        <div
          ref={searchContainerRef}
          className="position-relative flex-grow-1"
          style={{ maxWidth: '460px', minWidth: '240px' }}
        >
          <form onSubmit={handleSearchSubmit} className="d-flex align-items-center position-relative">
            <input
              type="text"
              className="form-control rounded-pill pe-5 ps-4 py-2 border-secondary border-opacity-50 text-body bg-transparent"
              style={{
                boxShadow: 'none',
                backdropFilter: 'blur(8px)',
              }}
              placeholder="Search movies, TV shows, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (autocompleteResults.length > 0) setShowDropdown(true);
              }}
            />

            {searchQuery && (
              <button
                type="button"
                className="btn position-absolute text-muted p-0"
                style={{ right: '40px' }}
                onClick={() => {
                  setSearchQuery('');
                  setAutocompleteResults([]);
                  setShowDropdown(false);
                }}
              >
                <FaTimes />
              </button>
            )}

            <button
              type="submit"
              className="btn position-absolute end-0 me-1 rounded-circle p-2 text-primary"
              aria-label="Submit search"
            >
              <FaSearch />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && autocompleteResults.length > 0 && (
            <div className="search-dropdown">
              <div className="p-2 px-3 small text-muted border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                <span>Instant Suggestions</span>
                {isSearching && <span className="spinner-border spinner-border-sm text-primary" />}
              </div>
              {autocompleteResults.map((item) => (
                <div
                  key={item.imdbID}
                  className="search-dropdown-item"
                  onClick={() => handleSelectAutocomplete(item)}
                >
                  <img
                    src={item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/40x60'}
                    alt={item.Title}
                    style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-bold text-truncate" style={{ fontSize: '0.9rem' }}>
                      {item.Title}
                    </div>
                    <div className="small text-muted d-flex gap-2">
                      <span>{item.Year}</span>
                      <span>•</span>
                      <span className="text-uppercase">{item.Type || 'Movie'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nav Links & Controls */}
        <div className="d-flex align-items-center gap-2">
          <button
            className={`nav-custom-pill ${activeView === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveView('explore')}
          >
            <FaCompass /> <span className="d-none d-md-inline">Explore</span>
          </button>

          <button
            className={`nav-custom-pill ${activeView === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveView('watchlist')}
          >
            <FaBookmark />
            <span className="d-none d-md-inline">Watchlist</span>
            {watchlist.length > 0 && (
              <span className="badge bg-warning text-dark rounded-pill ms-1">
                {watchlist.length}
              </span>
            )}
          </button>

          <button
            className={`nav-custom-pill ${activeView === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveView('favorites')}
          >
            <FaHeart />
            <span className="d-none d-md-inline">Favorites</span>
            {favorites.length > 0 && (
              <span className="badge bg-danger rounded-pill ms-1">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            className={`nav-custom-pill ${activeView === 'taste' ? 'active' : ''}`}
            onClick={() => setActiveView('taste')}
          >
            <FaChartPie /> <span className="d-none d-md-inline">Taste & Stats</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2 ms-1"
            style={{ width: '38px', height: '38px' }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <FaSun className="text-warning" /> : <FaMoon className="text-primary" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
