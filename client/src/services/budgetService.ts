import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Budget {
    _id: string;
    userId: string;
    category: 'RENT' | 'INVENTORY' | 'UTILITIES' | 'SALARIES' | 'TRANSPORT' | 'MARKETING' | 'OTHER';
    monthlyLimit: number;
    currentSpent: number;
    month: string;
    alertThreshold: number;
    alertSent: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BudgetFormData {
    category: string;
    monthlyLimit: number;
    month?: string;
    alertThreshold?: number;
}

export interface ExpensePrediction {
    average: number;
    predicted: number;
    transactionCount: number;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

export interface PredictionsResponse {
    predictions: Record<string, ExpensePrediction>;
    totalPredicted: number;
    basedOnMonths: number;
    generatedAt: string;
}

class BudgetService {
    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    async getAll(month?: string) {
        const params = month ? { month } : {};
        const response = await axios.get(`${API_URL}/budgets`, {
            ...this.getAuthHeader(),
            params,
        });
        return response.data;
    }

    async create(data: BudgetFormData) {
        const response = await axios.post(`${API_URL}/budgets`, data, this.getAuthHeader());
        return response.data;
    }

    async update(id: string, data: Partial<BudgetFormData>) {
        const response = await axios.put(`${API_URL}/budgets/${id}`, data, this.getAuthHeader());
        return response.data;
    }

    async delete(id: string) {
        const response = await axios.delete(`${API_URL}/budgets/${id}`, this.getAuthHeader());
        return response.data;
    }

    async getPredictions() {
        const response = await axios.get(`${API_URL}/budgets/predictions`, this.getAuthHeader());
        return response.data;
    }

    async refreshBalances(id: string) {
        const response = await axios.post(`${API_URL}/budgets/${id}/refresh`, {}, this.getAuthHeader());
        return response.data;
    }
}

export const budgetService = new BudgetService();
