const MovieCard = ({ movie }) => {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/500x750/e2e8f0/475569?text=No+Poster';

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-lg shadow-slate-200/60 backdrop-blur">
      <img
        className="h-80 w-full object-cover"
        src={posterPath}
        alt={movie.title}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">{movie.title}</h3>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
        </div>
        <p className="mb-4 line-clamp-5 text-sm leading-6 text-slate-600">
          {movie.overview || 'Description is unavailable for this movie.'}
        </p>
        <div className="mt-auto flex items-center justify-between text-sm text-slate-500">
          <span>{movie.release_date || 'Unknown release date'}</span>
          <span>{movie.original_language?.toUpperCase()}</span>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
