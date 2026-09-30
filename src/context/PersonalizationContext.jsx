import React, { createContext, useContext, useState, useEffect } from 'react';

const PersonalizationContext = createContext();

const STORAGE_KEYS = {
  WATCHLIST: 'movie_explorer_watchlist',
  FAVORITES: 'movie_explorer_favorites',
  WATCHED: 'movie_explorer_watched',
  RATINGS: 'movie_explorer_ratings',
  RECENTLY_VIEWED: 'movie_explorer_recently_viewed',
  SEARCH_HISTORY: 'movie_explorer_search_history',
};

export function PersonalizationProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [watched, setWatched] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCHED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ratings, setRatings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RATINGS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return saved ? JSON.parse(saved) : ['Inception', 'Oppenheimer', 'Interstellar', 'Batman'];
    } catch {
      return ['Inception', 'Oppenheimer', 'Interstellar', 'Batman'];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((current) => (current && Date.now() - current.id > 2700 ? null : current));
    }, 3000);
  };

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const sanitizeMovie = (movie) => ({
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Poster: movie.Poster,
    Type: movie.Type || 'movie',
    imdbRating: movie.imdbRating || 'N/A',
    Genre: movie.Genre || '',
    Director: movie.Director || '',
  });

  const isWatchlist = (imdbID) => watchlist.some((m) => m.imdbID === imdbID);
  const isFavorite = (imdbID) => favorites.some((m) => m.imdbID === imdbID);
  const isWatched = (imdbID) => watched.some((m) => m.imdbID === imdbID);

  const toggleWatchlist = (movie) => {
    if (!movie || !movie.imdbID) return;
    const exists = isWatchlist(movie.imdbID);
    if (exists) {
      setWatchlist((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
      showToast(`Removed "${movie.Title}" from Watchlist`, 'default');
    } else {
      setWatchlist((prev) => [sanitizeMovie(movie), ...prev]);
      showToast(`Added "${movie.Title}" to Watchlist 🔖`, 'success');
    }
  };

  const toggleFavorite = (movie) => {
    if (!movie || !movie.imdbID) return;
    const exists = isFavorite(movie.imdbID);
    if (exists) {
      setFavorites((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
      showToast(`Removed "${movie.Title}" from Favorites`, 'default');
    } else {
      setFavorites((prev) => [sanitizeMovie(movie), ...prev]);
      showToast(`Added "${movie.Title}" to Favorites ❤️`, 'success');
    }
  };

  const toggleWatched = (movie) => {
    if (!movie || !movie.imdbID) return;
    const exists = isWatched(movie.imdbID);
    if (exists) {
      setWatched((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
      showToast(`Marked "${movie.Title}" as unwatched`, 'default');
    } else {
      setWatched((prev) => [sanitizeMovie(movie), ...prev]);
      showToast(`Marked "${movie.Title}" as Watched! ✅`, 'success');
    }
  };

  const setMovieRating = (movie, ratingValue, reviewText = '') => {
    if (!movie || !movie.imdbID) return;
    setRatings((prev) => ({
      ...prev,
      [movie.imdbID]: {
        rating: ratingValue,
        review: reviewText,
        title: movie.Title,
        poster: movie.Poster,
        year: movie.Year,
        updatedAt: new Date().toLocaleDateString(),
      },
    }));
    showToast(`Saved your rating for "${movie.Title}" ⭐`, 'success');
  };

  const getMovieRating = (imdbID) => ratings[imdbID] || null;

  const addRecentlyViewed = (movie) => {
    if (!movie || !movie.imdbID) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((m) => m.imdbID !== movie.imdbID);
      return [sanitizeMovie(movie), ...filtered].slice(0, 12);
    });
  };

  const addSearchHistory = (term) => {
    if (!term || !term.trim()) return;
    const cleaned = term.trim();
    setSearchHistory((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== cleaned.toLowerCase());
      return [cleaned, ...filtered].slice(0, 8);
    });
  };

  const removeSearchHistory = (term) => {
    setSearchHistory((prev) => prev.filter((t) => t !== term));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const exportUserData = () => {
    const backup = {
      watchlist,
      favorites,
      watched,
      ratings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movie_explorer_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Personal movie library exported successfully! 📦', 'success');
  };

  const importUserData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.watchlist) setWatchlist(data.watchlist);
      if (data.favorites) setFavorites(data.favorites);
      if (data.watched) setWatched(data.watched);
      if (data.ratings) setRatings(data.ratings);
      showToast('Personal movie library imported successfully! 🚀', 'success');
      return true;
    } catch (e) {
      showToast('Failed to import file. Invalid JSON format.', 'error');
      return false;
    }
  };

  return (
    <PersonalizationContext.Provider
      value={{
        watchlist,
        favorites,
        watched,
        ratings,
        recentlyViewed,
        searchHistory,
        toastMessage,
        showToast,
        isWatchlist,
        isFavorite,
        isWatched,
        toggleWatchlist,
        toggleFavorite,
        toggleWatched,
        setMovieRating,
        getMovieRating,
        addRecentlyViewed,
        addSearchHistory,
        removeSearchHistory,
        clearSearchHistory,
        exportUserData,
        importUserData,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}
