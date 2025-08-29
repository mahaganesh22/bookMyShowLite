// routes/theaterRoutes.js
import { Router } from 'express';
import { DatabaseService } from '../services/DatabaseService.js';

const router = Router();
const dbService = new DatabaseService();

// Initialize database connection
await dbService.initialize();

// GET /api/theaters/:theaterId - Get theater details
router.get('/:theaterId', async (req, res) => {
    try {
        const { theaterId } = req.params;
        const theater = await dbService.getTheaterDetails(theaterId);
        
        if (!theater) {
            return res.status(404).json({
                success: false,
                error: 'Theater not found',
                theaterId
            });
        }

        res.json({
            success: true,
            data: theater,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching theater details:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch theater details',
            message: error.message
        });
    }
});

// GET /api/theaters/:theaterId/showtimes - Get theater showtimes
router.get('/:theaterId/showtimes', async (req, res) => {
    try {
        const { theaterId } = req.params;
        const { date } = req.query;
        
        const theater = await dbService.getTheaterDetails(theaterId);
        if (!theater) {
            return res.status(404).json({
                success: false,
                error: 'Theater not found',
                theaterId
            });
        }

        const showtimes = await dbService.getAvailableShowtimes(theaterId, date);
        
        res.json({
            success: true,
            data: {
                theater: {
                    id: theater.theater_id,
                    name: theater.theater_name,
                    movieName: theater.movie_name
                },
                date: date || new Date().toISOString().split('T')[0],
                showtimes
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching theater showtimes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch theater showtimes',
            message: error.message
        });
    }
});

export { router as theaterRoutes };