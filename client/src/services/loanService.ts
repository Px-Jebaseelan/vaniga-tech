import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoanApplication {
    _id: string;
    userId: string;
    amount: number;
    purpose: string;
    tenure: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    vanigaScoreAtApplication: number;
    createdAt: string;
    updatedAt: string;
}

export interface LoanFormData {
    amount: number;
    purpose: string;
    tenure: number;
}

class LoanService {
    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    async apply(data: LoanFormData) {
        const response = await axios.post(`${API_URL}/loans/apply`, data, this.getAuthHeader());
        return response.data;
    }

    async getMyApplications() {
        const response = await axios.get(`${API_URL}/loans/my-applications`, this.getAuthHeader());
        return response.data;
    }

    async getApplicationById(id: string) {
        const response = await axios.get(`${API_URL}/loans/${id}`, this.getAuthHeader());
        return response.data;
    }
}

export const loanService = new LoanService();
