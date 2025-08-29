// services/DatabaseService.js
import pg from 'pg';

const { Pool } = pg;

export class DatabaseService {
    constructor() {
        this.pool = null;
        this.connected = false;
    }

    async initialize() {
        try {
            this.pool = new Pool({
                user: process.env.DB_USER || 'postgres',
                host: process.env.DB_HOST || 'localhost',
                database: process.env.DB_NAME || 'bookMyShowLite',
                password: process.env.DB_PASSWORD || 'Ramarao@456',
                port: parseInt(process.env.DB_PORT) || 5432,
                max: 20, // maximum number of connections
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            // Test the connection
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();
            
            this.connected = true;
            console.log('Database connection pool initialized successfully');
        } catch (error) {
            this.connected = false;
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    isConnected() {
        return this.connected;
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            this.connected = false;
            console.log('Database connection pool closed');
        }
    }

    // Get all movies with their tags and theaters
    async getAllMoviesWithDetails() {
        const client = await this.pool.connect();
        try {
            // First get all movies
            const moviesQuery = 'SELECT * FROM movies ORDER BY name';
            const moviesResult = await client.query(moviesQuery);
            const movies = moviesResult.rows;

            // Get all movie tags
            const tagsQuery = `
                SELECT 
                    m.id,
                    ARRAY_AGG(DISTINCT mt.tag) as tags
                FROM movies m
                LEFT JOIN movie_tags mt ON m.id = mt.movie_id
                GROUP BY m.id
                ORDER BY m.id
            `;
            const tagsResult = await client.query(tagsQuery);
            const movieTags = tagsResult.rows;

            // Get all theaters with available dates
            const theatersQuery = `
                SELECT 
                    *,
                    ARRAY(
                        SELECT CURRENT_DATE + i
                        FROM generate_series(0, days_ahead - 1) AS s(i)
                    ) AS available_dates
                FROM theaters
                ORDER BY movie_id, theater_name
            `;
            const theatersResult = await client.query(theatersQuery);
            const theaters = theatersResult.rows;

            // Combine all data
            const moviesWithDetails = movies.map(movie => {
                // Add tags
                const movieTagData = movieTags.find(tag => tag.id === movie.id);
                movie.tags = movieTagData ? movieTagData.tags : [];

                // Add theaters
                const movieTheaters = theaters.filter(theater => theater.movie_id === movie.id);
                movie.theaters = movieTheaters;

                return movie;
            });

            return moviesWithDetails;
        } finally {
            client.release();
        }
    }

    // Get a specific movie with details
    async getMovieWithDetails(movieId) {
        const client = await this.pool.connect();
        try {
            // Get movie
            const movieQuery = 'SELECT * FROM movies WHERE id = $1';
            const movieResult = await client.query(movieQuery, [movieId]);
            
            if (movieResult.rows.length === 0) {
                return null;
            }
            
            const movie = movieResult.rows[0];

            // Get tags
            const tagsQuery = `
                SELECT tag FROM movie_tags WHERE movie_id = $1
            `;
            const tagsResult = await client.query(tagsQuery, [movieId]);
            movie.tags = tagsResult.rows.map(row => row.tag);

            // Get theaters
            const theatersQuery = `
                SELECT 
                    *,
                    ARRAY(
                        SELECT CURRENT_DATE + i
                        FROM generate_series(0, days_ahead - 1) AS s(i)
                    ) AS available_dates
                FROM theaters 
                WHERE movie_id = $1
                ORDER BY theater_name
            `;
            const theatersResult = await client.query(theatersQuery, [movieId]);
            movie.theaters = theatersResult.rows;

            return movie;
        } finally {
            client.release();
        }
    }

    // Get movie by name slug
    async getMovieBySlug(movieSlug) {
        const client = await this.pool.connect();
        try {
            // Convert slug back to approximate name for searching
            const approximateName = movieSlug.replace(/-/g, ' ');
            
            const movieQuery = `
                SELECT * FROM movies 
                WHERE LOWER(name) = LOWER($1) 
                OR LOWER(REPLACE(name, ' ', '-')) = LOWER($2)
                LIMIT 1
            `;
            const movieResult = await client.query(movieQuery, [approximateName, movieSlug]);
            
            if (movieResult.rows.length === 0) {
                return null;
            }
            
            return this.getMovieWithDetails(movieResult.rows[0].id);
        } finally {
            client.release();
        }
    }

    // Get theater details
    async getTheaterDetails(theaterId) {
        const client = await this.pool.connect();
        try {
            const theaterQuery = `
                SELECT 
                    t.*,
                    m.name as movie_name,
                    ARRAY(
                        SELECT CURRENT_DATE + i
                        FROM generate_series(0, t.days_ahead - 1) AS s(i)
                    ) AS available_dates
                FROM theaters t
                JOIN movies m ON t.movie_id = m.id
                WHERE t.theater_id = $1
            `;
            const result = await client.query(theaterQuery, [theaterId]);
            
            return result.rows.length > 0 ? result.rows[0] : null;
        } finally {
            client.release();
        }
    }

    // Generate and store OTP
    async generateOTP() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    // Search movies
    async searchMovies(query) {
        const client = await this.pool.connect();
        try {
            const searchQuery = `
                SELECT * FROM movies 
                WHERE LOWER(name) LIKE LOWER($1)
                ORDER BY name
                LIMIT 10
            `;
            const result = await client.query(searchQuery, [`%${query}%`]);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Get available showtimes for a theater on a specific date
    async getAvailableShowtimes(theaterId, date) {
        const client = await this.pool.connect();
        try {
            const query = `
                SELECT show_times FROM theaters 
                WHERE theater_id = $1
            `;
            const result = await client.query(query, [theaterId]);
            
            if (result.rows.length === 0) {
                return [];
            }
            
            const showtimes = result.rows[0].show_times;
            
            // Filter based on current time if date is today
            const today = new Date().toDateString();
            const selectedDate = new Date(date).toDateString();
            
            if (selectedDate === today) {
                const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
                
                return showtimes.filter(showTime => {
                    const [time, period] = showTime.split(' ');
                    const [hours, minutes] = time.split(':').map(Number);
                    
                    let showTimeIn24Hours = hours;
                    if (period === 'PM' && hours !== 12) {
                        showTimeIn24Hours += 12;
                    } else if (period === 'AM' && hours === 12) {
                        showTimeIn24Hours = 0;
                    }
                    
                    const showTimeInMinutes = showTimeIn24Hours * 60 + minutes;
                    return showTimeInMinutes >= (currentTime + 30);
                });
            }
            
            return showtimes;
        } finally {
            client.release();
        }
    }
}