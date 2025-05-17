function MovieCard({ title, year, poster }) {
  return (
    <div className="card h-100">
      <img
        src={poster !== 'N/A' ? poster : 'https://via.placeholder.com/300x400'}
        className="card-img-top"
        alt={title}
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">Year: {year}</p>
      </div>
    </div>
  );
}

export default MovieCard;
