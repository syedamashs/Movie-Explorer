import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FaPlay,
  FaBookmark,
  FaCheck,
  FaInfoCircle,
  FaStar,
  FaFire,
  FaChevronLeft,
  FaChevronRight,
  FaPause,
} from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';

export default function HeroBanner({ movies = [], movie = null, onOpenModal, onOpenTrailer }) {
  const { isWatchlist, toggleWatchlist } = usePersonalization();

  // Support array of movies or single movie fallback
  const items = Array.isArray(movies) && movies.length > 0 ? movies : movie ? [movie] : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef(null);

  const changeSlide = useCallback((newIndex) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
      setProgressKey((prev) => prev + 1);
    }, 220);
  }, []);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    changeSlide((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, changeSlide]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    changeSlide((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, changeSlide]);

  // Auto-rotation every 5 seconds (5000ms) as requested!
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length, isPaused, handleNext]);

  if (items.length === 0) return null;

  // Active movie for the current slide
  const activeMovie = items[currentIndex] || items[0];
  const inWatchlist = isWatchlist(activeMovie.imdbID || activeMovie.id);
  const backdropUrl = activeMovie.Backdrop || activeMovie.backdrop_w1280 || activeMovie.Poster;

  return (
    <div
      className="hero-banner mb-5 position-relative"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(9, 11, 16, 0.95) 15%, rgba(9, 11, 16, 0.75) 55%, rgba(9, 11, 16, 0.25) 100%), url(${backdropUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        transition: 'background-image 0.4s ease-in-out',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-overlay position-relative">
        <div className="row align-items-center">
          <div className="col-lg-8 col-md-11">
            <div className={`hero-content-wrapper ${isFading ? 'hero-content-fading' : ''}`}>
              {/* Badges strip */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="badge bg-danger text-uppercase px-3 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-1 shadow-sm">
                  <FaFire /> Featured Premiere
                </span>
                <span className="badge bg-dark bg-opacity-75 border border-secondary text-warning fw-bold px-2 py-1 rounded-pill">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
                {isPaused && (
                  <span
                    className="badge bg-secondary bg-opacity-50 text-light px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                    style={{ fontSize: '0.72rem' }}
                  >
                    <FaPause style={{ fontSize: '0.65rem' }} /> Paused
                  </span>
                )}
                <span className="rating-badge fw-bold">
                  <FaStar />{' '}
                  {activeMovie.imdbRating ||
                    (activeMovie.vote_average ? activeMovie.vote_average.toFixed(1) : '8.5')}{' '}
                  TMDB
                </span>
                <span className="badge bg-dark bg-opacity-75 border border-secondary text-secondary">
                  {activeMovie.Year}
                </span>
                {activeMovie.Runtime && activeMovie.Runtime !== 'N/A' && (
                  <span className="badge bg-dark bg-opacity-75 border border-secondary text-secondary">
                    {activeMovie.Runtime}
                  </span>
                )}
                <span className="type-badge text-uppercase">
                  {activeMovie.Type === 'series' ? 'TV Series' : 'Movie'}
                </span>
              </div>

              {/* Title */}
              <h1 className="display-4 fw-extrabold text-white mb-2 brand-font">
                {activeMovie.Title}
              </h1>

              {/* Tagline */}
              {activeMovie.tagline && (
                <p
                  className="fst-italic text-warning text-opacity-80 fw-medium mb-3"
                  style={{ fontSize: '1.08rem' }}
                >
                  "{activeMovie.tagline}"
                </p>
              )}

              {/* Synopsis */}
              <p
                className="lead text-light text-opacity-85 mb-4"
                style={{
                  maxWidth: '680px',
                  fontSize: '1.02rem',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {activeMovie.Plot ||
                  activeMovie.overview ||
                  'A cinematic journey through power, courage, and legendary storytelling.'}
              </p>

              {/* CTA Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3">
                <button
                  className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    border: 'none',
                  }}
                  onClick={() => onOpenTrailer(activeMovie)}
                >
                  <FaPlay /> Watch Trailer
                </button>

                <button
                  className={`btn ${
                    inWatchlist ? 'btn-warning text-dark' : 'btn-outline-light'
                  } d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold`}
                  onClick={() => toggleWatchlist(activeMovie)}
                >
                  {inWatchlist ? <FaCheck /> : <FaBookmark />}
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>

                <button
                  className="btn btn-outline-secondary text-light d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill"
                  onClick={() => onOpenModal(activeMovie)}
                >
                  <FaInfoCircle /> Details & Cast
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrows (Left & Right) */}
        {items.length > 1 && (
          <div
            className="position-absolute end-0 top-50 translate-middle-y me-4 d-none d-md-flex flex-column gap-2"
            style={{ zIndex: 10 }}
          >
            <button
              className="hero-nav-arrow"
              onClick={handlePrev}
              title="Previous Film"
              aria-label="Previous Film"
            >
              <FaChevronLeft />
            </button>
            <button
              className="hero-nav-arrow"
              onClick={handleNext}
              title="Next Film (Next in 5s)"
              aria-label="Next Film"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Bottom Slide Indicators with Animated 5-Second Progress Bar */}
        {items.length > 1 && (
          <div className="d-flex align-items-center gap-2 mt-4 pt-2">
            {items.map((m, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={m.id || m.imdbID || idx}
                  className={`hero-indicator-pill ${isActive ? 'active' : ''}`}
                  onClick={() => changeSlide(idx)}
                  title={`Slide ${idx + 1}: ${m.Title}`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {isActive && !isPaused && (
                    <span key={progressKey} className="hero-progress-fill" />
                  )}
                </button>
              );
            })}
            <span
              className="text-muted ms-2 small d-none d-sm-inline"
              style={{ fontSize: '0.78rem' }}
            >
              Auto-advancing every 5s • Hover to pause
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
