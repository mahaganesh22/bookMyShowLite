// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Database connection errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return res.status(503).json({
            success: false,
            error: 'Database connection failed',
            message: 'Service temporarily unavailable'
        });
    }

    // Database query errors
    if (err.code && err.code.startsWith('23')) { // PostgreSQL constraint errors
        return res.status(400).json({
            success: false,
            error: 'Database constraint violation',
            message: 'Invalid data provided'
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: err.message
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token',
            message: 'Authentication failed'
        });
    }

    // Default error
    const statusCode = err.statusCode || err.status || 500;
    
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err
        })
    });
};