import express from 'express';
import {
    getBusinessInsights,
    getCreditRecommendation,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All routes are protected and rate limited
router.use(protect);
router.use(aiLimiter);

router.get('/insights', getBusinessInsights);
router.get('/credit-recommendation/:customerId', getCreditRecommendation);

export default router;
