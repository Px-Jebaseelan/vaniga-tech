import api from './api';
import type { ApiResponse } from '../types';

export interface AIInsight {
    insights: string[];
    generatedAt: Date;
}

export interface CreditRecommendation {
    recommendedCreditLimit: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    reasoning: string;
    currentOutstanding: number;
}

/**
 * AI Service
 * Handles AI-powered insights and recommendations using Gemini API
 */
export const aiService = {
    /**
     * Get AI-powered business insights
     */
    getBusinessInsights: async (): Promise<ApiResponse<AIInsight>> => {
        const response = await api.get<ApiResponse<AIInsight>>('/ai/insights');
        return response.data;
    },

    /**
     * Get AI credit recommendation for a customer
     */
    getCreditRecommendation: async (customerId: string): Promise<ApiResponse<CreditRecommendation>> => {
        const response = await api.get<ApiResponse<CreditRecommendation>>(
            `/ai/credit-recommendation/${customerId}`
        );
        return response.data;
    },
};
