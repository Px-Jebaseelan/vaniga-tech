/**
 * Voice Parser - Extract transaction details from natural language
 */

export interface ParsedTransaction {
    type: 'CREDIT_GIVEN' | 'PAYMENT_RECEIVED' | 'EXPENSE' | null;
    customerName: string | null;
    amount: number | null;
    confidence: number;
}

/**
 * Parse voice input to extract transaction details
 */
export const parseVoiceInput = (transcript: string): ParsedTransaction => {
    const lowerTranscript = transcript.toLowerCase().trim();

    let type: 'CREDIT_GIVEN' | 'PAYMENT_RECEIVED' | 'EXPENSE' | null = null;
    let customerName: string | null = null;
    let amount: number | null = null;
    let confidence = 0;

    // Detect transaction type
    if (
        lowerTranscript.includes('credit given') ||
        lowerTranscript.includes('gave credit') ||
        lowerTranscript.includes('credit to') ||
        lowerTranscript.includes('lent') ||
        lowerTranscript.includes('udhar diya')
    ) {
        type = 'CREDIT_GIVEN';
        confidence += 30;
    } else if (
        lowerTranscript.includes('payment received') ||
        lowerTranscript.includes('received payment') ||
        lowerTranscript.includes('got payment') ||
        lowerTranscript.includes('payment from') ||
        lowerTranscript.includes('paisa mila')
    ) {
        type = 'PAYMENT_RECEIVED';
        confidence += 30;
    } else if (
        lowerTranscript.includes('expense') ||
        lowerTranscript.includes('spent') ||
        lowerTranscript.includes('paid for') ||
        lowerTranscript.includes('kharcha')
    ) {
        type = 'EXPENSE';
        confidence += 30;
    }

    // Extract amount
    const amountPatterns = [
        // Handle comma-separated numbers: 17,000 or 1,00,000
        /([\d,]+)\s*(?:rupees?|rs\.?|₹)/i,
        /(?:rupees?|rs\.?|₹)\s*([\d,]+)/i,
        // Handle "17 thousand" or "17 hazaar"
        /(\d+)\s*(?:thousand|hazaar|lakh|lakhs)/i,
        // Handle plain numbers with commas
        /([\d,]{4,})/,
        // Fallback to any number
        /(\d+)/,
    ];

    for (const pattern of amountPatterns) {
        const match = lowerTranscript.match(pattern);
        if (match) {
            // Remove commas from the matched number
            let extractedAmount = parseInt(match[1].replace(/,/g, ''));

            // Handle "thousand" or "hazaar"
            if (lowerTranscript.includes('thousand') || lowerTranscript.includes('hazaar')) {
                extractedAmount *= 1000;
            }

            // Handle "lakh" or "lakhs"
            if (lowerTranscript.includes('lakh')) {
                extractedAmount *= 100000;
            }

            amount = extractedAmount;
            confidence += 40;
            break;
        }
    }

    // Extract customer name (words between "to" and amount, or after "from")
    const namePatterns = [
        /(?:to|credit to|gave to)\s+([a-z]+(?:\s+[a-z]+)?)/i,
        /(?:from|payment from|received from)\s+([a-z]+(?:\s+[a-z]+)?)/i,
        /([a-z]+(?:\s+[a-z]+)?)\s+(?:ko|se)/i, // Hindi patterns
    ];

    for (const pattern of namePatterns) {
        const match = transcript.match(pattern);
        if (match && match[1]) {
            // Capitalize first letter of each word
            customerName = match[1]
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            confidence += 30;
            break;
        }
    }

    return {
        type,
        customerName,
        amount,
        confidence: Math.min(100, confidence),
    };
};

/**
 * Generate example voice commands
 */
export const getVoiceExamples = (): string[] => {
    return [
        'Credit given to Ramesh 5000 rupees',
        'Payment received from Suresh 3000 rupees',
        'Expense 2000 rupees for rent',
        'Gave credit to Priya 10000',
        'Received payment from Kumar 5000',
    ];
};

/**
 * Validate parsed transaction
 */
export const isValidParsedTransaction = (parsed: ParsedTransaction): boolean => {
    return (
        parsed.type !== null &&
        parsed.amount !== null &&
        parsed.amount > 0 &&
        parsed.confidence >= 60
    );
};
