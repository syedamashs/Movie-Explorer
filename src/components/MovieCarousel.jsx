import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

export default function MovieCarousel({ title, subtitle, movies = [], onMovieClick, loading = false }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-5 position-relative">
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <div>
          <h3 className="fw-bold mb-1 fs-4">{title}</h3>
          {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
        </div>

        <div className="d-flex gap-2">
          <button
            className="carousel-nav-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>
          <button
            className="carousel-nav-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="horizontal-scroll-container" ref={scrollContainerRef}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} style={{ minWidth: '220px', maxWidth: '220px' }}>
                <SkeletonCard />
              </div>
            ))
          : movies.map((movie) => (
              <div key={movie.imdbID} style={{ minWidth: '220px', maxWidth: '220px' }}>
                <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
              </div>
            ))}
      </div>
    </div>
  );
}
