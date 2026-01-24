// ═══════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS FOR VANIGATECH
// ═══════════════════════════════════════════════════════════════════════

export interface User {
    id: string;
    businessName: string;
    ownerName?: string;
    phone: string;
    vanigaScore: number;
    loanEligible: boolean;
    onboardingComplete: boolean;
    gstNumber?: string;
    twoFactorEnabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Transaction {
    _id: string;
    userId: string;
    type: 'CREDIT_GIVEN' | 'PAYMENT_RECEIVED' | 'EXPENSE';
    amount: number;
    customerName?: string;
    description?: string;
    category?: 'RENT' | 'INVENTORY' | 'UTILITIES' | 'SALARIES' | 'TRANSPORT' | 'MARKETING' | 'OTHER';
    gstAmount?: number;
    paymentMethod: 'CASH' | 'UPI' | 'PENDING';
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
}

export interface DashboardStats {
    stats: {
        totalCreditGiven: number;
        totalPaymentReceived: number;
        totalExpenses: number;
        pendingAmount: number;
        transactionCount: number;
    };
    scoreBreakdown: {
        score: number;
        breakdown: {
            base: number;
            volume: number;
            consistency: number;
            health: number;
        };
        metrics: {
            totalVolume: number;
            activeDays: number;
            collectionRate: number;
        };
    };
}

export interface TransactionFormData {
    type: 'CREDIT_GIVEN' | 'PAYMENT_RECEIVED' | 'EXPENSE';
    amount: number;
    customerName?: string;
    description?: string;
    category?: 'RENT' | 'INVENTORY' | 'UTILITIES' | 'SALARIES' | 'TRANSPORT' | 'MARKETING' | 'OTHER';
    gstAmount?: number;
    paymentMethod: 'CASH' | 'UPI' | 'PENDING';
    date?: string;
}

export interface RegisterFormData {
    businessName: string;
    ownerName?: string;
    phone: string;
    password: string;
}

export interface LoginFormData {
    phone: string;
    password: string;
}
