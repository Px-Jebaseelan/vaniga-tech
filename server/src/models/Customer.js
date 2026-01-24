const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            sparse: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
        },
        address: {
            type: String,
            trim: true,
        },
        totalCreditGiven: {
            type: Number,
            default: 0,
        },
        totalPaymentReceived: {
            type: Number,
            default: 0,
        },
        outstandingBalance: {
            type: Number,
            default: 0,
        },
        lastTransactionDate: {
            type: Date,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for searching customers
customerSchema.index({ userId: 1, name: 1 });
customerSchema.index({ userId: 1, phone: 1 });

// Method to update customer balances
customerSchema.methods.updateBalances = async function () {
    const Transaction = mongoose.model('Transaction');

    const transactions = await Transaction.find({
        userId: this.userId,
        customerName: this.name,
    });

    this.totalCreditGiven = transactions
        .filter((t) => t.type === 'CREDIT_GIVEN')
        .reduce((sum, t) => sum + t.amount, 0);

    this.totalPaymentReceived = transactions
        .filter((t) => t.type === 'PAYMENT_RECEIVED')
        .reduce((sum, t) => sum + t.amount, 0);

    this.outstandingBalance = this.totalCreditGiven - this.totalPaymentReceived;

    if (transactions.length > 0) {
        this.lastTransactionDate = transactions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        )[0].date;
    }

    await this.save();
};

module.exports = mongoose.model('Customer', customerSchema);
