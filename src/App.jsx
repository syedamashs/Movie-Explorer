import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import Home from './components/Home';
import Collections from './components/Collections';
import Profile from './components/Profile';
import './index.css';

function App() {
  const [collections, setCollections] = useState([]);
  const [user, setUser] = useState(null);

  // Load collections from localStorage on app load
  useEffect(() => {
    const savedCollections = localStorage.getItem('movieCollections');
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
  }, []);

  // Save collections to localStorage whenever collections change
  useEffect(() => {
    localStorage.setItem('movieCollections', JSON.stringify(collections));
  }, [collections]);

  const handleLogin = () => {
    // This will be handled by Firebase AuthContext
    console.log('Login triggered - will be handled by Firebase');
  };

  const handleLogout = () => {
    setUser(null);
    setCollections([]);
    localStorage.removeItem('movieCollections');
  };

  const handleSaveToCollection = (movie) => {
    // Check if movie is already in collection
    const isAlreadyInCollection = collections.some(m => m.imdbID === movie.imdbID);
    
    if (isAlreadyInCollection) {
      return;
    }

    // Save to localStorage
    setCollections(prev => [...prev, movie]);
  };

  const handleRemoveFromCollection = (imdbID) => {
    // Remove from localStorage
    setCollections(prev => prev.filter(movie => movie.imdbID !== imdbID));
  };

  return (
    <Router>
      <div className="App">
        <Navigation 
          collectionsCount={collections.length}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <Routes>
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          <Route 
            path="/search" 
            element={
              <Home 
                collections={collections}
                onSaveToCollection={handleSaveToCollection}
              />
            } 
          />
          <Route 
            path="/collections" 
            element={
              <Collections 
                collections={collections}
                onRemoveFromCollection={handleRemoveFromCollection}
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              user ? <Profile user={user} /> : <HomePage />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
