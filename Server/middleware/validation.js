// middleware/validation.js
export const validateMovieSlug = (req, res, next) => {
    const { movieSlug } = req.params;
    
    if (!movieSlug || typeof movieSlug !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Invalid movie slug provided'
        });
    }
    
    // Basic slug validation
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(movieSlug)) {
        return res.status(400).json({
            success: false,
            error: 'Movie slug must contain only lowercase letters, numbers, and hyphens'
        });
    }
    
    next();
};

export const validateTheaterID = (req, res, next) => {
    const { theaterId } = req.params;
    
    if (!theaterId || typeof theaterId !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Invalid theater ID provided'
        });
    }
    
    next();
};

export const validateDateParam = (req, res, next) => {
    const { date } = req.query;
    
    if (date) {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(date)) {
            return res.status(400).json({
                success: false,
                error: 'Date must be in YYYY-MM-DD format'
            });
        }
        
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date provided'
            });
        }
        
        // Check if date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (parsedDate < today) {
            return res.status(400).json({
                success: false,
                error: 'Date cannot be in the past'
            });
        }
    }
    
    next();
};