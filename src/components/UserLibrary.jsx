import React, { useState } from 'react';
import {
  FaBookmark,
  FaHeart,
  FaCheckCircle,
  FaStar,
  FaDownload,
  FaUpload,
  FaTrashAlt,
  FaFilm,
} from 'react-icons/fa';
import { usePersonalization } from '../context/PersonalizationContext';
import MovieCard from './MovieCard';

export default function UserLibrary({ onSelectMovie, onExploreMovies }) {
  const {
    watchlist,
    favorites,
    watched,
    ratings,
    exportUserData,
    importUserData,
  } = usePersonalization();

  const [activeTab, setActiveTab] = useState('watchlist');

  const ratedMovieIDs = Object.keys(ratings);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        importUserData(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case 'watchlist':
        return watchlist;
      case 'favorites':
        return favorites;
      case 'watched':
        return watched;
      default:
        return [];
    }
  };

  const currentList = getActiveList();

  return (
    <div className="py-4">
      {/* Header and Backup controls */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <h2 className="fw-bold mb-1 brand-font">🎬 Your Personal Cinema Lounge</h2>
          <p className="text-muted small mb-0">
            Curate your movie journeys, private watchlists, and personal ratings.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-2"
            onClick={exportUserData}
            title="Download JSON backup of your watchlist & ratings"
          >
            <FaDownload /> Export Backup
          </button>

          <label
            className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-2 mb-0"
            style={{ cursor: 'pointer' }}
            title="Restore a previous backup"
          >
            <FaUpload /> Import
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`nav-custom-pill ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          <FaBookmark /> Watchlist ({watchlist.length})
        </button>

        <button
          className={`nav-custom-pill ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <FaHeart /> Favorites ({favorites.length})
        </button>

        <button
          className={`nav-custom-pill ${activeTab === 'watched' ? 'active' : ''}`}
          onClick={() => setActiveTab('watched')}
        >
          <FaCheckCircle /> Watched ({watched.length})
        </button>

        <button
          className={`nav-custom-pill ${activeTab === 'ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('ratings')}
        >
          <FaStar /> My Reviews ({ratedMovieIDs.length})
        </button>
      </div>

      {/* Reviews & Ratings Tab */}
      {activeTab === 'ratings' ? (
        ratedMovieIDs.length === 0 ? (
          <div className="text-center py-5 glass-panel rounded-4">
            <FaStar className="display-4 text-warning mb-3 opacity-50" />
            <h5>No ratings or reviews yet!</h5>
            <p className="text-muted small mb-3">
              Click on any movie in the explorer to rate it from 1 to 5 stars and add your review notes.
            </p>
            <button className="btn btn-primary rounded-pill px-4" onClick={onExploreMovies}>
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {ratedMovieIDs.map((imdbID) => {
              const item = ratings[imdbID];
              return (
                <div key={imdbID} className="col-lg-6 col-12">
                  <div className="glass-panel p-3 rounded-4 d-flex gap-3 align-items-start h-100">
                    <img
                      src={
                        item.poster && item.poster !== 'N/A'
                          ? item.poster
                          : 'https://via.placeholder.com/100x150'
                      }
                      alt={item.title}
                      className="rounded-3 shadow-sm"
                      style={{ width: '90px', height: '135px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => onSelectMovie({ imdbID, Title: item.title, Year: item.year, Poster: item.poster })}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6
                          className="fw-bold mb-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => onSelectMovie({ imdbID, Title: item.title, Year: item.year, Poster: item.poster })}
                        >
                          {item.title} {item.year ? `(${item.year})` : ''}
                        </h6>
                        <span className="badge bg-warning text-dark fw-bold">
                          ★ {item.rating} / 5
                        </span>
                      </div>
                      <p className="text-muted small mb-2">Reviewed on {item.updatedAt}</p>
                      <p className="small mb-0 fst-italic text-secondary">
                        "{item.review || 'No written review notes.'}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : /* Regular Card Grid (Watchlist, Favorites, Watched) */
      currentList.length === 0 ? (
        <div className="text-center py-5 glass-panel rounded-4">
          <FaFilm className="display-4 text-secondary mb-3 opacity-50" />
          <h5>Your {activeTab} is currently empty</h5>
          <p className="text-muted small mb-3">
            Browse trending movies or search your favorite titles to add them to your collection.
          </p>
          <button className="btn btn-primary rounded-pill px-4" onClick={onExploreMovies}>
            Discover Movies Now
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {currentList.map((movie) => (
            <div key={movie.imdbID} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <MovieCard movie={movie} onClick={() => onSelectMovie(movie)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
