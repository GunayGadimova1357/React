import { useState } from 'react';
import { useMovieContext } from '../contexts/MovieContext';

function SearchForm() {
  const [query, setQuery] = useState('');
  const { searchMovies, isLoading } = useMovieContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await searchMovies(query);
  };

  return (
    <form
      className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-lg shadow-slate-200/70 backdrop-blur md:flex-row"
      onSubmit={handleSubmit}
    >
      <input
        className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
        id="movie-name"
        name="movie-name"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Enter movie name"
        type="search"
        value={query}
      />
      <button
        className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchForm;
