import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// @desc    Get AI-powered business insights
// @route   GET /api/ai/insights
// @access  Private
export const getBusinessInsights = async (req, res, next) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({
                success: false,
                message: 'AI service is not configured. Please add GEMINI_API_KEY to environment variables.',
            });
        }

        // Fetch user's transaction data
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ date: -1 })
            .limit(100);

        if (transactions.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    insights: [
                        'Start recording transactions to get personalized AI insights!',
                        'Track your daily credit and payments to build your VanigaScore.',
                        'Regular transaction recording helps us provide better recommendations.',
                    ],
                },
            });
        }

        // Prepare data summary for AI
        const summary = prepareDataSummary(transactions, req.user);

        // Generate insights using Gemini (using latest stable model)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const prompt = `You are a financial advisor for micro and small businesses in India. Analyze this business data and provide 4-5 actionable insights and recommendations. Be specific, practical, and encouraging.

Business Data:
${summary}

Provide insights in the following format:
1. [Insight about cash flow or credit management]
2. [Recommendation for improving credit score]
3. [Suggestion for business growth]
4. [Risk assessment or warning if applicable]
5. [Positive encouragement based on their progress]

Keep each point concise (1-2 sentences) and actionable.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse insights from response
        const insights = text
            .split('\n')
            .filter(line => line.trim().match(/^\d+\./))
            .map(line => line.replace(/^\d+\.\s*/, '').trim());

        res.status(200).json({
            success: true,
            data: {
                insights: insights.length > 0 ? insights : [text],
                generatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error('AI Insights Error:', error);

        // Return a user-friendly error message
        let errorMessage = 'Failed to generate AI insights';

        if (error.message && error.message.includes('API key')) {
            errorMessage = 'Invalid GEMINI_API_KEY. Please check your API key configuration.';
        } else if (error.message && error.message.includes('quota')) {
            errorMessage = 'API quota exceeded. Please try again later.';
        } else if (error.message) {
            errorMessage = `AI service error: ${error.message}`;
        }

        return res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

// @desc    Get AI credit recommendation for a customer
// @route   GET /api/ai/credit-recommendation/:customerId
// @access  Private
export const getCreditRecommendation = async (req, res, next) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({
                success: false,
                message: 'AI service is not configured.',
            });
        }

        const customer = await Customer.findOne({
            _id: req.params.customerId,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        // Get customer's transaction history
        const transactions = await Transaction.find({
            userId: req.user._id,
            customerName: customer.name,
        }).sort({ date: -1 });

        if (transactions.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    recommendedCreditLimit: 5000,
                    riskLevel: 'UNKNOWN',
                    reasoning: 'No transaction history available. Start with a conservative credit limit of ₹5,000.',
                },
            });
        }

        // Prepare customer data
        const customerSummary = prepareCustomerSummary(customer, transactions);

        // Generate recommendation using Gemini (using latest stable model)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const prompt = `You are a credit risk analyst for micro-businesses in India. Analyze this customer's data and recommend a safe credit limit.

Customer Data:
${customerSummary}

Provide your recommendation in this exact format:
CREDIT_LIMIT: [amount in rupees, number only]
RISK_LEVEL: [LOW/MEDIUM/HIGH]
REASONING: [2-3 sentences explaining your recommendation]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse AI response
        const creditMatch = text.match(/CREDIT_LIMIT:\s*(\d+)/);
        const riskMatch = text.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/);
        const reasoningMatch = text.match(/REASONING:\s*(.+)/s);

        res.status(200).json({
            success: true,
            data: {
                recommendedCreditLimit: creditMatch ? parseInt(creditMatch[1]) : 10000,
                riskLevel: riskMatch ? riskMatch[1] : 'MEDIUM',
                reasoning: reasoningMatch ? reasoningMatch[1].trim() : text,
                currentOutstanding: customer.outstandingBalance,
            },
        });
    } catch (error) {
        console.error('Credit Recommendation Error:', error);
        next(error);
    }
};

// Helper function to prepare data summary
function prepareDataSummary(transactions, user) {
    const totalCredit = transactions
        .filter(t => t.type === 'CREDIT_GIVEN')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalPayments = transactions
        .filter(t => t.type === 'PAYMENT_RECEIVED')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingAmount = totalCredit - totalPayments;
    const collectionRate = totalCredit > 0 ? ((totalPayments / totalCredit) * 100).toFixed(1) : 0;

    return `
Business: ${user.businessName}
VanigaScore: ${user.vanigaScore}/900
Total Transactions: ${transactions.length}
Total Credit Given: ₹${totalCredit.toLocaleString('en-IN')}
Total Payments Received: ₹${totalPayments.toLocaleString('en-IN')}
Pending Amount: ₹${pendingAmount.toLocaleString('en-IN')}
Collection Rate: ${collectionRate}%
Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
Transaction Period: ${transactions.length > 0 ? `${new Date(transactions[transactions.length - 1].date).toLocaleDateString()} to ${new Date(transactions[0].date).toLocaleDateString()}` : 'N/A'}
    `.trim();
}

// Helper function to prepare customer summary
function prepareCustomerSummary(customer, transactions) {
    const creditTransactions = transactions.filter(t => t.type === 'CREDIT_GIVEN');
    const paymentTransactions = transactions.filter(t => t.type === 'PAYMENT_RECEIVED');

    const avgPaymentTime = calculateAvgPaymentTime(transactions);
    const paymentConsistency = (paymentTransactions.length / creditTransactions.length * 100).toFixed(1);

    return `
Customer Name: ${customer.name}
Total Credit Given: ₹${customer.totalCreditGiven.toLocaleString('en-IN')}
Total Payments Received: ₹${customer.totalPaymentReceived.toLocaleString('en-IN')}
Outstanding Balance: ₹${customer.outstandingBalance.toLocaleString('en-IN')}
Number of Credit Transactions: ${creditTransactions.length}
Number of Payments: ${paymentTransactions.length}
Payment Consistency: ${paymentConsistency}%
Average Payment Time: ${avgPaymentTime} days
Last Transaction: ${customer.lastTransactionDate ? new Date(customer.lastTransactionDate).toLocaleDateString() : 'N/A'}
    `.trim();
}

// Helper to calculate average payment time
function calculateAvgPaymentTime(transactions) {
    if (transactions.length < 2) return 'N/A';

    const creditDates = transactions
        .filter(t => t.type === 'CREDIT_GIVEN')
        .map(t => new Date(t.date));

    const paymentDates = transactions
        .filter(t => t.type === 'PAYMENT_RECEIVED')
        .map(t => new Date(t.date));

    if (creditDates.length === 0 || paymentDates.length === 0) return 'N/A';

    // Simple average of time differences
    let totalDays = 0;
    let count = 0;

    for (let i = 0; i < Math.min(creditDates.length, paymentDates.length); i++) {
        const diff = Math.abs(paymentDates[i] - creditDates[i]) / (1000 * 60 * 60 * 24);
        totalDays += diff;
        count++;
    }

    return count > 0 ? Math.round(totalDays / count) : 'N/A';
}
