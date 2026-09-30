import React from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaCheck, FaStar } from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';

export default function MovieCard({ movie, onClick }) {
  const {
    isFavorite,
    isWatchlist,
    isWatched,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    getMovieRating,
  } = usePersonalization();

  const { Title, Year, Poster, imdbID, Type, imdbRating } = movie;
  const inFavorites = isFavorite(imdbID);
  const inWatchlist = isWatchlist(imdbID);
  const inWatched = isWatched(imdbID);
  const userRating = getMovieRating(imdbID);

  const fallbackPoster =
    'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23888%3Bfont-weight%3Abold%3Bfont-family%3Asans-serif%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23181e29%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2285%22%20y%3D%22230%22%3ENo%20Poster%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

  const posterUrl = Poster && Poster !== 'N/A' ? Poster : fallbackPoster;

  return (
    <div className="movie-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="movie-poster-container">
        <img
          src={posterUrl}
          alt={Title}
          className="movie-poster"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackPoster;
          }}
        />
        <div className="movie-card-overlay" />

        {/* Quick Action Pill Buttons */}
        <div className="card-quick-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`action-pill-btn ${inFavorites ? 'active-favorite' : ''}`}
            title={inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
            onClick={() => toggleFavorite(movie)}
          >
            {inFavorites ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button
            className={`action-pill-btn ${inWatchlist ? 'active-watchlist' : ''}`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            onClick={() => toggleWatchlist(movie)}
          >
            {inWatchlist ? <FaBookmark /> : <FaRegBookmark />}
          </button>
          <button
            className={`action-pill-btn ${inWatched ? 'active-watched' : ''}`}
            title={inWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
            onClick={() => toggleWatched(movie)}
          >
            <FaCheck />
          </button>
        </div>

        {/* Badges on Top-Left */}
        <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1">
          {imdbRating && imdbRating !== 'N/A' && (
            <span className="rating-badge">
              <FaStar /> {imdbRating}
            </span>
          )}
          {userRating && (
            <span
              className="badge bg-warning text-dark d-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem', width: 'fit-content' }}
            >
              ★ {userRating.rating}/5 My Rating
            </span>
          )}
        </div>
      </div>

      <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <h6
            className="fw-bold mb-1 text-truncate"
            title={Title}
            style={{ fontSize: '0.98rem' }}
          >
            {Title}
          </h6>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top border-secondary border-opacity-25">
          <span className="small text-muted">{Year}</span>
          <span className="type-badge">{Type || 'Movie'}</span>
        </div>
      </div>
    </div>
  );
}
