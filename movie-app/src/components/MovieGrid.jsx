import { useMovieContext } from '../contexts/MovieContext';
import MovieCard from './MovieCard';

const MovieGrid = () => {
  const { movies, isLoading, error, hasSearched } = useMovieContext();

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
        Searching movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-600">
        {error}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
        Enter a movie title to start searching.
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
        Nothing found. Try a different movie title.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
