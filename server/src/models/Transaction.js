import mongoose from 'mongoose';

/**
 * Transaction Schema - Represents daily business transactions (Digital Khata)
 * 
 * Transaction Types:
 * - CREDIT_GIVEN: Money lent to customers (Udhar/Credit)
 * - PAYMENT_RECEIVED: Money received from customers
 * - EXPENSE: Business expenses (inventory, rent, etc.)
 * 
 * This data is the foundation for calculating VanigaScore
 */
const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // Indexed for faster user-specific queries
        },
        type: {
            type: String,
            required: [true, 'Transaction type is required'],
            enum: {
                values: ['CREDIT_GIVEN', 'PAYMENT_RECEIVED', 'EXPENSE'],
                message: '{VALUE} is not a valid transaction type',
            },
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        customerName: {
            type: String,
            trim: true,
            maxlength: [100, 'Customer name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        category: {
            type: String,
            enum: ['RENT', 'INVENTORY', 'UTILITIES', 'SALARIES', 'TRANSPORT', 'MARKETING', 'OTHER'],
            default: 'OTHER',
        },
        gstAmount: {
            type: Number,
            default: 0,
        },
        paymentMethod: {
            type: String,
            enum: {
                values: ['CASH', 'UPI', 'PENDING'],
                message: '{VALUE} is not a valid payment method',
            },
            default: 'CASH',
        },
        date: {
            type: Date,
            default: Date.now,
            index: true, // Indexed for date-range queries in score calculation
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Compound Index: Optimize queries for user's transactions within date ranges
 * Critical for VanigaScore calculation (last 30 days analysis)
 */
transactionSchema.index({ userId: 1, date: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
