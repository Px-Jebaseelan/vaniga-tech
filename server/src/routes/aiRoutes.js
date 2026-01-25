import express from 'express';
import {
    getBusinessInsights,
    getCreditRecommendation,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/insights', getBusinessInsights);
router.get('/credit-recommendation/:customerId', getCreditRecommendation);

export default router;
