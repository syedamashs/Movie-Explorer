import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Collections from './components/Collections';
import './index.css';

function App() {
  const [collections, setCollections] = useState([]);

  // Load collections from localStorage on component mount
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

  const handleSaveToCollection = (movie) => {
    // Check if movie is already in collection
    const isAlreadyInCollection = collections.some(m => m.imdbID === movie.imdbID);
    
    if (!isAlreadyInCollection) {
      setCollections(prev => [...prev, movie]);
    }
  };

  const handleRemoveFromCollection = (imdbID) => {
    setCollections(prev => prev.filter(movie => movie.imdbID !== imdbID));
  };

  return (
    <Router>
      <div className="App">
        <Navigation collectionsCount={collections.length} />
        <Routes>
          <Route 
            path="/" 
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
