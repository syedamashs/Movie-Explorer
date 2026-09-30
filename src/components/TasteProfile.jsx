import React from 'react';
import {
  FaChartPie,
  FaStar,
  FaHeart,
  FaEye,
  FaCompass,
  FaLightbulb,
  FaHistory,
} from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';
import MovieCard from './MovieCard';

export default function TasteProfile({ onSelectMovie, onExploreMovies }) {
  const {
    watchlist,
    favorites,
    watched,
    ratings,
    recentlyViewed,
  } = usePersonalization();

  // Combine saved movies to compute taste insights
  const allSaved = [...watchlist, ...favorites, ...watched];
  const uniqueMoviesMap = new Map();
  allSaved.forEach((m) => uniqueMoviesMap.set(m.imdbID, m));
  const uniqueSaved = Array.from(uniqueMoviesMap.values());

  // Calculate genre frequency
  const genreCounts = {};
  uniqueSaved.forEach((m) => {
    if (m.Genre && m.Genre !== 'N/A') {
      const parts = m.Genre.split(',').map((g) => g.trim());
      parts.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    }
  });

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Compute average personal rating
  const ratingEntries = Object.values(ratings);
  const avgRating =
    ratingEntries.length > 0
      ? (
          ratingEntries.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          ratingEntries.length
        ).toFixed(1)
      : null;

  return (
    <div className="py-4">
      {/* Title */}
      <div className="mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <h2 className="fw-bold mb-1 brand-font">📊 Your Cinema Taste & Analytics</h2>
        <p className="text-muted small mb-0">
          Personal stats, favorite genres, and tailored cinematic recommendations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-3 col-6">
          <div className="glass-panel p-3 rounded-4 text-center">
            <FaEye className="text-success fs-3 mb-2" />
            <h3 className="fw-bold mb-0">{watched.length}</h3>
            <span className="text-muted small">Movies Watched</span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-panel p-3 rounded-4 text-center">
            <FaHeart className="text-danger fs-3 mb-2" />
            <h3 className="fw-bold mb-0">{favorites.length}</h3>
            <span className="text-muted small">Favorites Saved</span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-panel p-3 rounded-4 text-center">
            <FaStar className="text-warning fs-3 mb-2" />
            <h3 className="fw-bold mb-0">{avgRating ? `${avgRating} ★` : 'N/A'}</h3>
            <span className="text-muted small">Avg Given Rating</span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-panel p-3 rounded-4 text-center">
            <FaChartPie className="text-primary fs-3 mb-2" />
            <h3 className="fw-bold mb-0">{watchlist.length}</h3>
            <span className="text-muted small">In Watchlist</span>
          </div>
        </div>
      </div>

      {/* Top Genres Breakdown */}
      <div className="glass-panel p-4 rounded-4 mb-5">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <FaLightbulb className="text-warning" /> Your Favorite Genres
        </h5>

        {topGenres.length > 0 ? (
          <div className="d-flex flex-wrap gap-3">
            {topGenres.map(([genre, count]) => (
              <div
                key={genre}
                className="p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 flex-grow-1"
                style={{ minWidth: '150px' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold">{genre}</span>
                  <span className="badge bg-primary rounded-pill">{count} films</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${Math.min(100, (count / uniqueSaved.length) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted small mb-0">
            Save a few movies to your Watchlist or Favorites to unlock your personal genre breakdown!
          </p>
        )}
      </div>

      {/* Recently Viewed Carousel */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2 fs-5">
              <FaHistory /> Recently Explored Titles
            </h4>
          </div>
          <div className="row g-3">
            {recentlyViewed.slice(0, 4).map((movie) => (
              <div key={movie.imdbID} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <MovieCard movie={movie} onClick={() => onSelectMovie(movie)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation Prompt */}
      <div className="glass-panel p-4 rounded-4 text-center">
        <FaCompass className="text-primary display-5 mb-3" />
        <h4 className="fw-bold mb-2">Want to discover more movies tailored to your taste?</h4>
        <p className="text-muted small mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
          Explore curated collections of world cinema, trending blockbusters, or search any actor, director, or title.
        </p>
        <button className="btn btn-primary rounded-pill px-4 py-2" onClick={onExploreMovies}>
          Explore Curated Cinema
        </button>
      </div>
    </div>
  );
}
