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

  const id = movie.imdbID || movie.id;
  const title = movie.Title || movie.title || 'Untitled';
  const year = movie.Year || (movie.release_date ? movie.release_date.slice(0, 4) : 'N/A');
  const poster = movie.Poster || movie.poster_path;
  const type = movie.Type === 'series' || movie.media_type === 'tv' ? 'TV Series' : 'Movie';
  const rating = movie.imdbRating && movie.imdbRating !== 'N/A' 
    ? movie.imdbRating 
    : (movie.vote_average ? movie.vote_average.toFixed(1) : null);

  const inFavorites = isFavorite(id);
  const inWatchlist = isWatchlist(id);
  const inWatched = isWatched(id);
  const userRating = getMovieRating(id);

  const fallbackPoster =
    'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23888%3Bfont-weight%3Abold%3Bfont-family%3Asans-serif%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23181e29%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2285%22%20y%3D%22230%22%3ENo%20Poster%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

  const posterUrl = poster && poster !== 'N/A' ? poster : fallbackPoster;

  // Rating color helper
  const numRating = parseFloat(rating);
  let ratingClass = 'bg-secondary';
  if (!isNaN(numRating)) {
    if (numRating >= 7.8) ratingClass = 'bg-success text-white shadow-sm';
    else if (numRating >= 6.5) ratingClass = 'bg-warning text-dark';
    else if (numRating >= 5.0) ratingClass = 'bg-secondary text-light';
  }

  return (
    <div className="movie-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="movie-poster-container">
        <img
          src={posterUrl}
          alt={title}
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
          {rating && (
            <span className={`badge rounded-pill d-flex align-items-center gap-1 ${ratingClass}`} style={{ fontSize: '0.78rem', width: 'fit-content' }}>
              <FaStar /> {rating}
            </span>
          )}
          {userRating && (
            <span
              className="badge bg-warning text-dark d-flex align-items-center gap-1 shadow-sm"
              style={{ fontSize: '0.72rem', width: 'fit-content' }}
            >
              ★ {userRating.rating}/5 My Score
            </span>
          )}
        </div>
      </div>

      <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <h6
            className="fw-bold mb-1 text-truncate"
            title={title}
            style={{ fontSize: '0.98rem' }}
          >
            {title}
          </h6>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top border-secondary border-opacity-25">
          <span className="small text-muted">{year}</span>
          <span className="type-badge">{type}</span>
        </div>
      </div>
    </div>
  );
}

