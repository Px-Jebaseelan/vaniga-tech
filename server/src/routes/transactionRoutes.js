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
import { validate, createTransactionSchema } from '../middleware/validateRequest.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// All transaction routes are protected
router.use(protect);

// Transaction CRUD
router.route('/').get(getTransactions).post(validate(createTransactionSchema), createTransaction);

router
    .route('/:id')
    .get(getTransactionById)
    .put(updateTransaction)
    .delete(deleteTransaction);

// Dashboard statistics
router.get('/stats/dashboard', getDashboardStats);

// Export transactions
router.get('/export', async (req, res, next) => {
    try {
        const { format = 'csv', startDate, endDate } = req.query;
        const query = { userId: req.user._id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const Transaction = (await import('../models/Transaction.js')).default;
        const transactions = await Transaction.find(query).sort({ date: -1 });

        if (format === 'csv') {
            // CSV format
            const csv = [
                ['Date', 'Type', 'Amount', 'Customer', 'Description', 'Category', 'Payment Method'].join(','),
                ...transactions.map(t => [
                    new Date(t.date).toLocaleDateString(),
                    t.type,
                    t.amount,
                    t.customerName || '',
                    t.description || '',
                    t.category || '',
                    t.paymentMethod || ''
                ].join(','))
            ].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.csv`);
            return res.send(csv);
        } else {
            // JSON format for Excel (frontend will handle conversion)
            return res.json({
                success: true,
                data: transactions.map(t => ({
                    Date: new Date(t.date).toLocaleDateString(),
                    Type: t.type,
                    Amount: t.amount,
                    Customer: t.customerName || '',
                    Description: t.description || '',
                    Category: t.category || '',
                    'Payment Method': t.paymentMethod || ''
                }))
            });
        }
    } catch (error) {
        next(error);
    }
});

export default router;
