import rateLimit from 'express-rate-limit';

// General API rate limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth endpoints rate limiter - 5 requests per 15 minutes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes',
    },
    skipSuccessfulRequests: true, // Don't count successful logins
});

// AI endpoints rate limiter - 10 requests per 15 minutes
export const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many AI requests, please try again after 15 minutes. This helps us manage API costs.',
    },
});

// OTP rate limiter - 3 requests per hour
export const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: {
        success: false,
        message: 'Too many OTP requests, please try again after 1 hour',
    },
});

// Export rate limiter - 20 requests per hour
export const exportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many export requests, please try again later',
    },
});
