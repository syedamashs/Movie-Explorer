import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

export default function MovieCarousel({ title, subtitle, movies = [], onMovieClick, loading = false }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -650 : 650;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-5 position-relative carousel-section">
      {/* Header with Title and Subtitle */}
      <div className="mb-3 px-1">
        <h3 className="fw-bold mb-1 fs-4">{title}</h3>
        {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
      </div>

      {/* Track wrapper with Left & Right Middle Navigation Buttons */}
      <div className="position-relative carousel-track-wrapper">
        {/* Left middle navigation button */}
        <button
          className="carousel-nav-arrow left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          title="Scroll left"
        >
          <FaChevronLeft />
        </button>

        {/* Scrollable list of movie cards */}
        <div className="horizontal-scroll-container px-1" ref={scrollContainerRef}>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} style={{ minWidth: '220px', maxWidth: '220px' }}>
                  <SkeletonCard />
                </div>
              ))
            : movies.map((movie) => (
                <div key={movie.id || movie.imdbID} style={{ minWidth: '220px', maxWidth: '220px' }}>
                  <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
                </div>
              ))}
        </div>

        {/* Right middle navigation button */}
        <button
          className="carousel-nav-arrow right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          title="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
