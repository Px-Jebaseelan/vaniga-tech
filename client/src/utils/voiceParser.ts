/**
 * Voice Parser - Extract transaction details from natural language
 * Industry-grade NLP implementation with high accuracy
 */

export interface ParsedTransaction {
    type: 'CREDIT_GIVEN' | 'PAYMENT_RECEIVED' | 'EXPENSE' | null;
    customerName: string | null;
    amount: number | null;
    confidence: number;
    rawTranscript: string;
}

/**
 * Parse voice input to extract transaction details
 * Uses multiple pattern matching strategies for robustness
 */
export const parseVoiceInput = (transcript: string): ParsedTransaction => {
    const lowerTranscript = transcript.toLowerCase().trim();
    const rawTranscript = transcript.trim();

    let type: 'CREDIT_GIVEN' | 'PAYMENT_RECEIVED' | 'EXPENSE' | null = null;
    let customerName: string | null = null;
    let amount: number | null = null;
    let confidence = 0;

    // ==================== TRANSACTION TYPE DETECTION ====================

    // Credit Given patterns (highest priority)
    const creditPatterns = [
        'credit given',
        'credits given',  // Plural form
        'gave credit',
        'gave credits',   // Plural form
        'credit to',
        'credits to',     // Plural form
        'lent',
        'udhar diya',
        'udhar',
        'loan to',
        'advanced',
        'credit is',      // "credit is 150"
        'credits is',     // "credits is 150"
    ];

    if (creditPatterns.some(pattern => lowerTranscript.includes(pattern))) {
        type = 'CREDIT_GIVEN';
        confidence += 35;
    }

    // Payment Received patterns
    const paymentPatterns = [
        'payment received',
        'payments received',  // Plural
        'received payment',
        'received payments',  // Plural
        'got payment',
        'got payments',       // Plural
        'payment from',
        'payments from',      // Plural
        'paisa mila',
        'received from',
        'collected',
        'got money',
    ];

    if (paymentPatterns.some(pattern => lowerTranscript.includes(pattern))) {
        type = 'PAYMENT_RECEIVED';
        confidence += 35;
    }

    // Expense patterns
    const expensePatterns = [
        'expense',
        'expenses',           // Plural
        'spent',
        'paid for',
        'kharcha',
        'payment for',
        'bought',
        'purchased',
    ];

    if (expensePatterns.some(pattern => lowerTranscript.includes(pattern))) {
        type = 'EXPENSE';
        confidence += 35;
    }

    // ==================== AMOUNT EXTRACTION ====================

    const amountPatterns = [
        // "was ₹150" or "were ₹200" patterns
        /(?:was|were)\s*₹?\s*([\d,]+)/i,

        // "is 150" or "are 150" patterns (for "credit is 150")
        /(?:is|are)\s*₹?\s*([\d,]+)/i,

        // Comma-separated with currency: "17,000 rupees" or "₹17,000"
        /([\d,]+)\s*(?:rupees?|rs\.?|₹|dollars?)/i,
        /(?:rupees?|rs\.?|₹|dollars?)\s*([\d,]+)/i,

        // Number with multiplier: "17 thousand", "2 lakh"
        /(\d+(?:\.\d+)?)\s*(?:thousand|hazaar|k)/i,
        /(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac)/i,
        /(\d+(?:\.\d+)?)\s*(?:crore|crores|cr)/i,

        // Plain comma-separated numbers: "17,000"
        /([\d,]{4,})/,

        // Any number as fallback
        /(\d+(?:\.\d+)?)/,
    ];

    for (const pattern of amountPatterns) {
        const match = lowerTranscript.match(pattern);
        if (match) {
            // Remove commas and parse
            let extractedAmount = parseFloat(match[1].replace(/,/g, ''));

            // Apply multipliers
            if (lowerTranscript.includes('thousand') || lowerTranscript.includes('hazaar') || lowerTranscript.includes(' k')) {
                extractedAmount *= 1000;
            } else if (lowerTranscript.includes('lakh') || lowerTranscript.includes('lac')) {
                extractedAmount *= 100000;
            } else if (lowerTranscript.includes('crore') || lowerTranscript.includes('cr')) {
                extractedAmount *= 10000000;
            }

            // Validate amount is reasonable
            if (extractedAmount > 0 && extractedAmount < 100000000) { // Max 10 crore
                amount = Math.round(extractedAmount);
                confidence += 40;
                break;
            }
        }
    }

    // ==================== CUSTOMER NAME EXTRACTION ====================

    const namePatterns = [
        // "to Ramesh", "credit to Suresh Kumar" - stop before is/was/were/are
        /(?:to|credit to|gave to|lent to)\s+([a-z][a-z\s]{1,30})(?:\s+(?:is|was|were|are)|\s+\d|\s+rupees?|\s+rs|\s+₹|$)/i,
        // "from Priya", "received from Kumar" - stop before is/was/were/are
        /(?:from|payment from|received from|collected from)\s+([a-z][a-z\s]{1,30})(?:\s+(?:is|was|were|are)|\s+\d|\s+rupees?|\s+rs|\s+₹|$)/i,
        // Hindi: "Ramesh ko", "Suresh se"
        /([a-z][a-z\s]{1,30})\s+(?:ko|se)(?:\s|$)/i,
    ];

    for (const pattern of namePatterns) {
        const match = rawTranscript.match(pattern);
        if (match && match[1]) {
            const extractedName = match[1].trim();

            // Filter out common words that aren't names
            const excludeWords = ['rent', 'salary', 'utilities', 'inventory', 'transport', 'marketing', 'expense', 'payment', 'credit', 'was', 'were', 'is', 'are'];
            if (!excludeWords.some(word => extractedName.toLowerCase().includes(word))) {
                // Capitalize properly
                customerName = extractedName
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                confidence += 25;
                break;
            }
        }
    }

    return {
        type,
        customerName,
        amount,
        confidence: Math.min(100, confidence),
        rawTranscript,
    };
};

/**
 * Generate example voice commands for user guidance
 */
export const getVoiceExamples = (): string[] => {
    return [
        'Credit given to Ramesh 5000 rupees',
        'Payment received from Suresh 3000 rupees',
        'Expense 17,000 rupees for rent',
        'Gave credit to Priya 10 thousand',
        'Received payment from Kumar 5000',
        'Expense 2 lakh for inventory',
    ];
};

/**
 * Validate parsed transaction with strict criteria
 */
export const isValidParsedTransaction = (parsed: ParsedTransaction): boolean => {
    return (
        parsed.type !== null &&
        parsed.amount !== null &&
        parsed.amount > 0 &&
        parsed.confidence >= 60 // Require 60% confidence minimum
    );
};

/**
 * Get confidence level description
 */
export const getConfidenceLevel = (confidence: number): {
    level: 'high' | 'medium' | 'low';
    color: string;
    message: string;
} => {
    if (confidence >= 80) {
        return {
            level: 'high',
            color: 'green',
            message: 'High confidence - Ready to confirm',
        };
    } else if (confidence >= 60) {
        return {
            level: 'medium',
            color: 'yellow',
            message: 'Medium confidence - Please verify details',
        };
    } else {
        return {
            level: 'low',
            color: 'red',
            message: 'Low confidence - Please try again',
        };
    }
};
