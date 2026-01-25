import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        category: {
            type: String,
            required: [true, 'Budget category is required'],
            enum: ['RENT', 'INVENTORY', 'UTILITIES', 'SALARIES', 'TRANSPORT', 'MARKETING', 'OTHER'],
        },
        monthlyLimit: {
            type: Number,
            required: [true, 'Monthly budget limit is required'],
            min: [0, 'Budget limit cannot be negative'],
        },
        currentSpent: {
            type: Number,
            default: 0,
            min: 0,
        },
        month: {
            type: String,
            required: true,
            // Format: YYYY-MM (e.g., "2026-01")
        },
        alertThreshold: {
            type: Number,
            default: 80, // Alert when 80% of budget is used
            min: 0,
            max: 100,
        },
        alertSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique budget per category per month per user
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

// Virtual field to calculate budget utilization percentage
budgetSchema.virtual('utilizationPercentage').get(function () {
    if (this.monthlyLimit === 0) return 0;
    return Math.round((this.currentSpent / this.monthlyLimit) * 100);
});

// Virtual field to check if budget is exceeded
budgetSchema.virtual('isExceeded').get(function () {
    return this.currentSpent > this.monthlyLimit;
});

// Virtual field to calculate remaining budget
budgetSchema.virtual('remaining').get(function () {
    return Math.max(0, this.monthlyLimit - this.currentSpent);
});

// Ensure virtuals are included in JSON output
budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

export default mongoose.model('Budget', budgetSchema);
