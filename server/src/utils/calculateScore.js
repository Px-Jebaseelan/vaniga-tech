import Transaction from '../models/Transaction.js';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * THE VANIGATECH CREDIT SCORING ALGORITHM (VanigaScore™)
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * Generate a proprietary credit score (300-900) for micro-MSMEs based on
 * their digital transaction history. This score helps banks assess
 * creditworthiness of merchants who lack traditional credit footprints.
 * 
 * SCORING METHODOLOGY:
 * 
 * 1. BASE SCORE: 300 (minimum, like CIBIL)
 * 
 * 2. VOLUME COMPONENT (Max: +250 points)
 *    - Measures total transaction value in last 30 days
 *    - Formula: (Total Volume * 0.05)
 *    - Rationale: Higher business volume = stronger repayment capacity
 *    - Example: ₹5,000 daily sales = ₹1,50,000/month = +250 points
 * 
 * 3. CONSISTENCY COMPONENT (Max: +300 points)
 *    - Measures number of active business days in last 30 days
 *    - Formula: (Active Days * 10)
 *    - Rationale: Regular activity = stable business = lower risk
 *    - Example: 30 active days = +300 points
 * 
 * 4. HEALTH COMPONENT (Max: +50 points)
 *    - Measures payment collection efficiency
 *    - Formula: (Payment Received / Credit Given) * 50
 *    - Rationale: Good collection = healthy cash flow
 *    - Example: ₹8,000 collected / ₹10,000 credit = 0.8 * 50 = +40 points
 * 
 * MAXIMUM POSSIBLE SCORE: 300 + 250 + 300 + 50 = 900
 * 
 * LOAN ELIGIBILITY THRESHOLD: 650+
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Calculate VanigaScore for a user based on last 30 days of transactions
 * 
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<number>} - Calculated score (300-900)
 */
export const calculateVanigaScore = async (userId) => {
    try {
        // Define 30-day window for analysis
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch all transactions in the last 30 days
        const transactions = await Transaction.find({
            userId,
            date: { $gte: thirtyDaysAgo },
        });

        // If no transactions, return base score
        if (transactions.length === 0) {
            return 300;
        }

        // ─────────────────────────────────────────────────────────────────
        // COMPONENT 1: VOLUME SCORE
        // ─────────────────────────────────────────────────────────────────
        const totalVolume = transactions.reduce((sum, txn) => {
            // Only count revenue-generating transactions
            if (txn.type === 'CREDIT_GIVEN' || txn.type === 'PAYMENT_RECEIVED') {
                return sum + txn.amount;
            }
            return sum;
        }, 0);

        const volumeScore = Math.min(totalVolume * 0.05, 250); // Cap at 250

        // ─────────────────────────────────────────────────────────────────
        // COMPONENT 2: CONSISTENCY SCORE
        // ─────────────────────────────────────────────────────────────────
        // Count unique days with at least one transaction
        const uniqueDays = new Set(
            transactions.map((txn) => txn.date.toISOString().split('T')[0])
        );
        const activeDays = uniqueDays.size;
        const consistencyScore = Math.min(activeDays * 10, 300); // Cap at 300

        // ─────────────────────────────────────────────────────────────────
        // COMPONENT 3: HEALTH SCORE (Cash Flow Efficiency)
        // ─────────────────────────────────────────────────────────────────
        const totalCreditGiven = transactions
            .filter((txn) => txn.type === 'CREDIT_GIVEN')
            .reduce((sum, txn) => sum + txn.amount, 0);

        const totalPaymentReceived = transactions
            .filter((txn) => txn.type === 'PAYMENT_RECEIVED')
            .reduce((sum, txn) => sum + txn.amount, 0);

        let healthScore = 0;
        if (totalCreditGiven > 0) {
            const collectionRatio = totalPaymentReceived / totalCreditGiven;
            healthScore = Math.min(collectionRatio * 50, 50); // Cap at 50
        } else if (totalPaymentReceived > 0) {
            // If only receiving payments (no credit given), that's excellent
            healthScore = 50;
        }

        // ─────────────────────────────────────────────────────────────────
        // FINAL SCORE CALCULATION
        // ─────────────────────────────────────────────────────────────────
        const baseScore = 300;
        const finalScore = Math.round(
            baseScore + volumeScore + consistencyScore + healthScore
        );

        // Ensure score stays within valid range
        const vanigaScore = Math.min(Math.max(finalScore, 300), 900);

        // Log calculation for transparency (useful for debugging/audits)
        console.log(`
    ┌─────────────────────────────────────────────────────┐
    │ VanigaScore Calculation for User: ${userId}
    ├─────────────────────────────────────────────────────┤
    │ Base Score:        ${baseScore}
    │ Volume Score:      ${volumeScore.toFixed(2)} (₹${totalVolume.toLocaleString('en-IN')})
    │ Consistency Score: ${consistencyScore} (${activeDays} active days)
    │ Health Score:      ${healthScore.toFixed(2)} (${((totalPaymentReceived / (totalCreditGiven || 1)) * 100).toFixed(1)}% collection)
    ├─────────────────────────────────────────────────────┤
    │ FINAL SCORE:       ${vanigaScore}
    └─────────────────────────────────────────────────────┘
    `);

        return vanigaScore;
    } catch (error) {
        console.error('Error calculating VanigaScore:', error);
        return 300; // Return base score on error
    }
};

/**
 * Get detailed score breakdown for display in frontend
 * 
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} - Detailed breakdown of score components
 */
export const getScoreBreakdown = async (userId) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
        userId,
        date: { $gte: thirtyDaysAgo },
    });

    if (transactions.length === 0) {
        return {
            score: 300,
            breakdown: {
                base: 300,
                volume: 0,
                consistency: 0,
                health: 0,
            },
            metrics: {
                totalVolume: 0,
                activeDays: 0,
                collectionRate: 0,
            },
        };
    }

    // Calculate components (same logic as above)
    const totalVolume = transactions.reduce((sum, txn) => {
        if (txn.type === 'CREDIT_GIVEN' || txn.type === 'PAYMENT_RECEIVED') {
            return sum + txn.amount;
        }
        return sum;
    }, 0);

    const volumeScore = Math.min(totalVolume * 0.05, 250);

    const uniqueDays = new Set(
        transactions.map((txn) => txn.date.toISOString().split('T')[0])
    );
    const activeDays = uniqueDays.size;
    const consistencyScore = Math.min(activeDays * 10, 300);

    const totalCreditGiven = transactions
        .filter((txn) => txn.type === 'CREDIT_GIVEN')
        .reduce((sum, txn) => sum + txn.amount, 0);

    const totalPaymentReceived = transactions
        .filter((txn) => txn.type === 'PAYMENT_RECEIVED')
        .reduce((sum, txn) => sum + txn.amount, 0);

    let healthScore = 0;
    let collectionRate = 0;
    if (totalCreditGiven > 0) {
        collectionRate = (totalPaymentReceived / totalCreditGiven) * 100;
        healthScore = Math.min((totalPaymentReceived / totalCreditGiven) * 50, 50);
    } else if (totalPaymentReceived > 0) {
        healthScore = 50;
        collectionRate = 100;
    }

    const finalScore = Math.min(
        Math.max(Math.round(300 + volumeScore + consistencyScore + healthScore), 300),
        900
    );

    return {
        score: finalScore,
        breakdown: {
            base: 300,
            volume: Math.round(volumeScore),
            consistency: consistencyScore,
            health: Math.round(healthScore),
        },
        metrics: {
            totalVolume,
            activeDays,
            collectionRate: Math.round(collectionRate),
        },
    };
};
