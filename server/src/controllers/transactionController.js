import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { calculateVanigaScore, getScoreBreakdown } from '../utils/calculateScore.js';

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
export const createTransaction = async (req, res) => {
    try {
        const { type, amount, customerName, description, paymentMethod, date } = req.body;

        // Validate required fields
        if (!type || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Please provide transaction type and amount',
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId: req.user._id,
            type,
            amount,
            customerName,
            description,
            paymentMethod,
            date: date || Date.now(),
        });

        // Recalculate VanigaScore after new transaction
        const newScore = await calculateVanigaScore(req.user._id);

        // Update user's score and loan eligibility
        const user = await User.findById(req.user._id);
        user.vanigaScore = newScore;
        user.updateLoanEligibility();
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: {
                transaction,
                updatedScore: newScore,
                loanEligible: user.loanEligible,
            },
        });
    } catch (error) {
        console.error('Create Transaction Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for logged-in user
 * @access  Private
 */
export const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, type, limit = 50 } = req.query;

        // Build query
        const query = { userId: req.user._id };

        // Add date filter if provided
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Add type filter if provided
        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: { transactions },
        });
    } catch (error) {
        console.error('Get Transactions Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction by ID
 * @access  Private
 */
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        // Ensure user owns this transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this transaction',
            });
        }

        res.status(200).json({
            success: true,
            data: { transaction },
        });
    } catch (error) {
        console.error('Get Transaction Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update a transaction
 * @access  Private
 */
export const updateTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        // Ensure user owns this transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this transaction',
            });
        }

        // Update transaction
        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Recalculate score after update
        const newScore = await calculateVanigaScore(req.user._id);
        const user = await User.findById(req.user._id);
        user.vanigaScore = newScore;
        user.updateLoanEligibility();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            data: {
                transaction,
                updatedScore: newScore,
            },
        });
    } catch (error) {
        console.error('Update Transaction Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction
 * @access  Private
 */
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        // Ensure user owns this transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this transaction',
            });
        }

        await transaction.deleteOne();

        // Recalculate score after deletion
        const newScore = await calculateVanigaScore(req.user._id);
        const user = await User.findById(req.user._id);
        user.vanigaScore = newScore;
        user.updateLoanEligibility();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
            data: { updatedScore: newScore },
        });
    } catch (error) {
        console.error('Delete Transaction Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

/**
 * @route   GET /api/transactions/stats/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: thirtyDaysAgo },
        });

        // Calculate totals
        const totalCreditGiven = transactions
            .filter((t) => t.type === 'CREDIT_GIVEN')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalPaymentReceived = transactions
            .filter((t) => t.type === 'PAYMENT_RECEIVED')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter((t) => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);

        const pendingAmount = totalCreditGiven - totalPaymentReceived;

        // Get score breakdown
        const scoreBreakdown = await getScoreBreakdown(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalCreditGiven,
                    totalPaymentReceived,
                    totalExpenses,
                    pendingAmount,
                    transactionCount: transactions.length,
                },
                scoreBreakdown,
            },
        });
    } catch (error) {
        console.error('Get Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
