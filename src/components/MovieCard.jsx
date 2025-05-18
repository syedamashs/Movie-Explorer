function MovieCard({ title, year, poster, desc, imdbRating }) {
  return (
  <div className="flip-card h-80">
  <div className="flip-card-inner">

    <div className="flip-card-front card h-100">
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

    <div className="flip-card-back card h-100 bg-dark text-white p-3">
      <h5>{title}</h5>
      <p><strong>IMDB:</strong>{imdbRating}</p>
      <p>{desc}</p>
    </div>

</div>
</div>
  );
}

export default MovieCard;
