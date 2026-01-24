import api from './api';

export interface Customer {
    _id: string;
    userId: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    totalCreditGiven: number;
    totalPaymentReceived: number;
    outstandingBalance: number;
    lastTransactionDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerFormData {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}

export const customerService = {
    // Get all customers
    getAll: async (params?: { search?: string; sortBy?: string; order?: string }) => {
        try {
            const response = await api.get('/customers', { params });
            return {
                success: true,
                data: response.data.data as Customer[],
                count: response.data.count,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch customers',
            };
        }
    },

    // Get single customer
    getById: async (id: string) => {
        try {
            const response = await api.get(`/customers/${id}`);
            return {
                success: true,
                data: response.data.data as Customer,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch customer',
            };
        }
    },

    // Create customer
    create: async (data: CustomerFormData) => {
        try {
            const response = await api.post('/customers', data);
            return {
                success: true,
                data: response.data.data as Customer,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create customer',
            };
        }
    },

    // Update customer
    update: async (id: string, data: Partial<CustomerFormData>) => {
        try {
            const response = await api.put(`/customers/${id}`, data);
            return {
                success: true,
                data: response.data.data as Customer,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update customer',
            };
        }
    },

    // Delete customer
    delete: async (id: string) => {
        try {
            await api.delete(`/customers/${id}`);
            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete customer',
            };
        }
    },

    // Refresh customer balances
    refreshBalances: async (id: string) => {
        try {
            const response = await api.post(`/customers/${id}/refresh`);
            return {
                success: true,
                data: response.data.data as Customer,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to refresh balances',
            };
        }
    },
};
