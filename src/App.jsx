import { useState } from 'react';
import MovieCard from './components/MovieCard';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);

  const handleSearch = async () => {
    if (query.trim() === '') return;

    const apiKey = '7db3fc35'; // ✅
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      console.log('API Result:', data);

      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="container mt-4 justify-content-center">
      <div className="d-flex flex-column align-items-center mt-5 mb-4">
          <h1 className='text-center mb-4'>🎬 Movie Explorer</h1>
      <form
          className="input-group"
          style={{ maxWidth: '500px', width: '100%' }}
          onSubmit={(e) => {
               e.preventDefault(); 
               handleSearch();
        }}>

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
    }}
  >
    Clear
  </button>
</form>

      </div>

      <div className={`row ${movies.length <= 3 ? 'justify-content-center' : ''}`}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div className="col-md-3 mb-4 d-flex justify-content-center">
              <MovieCard
                title={movie.Title}
                year={movie.Year}
                poster={movie.Poster}
              />
            </div>
          ))
        ) : (
          <p className="text-center">No movies found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
