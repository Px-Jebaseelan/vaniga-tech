import express from 'express';
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getDashboardStats,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All transaction routes are protected
router.use(protect);

// Transaction CRUD
router.route('/').get(getTransactions).post(createTransaction);

router
    .route('/:id')
    .get(getTransactionById)
    .put(updateTransaction)
    .delete(deleteTransaction);

// Dashboard statistics
router.get('/stats/dashboard', getDashboardStats);

export default router;
