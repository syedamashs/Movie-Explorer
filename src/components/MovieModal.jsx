import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaCheck,
  FaPlay,
  FaShareAlt,
  FaExternalLinkAlt,
  FaAward,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';

export default function MovieModal({ movie, onClose, onSearchPerson, initialShowTrailer = false }) {
  const {
    isFavorite,
    isWatchlist,
    isWatched,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    setMovieRating,
    getMovieRating,
    showToast,
    addRecentlyViewed,
  } = usePersonalization();

  const [showTrailer, setShowTrailer] = useState(initialShowTrailer);
  const [hoverStar, setHoverStar] = useState(0);

  const userRatingData = movie ? getMovieRating(movie.imdbID) : null;
  const [ratingVal, setRatingVal] = useState(userRatingData ? userRatingData.rating : 0);
  const [reviewVal, setReviewVal] = useState(userRatingData ? userRatingData.review : '');

  useEffect(() => {
    if (movie) {
      addRecentlyViewed(movie);
      const existing = getMovieRating(movie.imdbID);
      setRatingVal(existing ? existing.rating : 0);
      setReviewVal(existing ? existing.review : '');
      setShowTrailer(initialShowTrailer);
    }
  }, [movie, initialShowTrailer]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const inFav = isFavorite(movie.imdbID);
  const inWatch = isWatchlist(movie.imdbID);
  const inSeen = isWatched(movie.imdbID);

  const fallbackPoster =
    'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23888%3Bfont-weight%3Abold%3Bfont-family%3Asans-serif%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23181e29%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2285%22%20y%3D%22230%22%3ENo%20Poster%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

  const posterSrc = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : fallbackPoster;

  const handleSaveRating = (e) => {
    e.preventDefault();
    setMovieRating(movie, ratingVal, reviewVal);
  };

  const handleShare = () => {
    const textToCopy = `Check out "${movie.Title}" (${movie.Year}) on Movie Explorer! IMDb Rating: ${movie.imdbRating || 'N/A'}/10. https://www.imdb.com/title/${movie.imdbID}/`;
    navigator.clipboard.writeText(textToCopy);
    showToast('Movie link copied to clipboard! 📋', 'success');
  };

  const parseList = (str) => {
    if (!str || str === 'N/A') return [];
    return str.split(',').map((s) => s.trim());
  };

  const genres = parseList(movie.Genre);
  const actors = parseList(movie.Actors);
  const directors = parseList(movie.Director);

  // Safe trailer search embed URL
  const trailerEmbedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(
    `${movie.Title} ${movie.Year} official trailer`
  )}&autoplay=1`;

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div
        className="custom-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal Top Bar */}
        <div className="d-flex align-items-center justify-content-between p-3 px-4 border-bottom border-secondary border-opacity-25 sticky-top bg-body">
          <div className="d-flex align-items-center gap-2">
            <span className="type-badge">{movie.Type || 'Feature'}</span>
            <span className="badge bg-secondary bg-opacity-25 text-body">{movie.Rated || 'Not Rated'}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm rounded-circle p-2"
              onClick={handleShare}
              title="Share / Copy Link"
            >
              <FaShareAlt />
            </button>
            <button
              className="btn btn-outline-secondary btn-sm rounded-circle p-2"
              onClick={onClose}
              title="Close (Esc)"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Video Trailer view or Main Info */}
        {showTrailer ? (
          <div className="p-3 bg-black">
            <div className="d-flex justify-content-between align-items-center mb-2 px-2 text-white">
              <span className="fw-bold">🎬 Official Trailer: {movie.Title}</span>
              <button
                className="btn btn-sm btn-outline-light rounded-pill"
                onClick={() => setShowTrailer(false)}
              >
                Back to Details
              </button>
            </div>
            <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
              <iframe
                src={trailerEmbedUrl}
                title={`${movie.Title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : null}

        <div className="p-4">
          <div className="row g-4">
            {/* Poster Column */}
            <div className="col-md-4 text-center">
              <div className="rounded-4 overflow-hidden shadow-lg mb-3">
                <img
                  src={posterSrc}
                  alt={movie.Title}
                  className="img-fluid w-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn btn-danger w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 py-2"
                  onClick={() => setShowTrailer(true)}
                >
                  <FaPlay /> Watch Trailer
                </button>

                <div className="d-flex gap-2">
                  <button
                    className={`btn flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1 py-2 ${
                      inFav ? 'btn-danger' : 'btn-outline-secondary'
                    }`}
                    onClick={() => toggleFavorite(movie)}
                  >
                    {inFav ? <FaHeart /> : <FaRegHeart />}
                    {inFav ? 'Favorited' : 'Favorite'}
                  </button>

                  <button
                    className={`btn flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1 py-2 ${
                      inWatch ? 'btn-warning text-dark' : 'btn-outline-secondary'
                    }`}
                    onClick={() => toggleWatchlist(movie)}
                  >
                    {inWatch ? <FaBookmark /> : <FaRegBookmark />}
                    {inWatch ? 'Watchlist' : 'Watchlist'}
                  </button>

                  <button
                    className={`btn rounded-pill d-flex align-items-center justify-content-center px-3 py-2 ${
                      inSeen ? 'btn-success' : 'btn-outline-secondary'
                    }`}
                    title="Mark Watched"
                    onClick={() => toggleWatched(movie)}
                  >
                    <FaCheck />
                  </button>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="col-md-8">
              <h2 className="fw-bold mb-2 brand-font">{movie.Title}</h2>

              {/* Quick stats strip */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3 text-muted small">
                <span className="d-flex align-items-center gap-1">
                  <FaCalendarAlt /> {movie.Year}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <FaClock /> {movie.Runtime || 'N/A'}
                </span>
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <span className="badge bg-warning text-dark fw-bold px-2 py-1 rounded">
                    ★ {movie.imdbRating} / 10 ({movie.imdbVotes || 'Votes'})
                  </span>
                )}
                {movie.Metascore && movie.Metascore !== 'N/A' && (
                  <span className="badge bg-success text-white fw-bold px-2 py-1 rounded">
                    Metascore: {movie.Metascore}
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="badge bg-secondary bg-opacity-25 text-body px-3 py-2 rounded-pill"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Plot */}
              <div className="mb-4">
                <h6 className="fw-bold text-uppercase small text-muted">Synopsis</h6>
                <p className="lead fs-6 lh-base">{movie.Plot || 'No plot synopsis available.'}</p>
              </div>

              {/* Cast & Crew with clickable names! */}
              <div className="mb-4">
                <div className="mb-2">
                  <strong className="small text-muted text-uppercase d-block mb-1">Director:</strong>
                  {directors.map((d) => (
                    <span
                      key={d}
                      className="crew-chip"
                      title={`Search for movies directed by ${d}`}
                      onClick={() => {
                        onSearchPerson(d);
                        onClose();
                      }}
                    >
                      {d} 🔍
                    </span>
                  ))}
                </div>

                <div className="mb-2">
                  <strong className="small text-muted text-uppercase d-block mb-1">Starring Cast:</strong>
                  {actors.map((a) => (
                    <span
                      key={a}
                      className="crew-chip"
                      title={`Search movies featuring ${a}`}
                      onClick={() => {
                        onSearchPerson(a);
                        onClose();
                      }}
                    >
                      {a} 🔍
                    </span>
                  ))}
                </div>

                {movie.Awards && movie.Awards !== 'N/A' && (
                  <div className="mt-3 p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 d-flex align-items-center gap-2 small">
                    <FaAward className="text-warning fs-5 flex-shrink-0" />
                    <span>{movie.Awards}</span>
                  </div>
                )}
              </div>

              {/* Personal Rating & Review Box */}
              <div className="p-3 rounded-4 glass-panel mb-4">
                <h6 className="fw-bold mb-2 d-flex align-items-center justify-content-between">
                  <span>✍️ Your Personal Rating & Notes</span>
                  {userRatingData && (
                    <span className="small text-success fw-normal">Saved on {userRatingData.updatedAt}</span>
                  )}
                </h6>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="small text-muted">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= (hoverStar || ratingVal) ? 'active' : ''}`}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setRatingVal(star)}
                    >
                      ★
                    </button>
                  ))}
                  <span className="fw-bold ms-2">{ratingVal > 0 ? `${ratingVal} / 5 Stars` : 'Unrated'}</span>
                </div>

                <div className="mb-2">
                  <textarea
                    className="form-control bg-transparent border-secondary text-body"
                    rows="2"
                    placeholder="Write your personal thoughts, favorite moments, or review..."
                    value={reviewVal}
                    onChange={(e) => setReviewVal(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary btn-sm rounded-pill px-4"
                    onClick={handleSaveRating}
                  >
                    Save Review
                  </button>
                </div>
              </div>

              {/* External database links */}
              <div className="d-flex flex-wrap gap-2 pt-2 border-top border-secondary border-opacity-25">
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-warning btn-sm rounded-pill d-flex align-items-center gap-1"
                >
                  <FaExternalLinkAlt /> View on IMDb
                </a>
                <a
                  href={`https://www.rottentomatoes.com/search?search=${encodeURIComponent(movie.Title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1"
                >
                  <FaExternalLinkAlt /> Rotten Tomatoes
                </a>
                <a
                  href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.Title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1"
                >
                  <FaExternalLinkAlt /> Stream on JustWatch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
