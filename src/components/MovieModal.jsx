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
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaTv,
  FaFilm,
  FaUsers,
  FaThList,
} from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';
import { getProfileUrl, getPosterUrl, formatCurrency } from '../services/tmdbApi';

export default function MovieModal({
  movie,
  onClose,
  onSearchPerson,
  onSelectMovie,
  initialShowTrailer = false,
}) {
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
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [hoverStar, setHoverStar] = useState(0);

  const movieId = movie ? (movie.imdbID || movie.id) : null;
  const userRatingData = movieId ? getMovieRating(movieId) : null;
  const [ratingVal, setRatingVal] = useState(userRatingData ? userRatingData.rating : 0);
  const [reviewVal, setReviewVal] = useState(userRatingData ? userRatingData.review : '');

  useEffect(() => {
    if (movie) {
      addRecentlyViewed(movie);
      const existing = getMovieRating(movieId);
      setRatingVal(existing ? existing.rating : 0);
      setReviewVal(existing ? existing.review : '');
      setShowTrailer(initialShowTrailer);
      setSelectedVideoKey(movie.trailerKey || (movie.videos?.[0]?.key || null));
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

  const inFav = isFavorite(movieId);
  const inWatch = isWatchlist(movieId);
  const inSeen = isWatched(movieId);

  const posterSrc = movie.Poster || getPosterUrl(movie.poster_path);
  const backdropSrc = movie.Backdrop || movie.backdrop_w1280;

  const handleSaveRating = (e) => {
    e.preventDefault();
    setMovieRating(movie, ratingVal, reviewVal);
  };

  const handleShare = () => {
    const tmdbLink = movie.id ? `https://www.themoviedb.org/${movie.media_type || 'movie'}/${movie.id}` : '';
    const textToCopy = `Check out "${movie.Title}" (${movie.Year}) on Movie Explorer! Score: ${movie.imdbRating || movie.vote_average}/10. ${tmdbLink}`;
    navigator.clipboard.writeText(textToCopy);
    showToast('Movie link copied to clipboard! 📋', 'success');
  };

  // YouTube Embed URL (Direct TMDB Trailer Key or Fallback Search)
  const trailerEmbedUrl = selectedVideoKey
    ? `https://www.youtube-nocookie.com/embed/${selectedVideoKey}?autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(
        `${movie.Title} ${movie.Year} official trailer`
      )}&autoplay=1`;

  const genres = Array.isArray(movie.genres)
    ? movie.genres.map((g) => (typeof g === 'object' ? g.name : g))
    : movie.Genre ? movie.Genre.split(',').map((g) => g.trim()) : [];

  const castMembers = Array.isArray(movie.cast) ? movie.cast.slice(0, 10) : [];
  const similarItems = Array.isArray(movie.recommendations) && movie.recommendations.length > 0
    ? movie.recommendations.slice(0, 6)
    : (Array.isArray(movie.similar) ? movie.similar.slice(0, 6) : []);

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div
        className="custom-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Backdrop Banner Header if available */}
        {backdropSrc ? (
          <div
            className="modal-backdrop-hero"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(9, 11, 16, 0.25) 0%, rgba(9, 11, 16, 0.65) 60%, var(--bg-modal) 100%), url(${backdropSrc})`,
            }}
          >
            {/* Top Bar Floating */}
            <div className="d-flex align-items-center justify-content-between p-3 px-4 position-absolute top-0 start-0 w-100 z-3">
              <div className="d-flex align-items-center gap-2">
                <span className="type-badge shadow-sm">
                  {movie.Type === 'series' ? 'TV Series' : 'Movie'}
                </span>
                {movie.status && (
                  <span className="badge bg-dark bg-opacity-75 border border-secondary text-secondary">
                    {movie.status}
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="modal-glass-btn shadow-sm"
                  onClick={handleShare}
                  title="Share / Copy Link"
                >
                  <FaShareAlt />
                </button>
                <button
                  className="modal-glass-btn shadow-sm"
                  onClick={onClose}
                  title="Close (Esc)"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Clean Header when no backdrop */
          <div className="d-flex align-items-center justify-content-between p-3 px-4 border-bottom border-secondary border-opacity-25">
            <div className="d-flex align-items-center gap-2">
              <span className="type-badge shadow-sm">
                {movie.Type === 'series' ? 'TV Series' : 'Movie'}
              </span>
              {movie.status && (
                <span className="badge bg-secondary bg-opacity-25 text-body">
                  {movie.status}
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary btn-sm rounded-circle p-2 shadow-sm"
                onClick={handleShare}
                title="Share / Copy Link"
              >
                <FaShareAlt />
              </button>
              <button
                className="btn btn-outline-secondary btn-sm rounded-circle p-2 shadow-sm"
                onClick={onClose}
                title="Close (Esc)"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Video Trailer View */}
        {showTrailer ? (
          <div className="p-3 bg-black">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2 px-2 text-white">
              <span className="fw-bold d-flex align-items-center gap-2">
                <FaPlay className="text-danger" /> Official Video: {movie.Title}
              </span>
              <div className="d-flex align-items-center gap-2">
                {movie.videos && movie.videos.length > 1 && (
                  <select
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    style={{ maxWidth: '220px' }}
                    value={selectedVideoKey}
                    onChange={(e) => setSelectedVideoKey(e.target.value)}
                  >
                    {movie.videos.slice(0, 5).map((v) => (
                      <option key={v.id} value={v.key}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  className="btn btn-sm btn-outline-light rounded-pill"
                  onClick={() => setShowTrailer(false)}
                >
                  Back to Details
                </button>
              </div>
            </div>
            <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-lg">
              <iframe
                src={trailerEmbedUrl}
                title={`${movie.Title} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : null}

        <div className="p-4 pt-3 position-relative">
          <div className="row g-4 align-items-start position-relative">
            {/* Poster Column */}
            <div className="col-md-4 text-center">
              <div className={backdropSrc ? 'modal-poster-wrapper mb-3' : 'mb-3'}>
                <div
                  className="rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25"
                  style={{ background: 'var(--bg-modal)' }}
                >
                  <img
                    src={posterSrc}
                    alt={movie.Title}
                    className="img-fluid w-100"
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn btn-danger w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
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
                    {inWatch ? 'Saved' : 'Watchlist'}
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
            <div className="col-md-8 pt-1">
              <h2 className="fw-bold mb-1 brand-font text-body">{movie.Title}</h2>

              {movie.tagline && (
                <p className="fst-italic text-warning text-opacity-80 fw-medium mb-3">
                  "{movie.tagline}"
                </p>
              )}

              {/* Quick stats strip */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3 text-muted small">
                <span className="d-flex align-items-center gap-1">
                  <FaCalendarAlt /> {movie.release_date || movie.Year}
                </span>
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <span className="d-flex align-items-center gap-1">
                    <FaClock /> {movie.Runtime}
                  </span>
                )}
                {movie.number_of_seasons && (
                  <span className="d-flex align-items-center gap-1">
                    <FaTv /> {movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''} ({movie.number_of_episodes} Episodes)
                  </span>
                )}
                {movie.vote_average > 0 && (
                  <span className="badge bg-success text-white fw-bold px-2 py-1 rounded shadow-sm">
                    ★ {movie.vote_average.toFixed(1)} / 10 TMDB ({movie.vote_count?.toLocaleString()} votes)
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
                <h6 className="fw-bold text-uppercase small text-muted">Overview</h6>
                <p className="lead fs-6 lh-base">{movie.Plot || movie.overview || 'No synopsis available.'}</p>
              </div>

              {/* Cast with Profile Avatars! */}
              {castMembers.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold text-uppercase small text-muted d-flex align-items-center gap-2 mb-3">
                    <FaUsers /> Top Cast
                  </h6>
                  <div className="d-flex flex-wrap gap-3">
                    {castMembers.map((actor) => (
                      <div
                        key={actor.id || actor.name}
                        className="d-flex align-items-center gap-2 p-2 rounded-3 glass-panel"
                        style={{ cursor: 'pointer', transition: 'all 0.2s', minWidth: '150px' }}
                        title={`Search for movies with ${actor.name}`}
                        onClick={() => {
                          if (onSearchPerson) {
                            onSearchPerson(actor.name);
                            onClose();
                          }
                        }}
                      >
                        <img
                          src={getProfileUrl(actor.profile_path)}
                          alt={actor.name}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div style={{ lineHeight: 1.2 }}>
                          <span className="fw-bold d-block small">{actor.name}</span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {actor.character || 'Cast'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Director & Crew */}
              {(movie.Director && movie.Director !== 'N/A') && (
                <div className="mb-3 small">
                  <strong className="text-muted text-uppercase me-2">Director:</strong>
                  <span
                    className="crew-chip"
                    onClick={() => {
                      if (onSearchPerson) {
                        onSearchPerson(movie.Director);
                        onClose();
                      }
                    }}
                  >
                    {movie.Director} 🔍
                  </span>
                </div>
              )}

              {/* Financial Stats */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="row g-2 mb-4 p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 small">
                  {movie.budget > 0 && (
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Production Budget</span>
                      <strong>{formatCurrency(movie.budget)}</strong>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Worldwide Box Office</span>
                      <strong className="text-success">{formatCurrency(movie.revenue)}</strong>
                    </div>
                  )}
                </div>
              )}

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

              {/* Similar / Recommended Titles */}
              {similarItems.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold text-uppercase small text-muted mb-3 d-flex align-items-center gap-2">
                    <FaThList /> More Like This
                  </h6>
                  <div className="row g-2">
                    {similarItems.map((rec) => (
                      <div
                        key={rec.id}
                        className="col-4 col-sm-3 col-md-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (onSelectMovie) onSelectMovie(rec);
                        }}
                      >
                        <div className="rounded-3 overflow-hidden shadow-sm position-relative">
                          <img
                            src={getPosterUrl(rec.poster_path, 'w185')}
                            alt={rec.Title}
                            className="img-fluid w-100"
                            style={{ height: '110px', objectFit: 'cover' }}
                          />
                        </div>
                        <span
                          className="d-block small text-truncate mt-1 text-center"
                          title={rec.Title}
                          style={{ fontSize: '0.78rem' }}
                        >
                          {rec.Title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Database Links */}
              <div className="d-flex flex-wrap gap-2 pt-2 border-top border-secondary border-opacity-25">
                {movie.id && (
                  <a
                    href={`https://www.themoviedb.org/${movie.media_type || 'movie'}/${movie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-info btn-sm rounded-pill d-flex align-items-center gap-1"
                  >
                    <FaExternalLinkAlt /> View on TMDB
                  </a>
                )}
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-warning btn-sm rounded-pill d-flex align-items-center gap-1"
                  >
                    <FaExternalLinkAlt /> View on IMDb
                  </a>
                )}
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

