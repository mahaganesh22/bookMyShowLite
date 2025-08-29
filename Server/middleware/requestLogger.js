// middleware/requestLogger.js
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    
    // Log request
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${req.ip}`);
    
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode < 400 ? '\x1b[32m' : '\x1b[31m';
        const resetColor = '\x1b[0m';
        
        console.log(
            `[${timestamp}] ${req.method} ${req.originalUrl} - ` +
            `${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
        );
    });
    
    next();
};