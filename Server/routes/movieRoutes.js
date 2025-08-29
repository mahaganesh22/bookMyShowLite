// routes/movieRoutes.js
import { Router } from 'express';
import { DatabaseService } from '../services/DatabaseService.js';

const router = Router();
const dbService = new DatabaseService();

// Initialize database connection
await dbService.initialize();

// GET /api/movies - Get all movies with details
router.get('/', async (req, res) => {
    try {
        const movies = await dbService.getAllMoviesWithDetails();
        res.json({
            success: true,
            data: movies,
            count: movies.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch movies',
            message: error.message
        });
    }
});

// GET /api/movies/search?q=query - Search movies
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        const movies = await dbService.searchMovies(q.trim());
        res.json({
            success: true,
            data: movies,
            query: q,
            count: movies.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search movies',
            message: error.message
        });
    }
});

// GET /api/movies/:movieSlug - Get movie by slug
router.get('/:movieSlug', async (req, res) => {
    try {
        const { movieSlug } = req.params;
        const movie = await dbService.getMovieBySlug(movieSlug);
        
        if (!movie) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found',
                movieSlug
            });
        }

        res.json({
            success: true,
            data: movie,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch movie',
            message: error.message
        });
    }
});

// GET /api/movies/:movieSlug/theaters - Get theaters for a movie
router.get('/:movieSlug/theaters', async (req, res) => {
    try {
        const { movieSlug } = req.params;
        const movie = await dbService.getMovieBySlug(movieSlug);
        
        if (!movie) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found',
                movieSlug
            });
        }

        res.json({
            success: true,
            data: {
                movie: {
                    id: movie.id,
                    name: movie.name,
                    etno: movie.etno
                },
                theaters: movie.theaters
            },
            count: movie.theaters.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching movie theaters:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch movie theaters',
            message: error.message
        });
    }
});

// GET /api/movies/:movieSlug/theaters/:theaterId/showtimes - Get available showtimes
router.get('/:movieSlug/theaters/:theaterId/showtimes', async (req, res) => {
    try {
        const { movieSlug, theaterId } = req.params;
        const { date } = req.query;
        
        const movie = await dbService.getMovieBySlug(movieSlug);
        if (!movie) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found',
                movieSlug
            });
        }

        const showtimes = await dbService.getAvailableShowtimes(theaterId, date);
        
        res.json({
            success: true,
            data: {
                movie: movie.name,
                theaterId,
                date: date || new Date().toISOString().split('T')[0],
                showtimes
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching showtimes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch showtimes',
            message: error.message
        });
    }
});

export { router as movieRoutes };