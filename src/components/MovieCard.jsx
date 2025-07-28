function MovieCard({ title, year, poster, imdbID, onClick, isInCollection, onSaveToCollection, onRemoveFromCollection }) {
  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on the button
    if (e.target.closest('.btn')) {
      return;
    }
    onClick();
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSaveToCollection({ Title: title, Year: year, Poster: poster, imdbID });
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemoveFromCollection(imdbID);
  };

  return (
    <div className="card h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
      <img
        src={poster !== 'N/A' ? poster : 'https://via.placeholder.com/300x400'}
        className="card-img-top"
        alt={title}
        style={{ height: '300px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title" style={{ fontSize: '1rem', lineHeight: '1.3' }}>{title}</h5>
        <p className="card-text text-muted">Year: {year}</p>
        <div className="mt-auto">
          {isInCollection ? (
            <button
              className="btn btn-danger btn-sm w-100"
              onClick={handleRemoveClick}
            >
              ❌ Remove from Collections
            </button>
          ) : (
            <button
              className="btn btn-outline-primary btn-sm w-100"
              onClick={handleSaveClick}
            >
              ⭐ Save to Collections
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;