import api from './api';
import type {
    ApiResponse,
    Transaction,
    TransactionFormData,
    DashboardStats,
} from '../types';

/**
 * Transaction Service
 * Handles all transaction-related API calls
 */

export const transactionService = {
    /**
     * Create a new transaction
     */
    create: async (data: TransactionFormData): Promise<ApiResponse<{
        transaction: Transaction;
        updatedScore: number;
        loanEligible: boolean;
    }>> => {
        const response = await api.post<ApiResponse<{
            transaction: Transaction;
            updatedScore: number;
            loanEligible: boolean;
        }>>('/transactions', data);
        return response.data;
    },

    /**
     * Get all transactions with optional filters
     */
    getAll: async (params?: {
        startDate?: string;
        endDate?: string;
        type?: string;
        limit?: number;
    }): Promise<ApiResponse<{ transactions: Transaction[] }>> => {
        const response = await api.get<ApiResponse<{ transactions: Transaction[] }>>(
            '/transactions',
            { params }
        );
        return response.data;
    },

    /**
     * Get single transaction by ID
     */
    getById: async (id: string): Promise<ApiResponse<{ transaction: Transaction }>> => {
        const response = await api.get<ApiResponse<{ transaction: Transaction }>>(
            `/transactions/${id}`
        );
        return response.data;
    },

    /**
     * Update a transaction
     */
    update: async (
        id: string,
        data: Partial<TransactionFormData>
    ): Promise<ApiResponse<{
        transaction: Transaction;
        updatedScore: number;
    }>> => {
        const response = await api.put<ApiResponse<{
            transaction: Transaction;
            updatedScore: number;
        }>>(`/transactions/${id}`, data);
        return response.data;
    },

    /**
     * Delete a transaction
     */
    delete: async (id: string): Promise<ApiResponse<{ updatedScore: number }>> => {
        const response = await api.delete<ApiResponse<{ updatedScore: number }>>(
            `/transactions/${id}`
        );
        return response.data;
    },

    /**
     * Get dashboard statistics
     */
    getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
        const response = await api.get<ApiResponse<DashboardStats>>(
            '/transactions/stats/dashboard'
        );
        return response.data;
    },
};
