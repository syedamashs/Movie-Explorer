import React from 'react';
import { FaFilter, FaRedoAlt, FaHistory, FaTimes, FaTags } from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';
import { POPULAR_GENRES, LANGUAGES } from '../services/tmdbApi';

export default function FilterBar({
  type,
  setType,
  year,
  setYear,
  sortBy,
  setSortBy,
  selectedGenre,
  setSelectedGenre,
  selectedLanguage,
  setSelectedLanguage,
  onReset,
  onSelectSearchHistory,
}) {
  const { searchHistory, removeSearchHistory } = usePersonalization();

  const hasActiveFilters =
    type !== '' ||
    year !== '' ||
    sortBy !== 'relevance' ||
    selectedGenre ||
    (selectedLanguage && selectedLanguage !== 'ta');

  return (
    <div className="glass-panel p-3 rounded-4 mb-4 shadow-sm">
      {/* Search History Chips */}
      {searchHistory && searchHistory.length > 0 && (
        <div className="d-flex align-items-center flex-wrap gap-2 mb-3 pb-2 border-bottom border-secondary border-opacity-25">
          <span className="small text-muted d-flex align-items-center gap-1">
            <FaHistory /> Recent:
          </span>
          {searchHistory.map((item) => (
            <span
              key={item}
              className="badge bg-secondary bg-opacity-25 text-body rounded-pill px-3 py-2 d-flex align-items-center gap-2"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <span onClick={() => onSelectSearchHistory(item)}>{item}</span>
              <FaTimes
                style={{ fontSize: '0.75rem', opacity: 0.6 }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeSearchHistory(item);
                }}
              />
            </span>
          ))}
        </div>
      )}

      {/* TMDB Quick Genre Filter Pills */}
      <div className="d-flex align-items-center flex-wrap gap-2 mb-3 pb-2 border-bottom border-secondary border-opacity-25">
        <span className="small text-muted d-flex align-items-center gap-1 me-1">
          <FaTags /> Genres:
        </span>
        <button
          className={`badge rounded-pill border-0 px-3 py-2 ${
            !selectedGenre ? 'bg-primary text-white' : 'bg-secondary bg-opacity-25 text-body'
          }`}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
          onClick={() => setSelectedGenre && setSelectedGenre(null)}
        >
          All Genres
        </button>
        {POPULAR_GENRES.map((g) => {
          const isSelected = selectedGenre === g.id;
          return (
            <button
              key={g.id}
              className={`badge rounded-pill border-0 px-3 py-2 ${
                isSelected ? 'bg-primary text-white shadow-sm' : 'bg-secondary bg-opacity-25 text-body'
              }`}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setSelectedGenre && setSelectedGenre(isSelected ? null : g.id)}
            >
              {g.emoji} {g.name}
            </button>
          );
        })}
      </div>

      {/* Filter and Sort Row with Language Dropdown */}
      <div className="row g-2 align-items-center">
        <div className="col-auto d-flex align-items-center gap-2 text-muted small fw-bold">
          <FaFilter /> Filters:
        </div>

        {/* Language Filter Dropdown */}
        <div className="col-md-2 col-6">
          <select
            className="form-select form-select-sm bg-transparent border-secondary text-body fw-medium"
            value={selectedLanguage || 'ta'}
            onChange={(e) => setSelectedLanguage && setSelectedLanguage(e.target.value)}
            title="Filter by Cinema Language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-dark">
                {lang.emoji} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Media Type Filter */}
        <div className="col-md-3 col-6">
          <select
            className="form-select form-select-sm bg-transparent border-secondary text-body"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="" className="text-dark">All Media Types</option>
            <option value="movie" className="text-dark">Movies Only</option>
            <option value="series" className="text-dark">TV Series Only</option>
          </select>
        </div>

        {/* Year Filter */}
        <div className="col-md-2 col-6">
          <div className="input-group input-group-sm">
            <input
              type="number"
              placeholder="Year (e.g. 2016)"
              min="1900"
              max="2030"
              className="form-control bg-transparent border-secondary text-body"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              title="Filter by Release Year (e.g. 2016, 2024)"
            />
            {year && (
              <button
                type="button"
                className="btn btn-outline-secondary border-secondary text-muted px-2"
                onClick={() => setYear('')}
                title="Clear Year"
              >
                <FaTimes style={{ fontSize: '0.75rem' }} />
              </button>
            )}
          </div>
        </div>

        {/* Sort By */}
        <div className="col-md-3 col-6">
          <select
            className="form-select form-select-sm bg-transparent border-secondary text-body"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance" className="text-dark">Sort: Most Popular</option>
            <option value="rating-desc" className="text-dark">Sort: Highest Rating</option>
            <option value="year-desc" className="text-dark">Sort: Newest First</option>
            <option value="year-asc" className="text-dark">Sort: Oldest First</option>
            <option value="title-asc" className="text-dark">Sort: Title (A-Z)</option>
          </select>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <div className="col-auto ms-auto">
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1"
              onClick={onReset}
            >
              <FaRedoAlt /> Reset All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
