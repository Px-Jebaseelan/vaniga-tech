import express from 'express';
import {
    register,
    login,
    getMe,
    updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, registerUserSchema, loginUserSchema } from '../middleware/validateRequest.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, validate(registerUserSchema), register);
router.post('/login', authLimiter, validate(loginUserSchema), login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

export default router;
