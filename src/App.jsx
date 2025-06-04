import { useState } from 'react';
import MovieCard from './components/MovieCard';
import './index.css';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // modal state
  const [searched , setSearched] = useState(false);

  const handleSearch = async () => {
    if (query.trim() === '') return;

    const apiKey = 'Your API KEY of OMDB-API';
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      setSearched(true);
      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleCardClick = async (movie) => {
    const apiKey = '7db3fc35';
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=full`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error('Modal fetch error:', error);
    }
  };

  return (
    <div className="container mt-5 justify-content-center d-flex flex-column "
    style={{ minHeight: '80vh' }}
    >
      <div className="d-flex flex-column align-items-center mb-5">
        <div className="typewriter">
            <h1 className='mb-5 text-center'>🎬 Movie Explorer</h1>
        </div>

        <form
          className="input-group"
          style={{ maxWidth: '500px', width: '100%' }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="text"
            className="form-control me-2"
            value={query}
            placeholder="Search for Movies..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary me-2" type="submit">
            Search
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              setQuery('');
              setMovies([]);
              setSearched(false);
            }}
          >
            Clear
          </button>
        </form>
      </div>

      <div className={`row ${movies.length <= 3 ? 'justify-content-center' : ''}`}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="col-md-3 mb-3 d-flex justify-content-center">
              <MovieCard
                title={movie.Title}
                year={movie.Year}
                poster={movie.Poster}
                onClick={() => handleCardClick(movie)}
              />
            </div>
          ))
        ) : searched ? (
          <p className='text-center'>No Movies Found!</p>
        ) : 
        (
          <p className="text-center">🎥 Explore the Movies</p>
        )}
      </div>

      {selectedMovie && (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }}
    onClick={() => setSelectedMovie(null)}
  >
    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <div className="modal-header justify-content-center position-relative">
          <h5 className="modal-title text-center w-100">{selectedMovie.Title}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSelectedMovie(null)}
          ></button>
        </div>
        <div className="modal-body align-items-center justify-content-center text-center d-flex flex-column p-4">
          <img
            src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://via.placeholder.com/300x400'}
            alt={selectedMovie.Title}
            className="img-fluid mb-3"
          />
          <p><strong>Year:</strong> {selectedMovie.Year}</p>
          <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating || 'N/A'}</p>
          <p><strong>Actors:</strong> {selectedMovie.Actors || 'N/A'}</p>
          <p><strong>Director:</strong> {selectedMovie.Director || 'N/A'}</p>
          <p>{selectedMovie.Plot || 'No description available.'}</p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;
