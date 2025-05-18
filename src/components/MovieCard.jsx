// No modal logic here anymore!
function MovieCard({ title, year, poster, onClick }) {
  return (
    <div className="card h-80" style={{ cursor: 'pointer' }} onClick={onClick}>
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
