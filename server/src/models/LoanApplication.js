const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        loanAmount: {
            type: Number,
            required: [true, 'Loan amount is required'],
            min: [1000, 'Minimum loan amount is ₹1,000'],
        },
        purpose: {
            type: String,
            required: [true, 'Loan purpose is required'],
            enum: ['BUSINESS_EXPANSION', 'INVENTORY', 'EQUIPMENT', 'WORKING_CAPITAL', 'OTHER'],
        },
        tenure: {
            type: Number,
            required: [true, 'Loan tenure is required'],
            min: [1, 'Minimum tenure is 1 month'],
            max: [60, 'Maximum tenure is 60 months'],
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED'],
            default: 'PENDING',
        },
        vanigaScoreAtApplication: {
            type: Number,
            required: true,
        },
        remarks: {
            type: String,
            trim: true,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        processedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

loanApplicationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
