// hooks/useMovies.js - Custom hook for movie data
import { useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

export function useMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAllMovies();
            setMovies(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies();
    }, []);

    return { movies, loading, error, refetch: () => fetchMovies() };
}

export function useMovie(movieSlug) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!movieSlug) {
            setLoading(false);
            return;
        }

        const fetchMovie = async () => {
            try {
                setLoading(true);
                const data = await apiService.getMovieBySlug(movieSlug);
                setMovie(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [movieSlug]);

    return { movie, loading, error };
}