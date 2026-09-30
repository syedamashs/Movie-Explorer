import React from 'react';
import { FaPlay, FaBookmark, FaCheck, FaInfoCircle, FaStar } from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';

export default function HeroBanner({ movie, onOpenModal, onOpenTrailer }) {
  const { isWatchlist, toggleWatchlist } = usePersonalization();

  if (!movie) return null;

  const inWatchlist = isWatchlist(movie.imdbID);

  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(9, 11, 16, 0.95) 20%, rgba(9, 11, 16, 0.6) 60%, rgba(9, 11, 16, 0.2) 100%), url(${movie.Poster})`,
      }}
    >
      <div className="hero-overlay">
        <div className="row align-items-center">
          <div className="col-lg-8 col-md-10">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-danger text-uppercase px-3 py-2 rounded-pill fw-bold">
                ★ Spotlight Premiere
              </span>
              <span className="rating-badge">
                <FaStar /> {movie.imdbRating || '8.6'} IMDb
              </span>
              <span className="badge bg-dark bg-opacity-75 border border-secondary text-secondary">
                {movie.Year}
              </span>
              <span className="badge bg-dark bg-opacity-75 border border-secondary text-secondary">
                {movie.Runtime || '2h 46m'}
              </span>
            </div>

            <h1 className="display-4 fw-extrabold text-white mb-3 brand-font">
              {movie.Title}
            </h1>

            <p
              className="lead text-light text-opacity-75 mb-4"
              style={{
                maxWidth: '650px',
                fontSize: '1.05rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {movie.Plot ||
                'A mythic and emotionally charged hero journey through the universe of courage, power, and destiny.'}
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <button
                className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none' }}
                onClick={() => onOpenTrailer(movie)}
              >
                <FaPlay /> Watch Trailer
              </button>

              <button
                className={`btn ${
                  inWatchlist ? 'btn-warning' : 'btn-outline-light'
                } d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold`}
                onClick={() => toggleWatchlist(movie)}
              >
                {inWatchlist ? <FaCheck /> : <FaBookmark />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                className="btn btn-outline-secondary text-light d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                onClick={() => onOpenModal(movie)}
              >
                <FaInfoCircle /> Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
