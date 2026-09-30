import React from 'react';
import { FaFilter, FaRedoAlt, FaHistory, FaTimes } from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';

export default function FilterBar({
  type,
  setType,
  year,
  setYear,
  sortBy,
  setSortBy,
  onReset,
  onSelectSearchHistory,
}) {
  const { searchHistory, removeSearchHistory } = usePersonalization();

  const hasActiveFilters = type !== '' || year !== '' || sortBy !== 'relevance';

  return (
    <div className="glass-panel p-3 rounded-4 mb-4">
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

      {/* Filter and Sort Row */}
      <div className="row g-2 align-items-center">
        <div className="col-auto d-flex align-items-center gap-2 text-muted small fw-bold">
          <FaFilter /> Filters:
        </div>

        {/* Type Filter */}
        <div className="col-md-3 col-6">
          <select
            className="form-select form-select-sm bg-transparent border-secondary text-body"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="" className="text-dark">All Types</option>
            <option value="movie" className="text-dark">Movies Only</option>
            <option value="series" className="text-dark">TV Series</option>
            <option value="episode" className="text-dark">Episodes</option>
          </select>
        </div>

        {/* Year Filter */}
        <div className="col-md-2 col-6">
          <input
            type="number"
            placeholder="Year (e.g. 2024)"
            min="1900"
            max="2030"
            className="form-control form-control-sm bg-transparent border-secondary text-body"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        {/* Sort By */}
        <div className="col-md-3 col-6">
          <select
            className="form-select form-select-sm bg-transparent border-secondary text-body"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance" className="text-dark">Sort: Relevance</option>
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
              <FaRedoAlt /> Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
