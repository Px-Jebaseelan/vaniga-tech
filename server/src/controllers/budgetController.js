import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all budgets for current month
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const { month = currentMonth } = req.query;

        const budgets = await Budget.find({
            userId: req.user._id,
            month,
        }).sort({ category: 1 });

        res.status(200).json({
            success: true,
            count: budgets.length,
            data: budgets,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create or update budget
// @route   POST /api/budgets
// @access  Private
export const createOrUpdateBudget = async (req, res, next) => {
    try {
        const { category, monthlyLimit, month, alertThreshold } = req.body;

        const currentMonth = month || new Date().toISOString().slice(0, 7);

        // Check if budget already exists
        let budget = await Budget.findOne({
            userId: req.user._id,
            category,
            month: currentMonth,
        });

        if (budget) {
            // Update existing budget
            budget.monthlyLimit = monthlyLimit;
            if (alertThreshold !== undefined) {
                budget.alertThreshold = alertThreshold;
            }
            await budget.save();
        } else {
            // Create new budget
            budget = await Budget.create({
                userId: req.user._id,
                category,
                monthlyLimit,
                month: currentMonth,
                alertThreshold: alertThreshold || 80,
            });
        }

        res.status(201).json({
            success: true,
            data: budget,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update budget spent amount
// @route   PUT /api/budgets/:id/spent
// @access  Private
export const updateBudgetSpent = async (req, res, next) => {
    try {
        const { amount } = req.body;

        const budget = await Budget.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        budget.currentSpent += amount;

        // Check if alert threshold is reached
        const utilizationPercentage = (budget.currentSpent / budget.monthlyLimit) * 100;
        if (utilizationPercentage >= budget.alertThreshold && !budget.alertSent) {
            budget.alertSent = true;
            // TODO: Send notification/alert
        }

        await budget.save();

        res.status(200).json({
            success: true,
            data: budget,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get expense predictions
// @route   GET /api/budgets/predictions
// @access  Private
export const getExpensePredictions = async (req, res, next) => {
    try {
        // Get last 6 months of expense data
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const expenses = await Transaction.find({
            userId: req.user._id,
            type: 'EXPENSE',
            date: { $gte: sixMonthsAgo },
        });

        // Group by category and calculate averages
        const categoryAverages = {};
        const categories = ['RENT', 'INVENTORY', 'UTILITIES', 'SALARIES', 'TRANSPORT', 'MARKETING', 'OTHER'];

        categories.forEach(category => {
            const categoryExpenses = expenses.filter(e => e.expenseCategory === category);

            if (categoryExpenses.length > 0) {
                const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                const average = total / 6; // Average over 6 months

                // Simple prediction: average + 5% growth
                const predicted = Math.round(average * 1.05);

                categoryAverages[category] = {
                    average: Math.round(average),
                    predicted,
                    transactionCount: categoryExpenses.length,
                    trend: calculateTrend(categoryExpenses),
                };
            } else {
                categoryAverages[category] = {
                    average: 0,
                    predicted: 0,
                    transactionCount: 0,
                    trend: 'STABLE',
                };
            }
        });

        // Calculate total predicted expenses
        const totalPredicted = Object.values(categoryAverages).reduce(
            (sum, cat) => sum + cat.predicted,
            0
        );

        res.status(200).json({
            success: true,
            data: {
                predictions: categoryAverages,
                totalPredicted,
                basedOnMonths: 6,
                generatedAt: new Date(),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        await budget.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Budget deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to calculate trend
function calculateTrend(expenses) {
    if (expenses.length < 2) return 'STABLE';

    // Sort by date
    const sorted = expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Compare first half vs second half
    const midpoint = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, midpoint);
    const secondHalf = sorted.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, e) => sum + e.amount, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, e) => sum + e.amount, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change > 10) return 'INCREASING';
    if (change < -10) return 'DECREASING';
    return 'STABLE';
}
