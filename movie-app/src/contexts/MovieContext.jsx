/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { fetchMovies } from '../services/fetchService';

const MovieContext = createContext(undefined);

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const searchMovies = async (query) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setMovies([]);
      setError('Enter a movie name before searching.');
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setHasSearched(true);
      const data = await fetchMovies(normalizedQuery);
      setMovies(data.results ?? []);
    } catch {
      setMovies([]);
      setError('Failed to fetch movies. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MovieContext.Provider
      value={{ movies, isLoading, error, hasSearched, searchMovies }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error('useMovieContext must be used within MovieProvider');
  }

  return context;
};
