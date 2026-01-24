import api from './api';
import type {
    AuthResponse,
    RegisterFormData,
    LoginFormData,
    ApiResponse,
    User,
} from '../types';

/**
 * Authentication Service
 * Handles user registration, login, and profile management
 */

export const authService = {
    /**
     * Register a new user
     */
    register: async (data: RegisterFormData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);

        // Store token and user in localStorage
        if (response.data.success) {
            localStorage.setItem('vanigatech_token', response.data.data.token);
            localStorage.setItem('vanigatech_user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    },

    /**
     * Login existing user
     */
    login: async (data: LoginFormData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);

        // Store token and user in localStorage
        if (response.data.success) {
            localStorage.setItem('vanigatech_token', response.data.data.token);
            localStorage.setItem('vanigatech_user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    },

    /**
     * Get current user profile
     */
    getMe: async (): Promise<ApiResponse<{ user: User }>> => {
        const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');

        // Update user in localStorage
        if (response.data.success && response.data.data) {
            localStorage.setItem('vanigatech_user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
        const response = await api.put<ApiResponse<{ user: User }>>('/auth/update-profile', data);

        // Update user in localStorage
        if (response.data.success && response.data.data) {
            localStorage.setItem('vanigatech_user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('vanigatech_token');
        localStorage.removeItem('vanigatech_user');
        window.location.href = '/login';
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('vanigatech_token');
    },

    /**
     * Get stored user from localStorage
     */
    getStoredUser: (): User | null => {
        const userStr = localStorage.getItem('vanigatech_user');
        return userStr ? JSON.parse(userStr) : null;
    },
};
