// components/UpdatedHome.jsx - Updated Home component
import Header from "../Header"
import Panel from "../Panel"
import Advertisement1 from "../Advertisement1"
import RecommendedMovies from "../RecommendedMovies"
import MoviePoster from "../MoviePoster"
import TheaterPage from "../TheaterPage"
import SeatsAvailable from "../SeatsAvailable"
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from "./ErrorMessage"
import { useState, useEffect } from "react"
import { useNavigationType, useParams } from "react-router-dom"
import { useMovies, useMovie } from "../hooks/useMovies"

function UpdatedHome() {
    const [selectedTheater, setSelectedTheater] = useState(null);
    const { movieName, ETNO, currentDate, Code } = useParams();

    // Use custom hooks for data fetching
    const { movies, loading: moviesLoading, error: moviesError } = useMovies();
    const { movie: selectedMovie, loading: movieLoading, error: movieError } = useMovie(movieName);

    // Handle theater selection when we have theater code
    useEffect(() => {
        if (movieName && ETNO && Code && selectedMovie?.theaters) {
            const theater = selectedMovie.theaters.find(t => t.theater_id === Code);
            //console.log(theater)
            setSelectedTheater(theater || null);
        } else {
            setSelectedTheater(null);
        }
    }, [movieName, ETNO, Code, selectedMovie]);

    // Loading states
    if (moviesLoading && !movieName) {
        return (
            <>
                <Header />
                <Panel />
                <LoadingSpinner message="Loading movies..." />
            </>
        );
    }

    if (movieLoading && movieName) {
        return (
            <>
                <Header />
                <Panel />
                <LoadingSpinner message="Loading movie details..." />
            </>
        );
    }

    // Error states
    if (moviesError && !movieName) {
        return (
            <>
                <Header />
                <Panel />
                <ErrorMessage 
                    message="Failed to load movies" 
                    error={moviesError}
                    onRetry={() => window.location.reload()}
                />
            </>
        );
    }

    if (movieError && movieName) {
        return (
            <>
                <Header />
                <Panel />
                <ErrorMessage 
                    message="Movie not found" 
                    error={movieError}
                    onRetry={() => window.history.back()}
                />
            </>
        );
    }

    return (
        <>
            <Header />
            <Panel />
            
            {/* Home page - show ads and movie recommendations */}
            {!movieName && !ETNO && !currentDate && !Code && (
                <>
                    <Advertisement1 />
                    <RecommendedMovies moviesDesc={movies} />
                </>
            )}
            
            {/* Movie details page */}
            {movieName && ETNO && !currentDate && !Code && selectedMovie && (
                <MoviePoster movieDetails={selectedMovie} />
            )}

            {/* Theater selection page */}
            {movieName && ETNO && currentDate && !Code && selectedMovie && (
                <TheaterPage movieDetails={selectedMovie} />
            )}

            {/* Seat selection page */}
            {movieName && ETNO && currentDate && Code && selectedMovie && selectedTheater && (
                <SeatsAvailable theaterDetails={selectedTheater} />
            )}
        </>
    );
}

export default UpdatedHome;