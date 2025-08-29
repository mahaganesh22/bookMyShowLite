// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseService } from './services/DatabaseService.js';
import { movieRoutes } from './routes/movieRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { theaterRoutes } from './routes/theaterRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use(requestLogger);

// Initialize database connection
const dbService = new DatabaseService();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: dbService.isConnected() ? 'connected' : 'disconnected'
    });
});

// API Routes
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/theaters', theaterRoutes);

// Legacy endpoint for backward compatibility with your frontend
// app.get('/', async (req, res) => {
//     try {
//         const movies = await dbService.getAllMoviesWithDetails();
//         res.json({
//             moviesdata: movies,
//             timestamp: new Date().toISOString()
//         });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         res.status(500).json({ 
//             error: 'Failed to fetch movies',
//             message: error.message 
//         });
//     }
// });

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await dbService.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await dbService.close();
    process.exit(0);
});

// Start server
const startServer = async () => {
    try {
        // Initialize database connection
        await dbService.initialize();
        console.log('Database connected successfully');
        
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
            console.log(`📊 Health check available at http://localhost:${port}/health`);
            console.log(`🎬 Movies API available at http://localhost:${port}/api/movies`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;