// services/api.js - Centralized API service
class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Get all movies (backward compatible)
    async getAllMovies() {
        const cacheKey = 'all-movies';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await this.request('/api/movies/');
            const data = response.moviesdata || response.data || response;
            
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('Failed to fetch movies:', error);
            return [];
        }
    }

    // Get specific movie by slug
    async getMovieBySlug(movieSlug) {
        const cacheKey = `movie-${movieSlug}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            // Try new API first, fallback to finding in all movies
            let movie = null;
            
            try {
                const response = await this.request(`/api/movies/${movieSlug}`);
                movie = response.data || response.movie || response;
                console.log("movie = ")
                console.log(movie)
            } catch (apiError) {
                // Fallback to searching in all movies
                const allMovies = await this.getAllMovies();
                movie = allMovies.find(m => 
                    m.name.toLowerCase().replace(/\s+/g, '-') === movieSlug
                );
            }
            
            if (movie) {
                this.cache.set(cacheKey, {
                    data: movie,
                    timestamp: Date.now()
                });
            }
            
            return movie;
        } catch (error) {
            console.error(`Failed to fetch movie ${movieSlug}:`, error);
            return null;
        }
    }

    // Search movies
    async searchMovies(query) {
        if (!query || query.length < 2) return [];
        
        try {
            const response = await this.request(`/api/movies/search?q=${encodeURIComponent(query)}`);
            return response.data || [];
        } catch (error) {
            // Fallback to client-side filtering
            const allMovies = await this.getAllMovies();
            return allMovies.filter(movie => 
                movie.name.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 10);
        }
    }

    // Authentication methods
    async sendOTP(userId) {
        try {
            const response = await this.request('/api/auth/send-otp', {
                method: 'POST',
                body: JSON.stringify({ userId })
            });
            return response;
        } catch (error) {
            // Fallback to old endpoint
            const response = await this.request('/');
            return { 
                success: true, 
                development_otp: response.toString(),
                message: 'OTP sent successfully'
            };
        }
    }

    async verifyOTP(userId, otp) {
        try {
            const response = await this.request('/api/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ userId, otp })
            });
            return response;
        } catch (error) {
            // Simple fallback verification
            return {
                success: false,
                message: 'OTP is wrong',
                //user: { id: userId, isGuest: false }
            };
        }
    }

    // Get theater details
    async getTheaterDetails(theaterId) {
        try {
            const response = await this.request(`/api/theaters/${theaterId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch theater ${theaterId}:`, error);
            return null;
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

export const apiService = new ApiService();