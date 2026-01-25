import express from 'express';
import {
    getBudgets,
    createOrUpdateBudget,
    updateBudgetSpent,
    getExpensePredictions,
    deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/').get(getBudgets).post(createOrUpdateBudget);

router.get('/predictions', getExpensePredictions);

router.route('/:id').delete(deleteBudget);

router.put('/:id/spent', updateBudgetSpent);

export default router;
