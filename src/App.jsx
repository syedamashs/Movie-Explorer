import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import Home from './components/Home';
import Collections from './components/Collections';
import Profile from './components/Profile';
import './index.css';

// API URL - will be different for production
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com' 
  : 'http://localhost:5000';

function App() {
  const [collections, setCollections] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Load user collections from API
      loadUserCollections(token);
    } else {
      // Load guest collections from localStorage
      const savedCollections = localStorage.getItem('movieCollections');
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }
    }
    setLoading(false);
  }, []);

  // Load user collections from API
  const loadUserCollections = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/user/collections`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Error loading user collections:', error);
    }
  };

  // Save collections to localStorage (for guest users) or API (for logged-in users)
  useEffect(() => {
    if (user) {
      // For logged-in users, collections are managed by API calls
      return;
    }
    // For guest users, save to localStorage
    localStorage.setItem('movieCollections', JSON.stringify(collections));
  }, [collections, user]);

  const handleLogin = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Load user collections from API
    loadUserCollections(data.token);
  };

  const handleRegister = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Load user collections from API
    loadUserCollections(data.token);
  };

  const handleLogout = () => {
    setUser(null);
    setCollections([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('movieCollections');
  };

  const handleSaveToCollection = async (movie) => {
    // Check if movie is already in collection
    const isAlreadyInCollection = collections.some(m => m.imdbID === movie.imdbID);
    
    if (isAlreadyInCollection) {
      return;
    }

    if (user) {
      // Save to API for logged-in users
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/user/collections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ movie })
        });

        if (response.ok) {
          const data = await response.json();
          setCollections(data.collections);
        }
      } catch (error) {
        console.error('Error saving to collection:', error);
      }
    } else {
      // Save to localStorage for guest users
      setCollections(prev => [...prev, movie]);
    }
  };

  const handleRemoveFromCollection = async (imdbID) => {
    if (user) {
      // Remove from API for logged-in users
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/user/collections/${imdbID}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCollections(data.collections);
        }
      } catch (error) {
        console.error('Error removing from collection:', error);
      }
    } else {
      // Remove from localStorage for guest users
      setCollections(prev => prev.filter(movie => movie.imdbID !== imdbID));
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navigation 
          collectionsCount={collections.length}
          user={user}
          onLogin={handleLogin}
          onRegister={handleRegister}
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
