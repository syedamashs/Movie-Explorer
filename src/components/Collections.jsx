import MovieCard from './MovieCard';

function Collections({ collections, onRemoveFromCollection }) {
  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center mb-5">
        <h1 className="mb-4">⭐ My Collections</h1>
        {collections.length === 0 ? (
          <div className="text-center">
            <div className="card bg-light border-0 shadow-sm">
              <div className="card-body p-5">
                <h3 className="mb-3">📚 Your Collection is Empty</h3>
                <p className="text-muted">No movies in your collection yet!</p>
                <p className="text-muted">Search for movies and save them to your collection.</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted">You have {collections.length} movie(s) in your collection</p>
        )}
      </div>

      {collections.length > 0 && (
        <div className="row justify-content-center">
          {collections.map((movie) => (
            <div key={movie.imdbID} className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex justify-content-center">
              <div style={{ minWidth: '250px', maxWidth: '280px', width: '100%' }}>
                <MovieCard
                  title={movie.Title}
                  year={movie.Year}
                  poster={movie.Poster}
                  imdbID={movie.imdbID}
                  isInCollection={true}
                  onRemoveFromCollection={() => onRemoveFromCollection(movie.imdbID)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collections; 