// routes/authRoutes.js
import { Router } from 'express';
import { DatabaseService } from '../services/DatabaseService.js';

const router = Router();
const dbService = new DatabaseService();

// Initialize database connection
await dbService.initialize();

// In-memory OTP storage (use Redis or database in production)
const otpStorage = new Map();

// POST /api/auth/send-otp - Send OTP for authentication
router.post('/send-otp', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID (email or phone) is required'
            });
        }

        // Validate email or phone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        
        if (!emailRegex.test(userId) && !phoneRegex.test(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Please enter a valid email or 10-digit phone number'
            });
        }

        // Generate OTP
        const otp = await dbService.generateOTP();
        
        // Store OTP with expiration (5 minutes)
        otpStorage.set(userId, {
            otp: otp.toString(),
            expires: Date.now() + 5 * 60 * 1000, // 5 minutes
            attempts: 0
        });

        // In production, send OTP via SMS/Email service
        console.log(`OTP for ${userId}: ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent successfully',
            userId,
            // In production, don't return OTP
            development_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send OTP',
            message: error.message
        });
    }
});

// POST /api/auth/verify-otp - Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;
        
        if (!userId || !otp) {
            return res.status(400).json({
                success: false,
                error: 'User ID and OTP are required'
            });
        }

        const storedOtpData = otpStorage.get(userId);
        
        if (!storedOtpData) {
            return res.status(400).json({
                success: false,
                error: 'OTP not found. Please request a new OTP.'
            });
        }

        // Check expiration
        if (Date.now() > storedOtpData.expires) {
            otpStorage.delete(userId);
            return res.status(400).json({
                success: false,
                error: 'OTP has expired. Please request a new OTP.'
            });
        }

        // Check attempts
        if (storedOtpData.attempts >= 3) {
            otpStorage.delete(userId);
            return res.status(429).json({
                success: false,
                error: 'Too many failed attempts. Please request a new OTP.'
            });
        }

        // Verify OTP
        if (otp !== storedOtpData.otp) {
            storedOtpData.attempts++;
            return res.status(400).json({
                success: false,
                error: 'Invalid OTP',
                attemptsRemaining: 3 - storedOtpData.attempts
            });
        }

        // OTP verified successfully
        otpStorage.delete(userId);
        
        // In production, create JWT token or session
        const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        
        res.json({
            success: true,
            message: 'Authentication successful',
            user: {
                id: userId,
                isGuest: false,
                sessionToken
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify OTP',
            message: error.message
        });
    }
});

// POST /api/auth/guest-login - Guest login
router.post('/guest-login', (req, res) => {
    try {
        const guestToken = `guest_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        
        res.json({
            success: true,
            message: 'Guest login successful',
            user: {
                id: 'guest',
                isGuest: true,
                sessionToken: guestToken
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in guest login:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create guest session',
            message: error.message
        });
    }
});

// GET /api/auth/validate-session - Validate session token
router.get('/validate-session', (req, res) => {
    try {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No session token provided'
            });
        }

        // Basic token validation (implement proper JWT validation in production)
        const isValid = token.startsWith('session_') || token.startsWith('guest_');
        
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid session token'
            });
        }

        const isGuest = token.startsWith('guest_');
        
        res.json({
            success: true,
            valid: true,
            user: {
                id: isGuest ? 'guest' : 'authenticated_user',
                isGuest,
                sessionToken: token
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error validating session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to validate session',
            message: error.message
        });
    }
});

export { router as authRoutes };