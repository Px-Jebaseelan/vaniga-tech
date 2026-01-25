import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { keepServerAlive } from '../utils/serverWakeUp';
import type { User, LoginFormData, RegisterFormData } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginFormData) => Promise<void>;
    register: (data: RegisterFormData) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for stored user on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    // Try to fetch fresh user data
                    const response = await authService.getMe();
                    if (response.success && response.data) {
                        setUser(response.data.user);
                    }
                } else {
                    // Fallback to stored user
                    const storedUser = authService.getStoredUser();
                    if (storedUser) {
                        setUser(storedUser);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                // Clear invalid auth data
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Keep server alive when user is logged in
    useEffect(() => {
        if (user) {
            // Start keep-alive pings
            const cleanup = keepServerAlive();

            // Cleanup on logout or unmount
            return cleanup;
        }
    }, [user]);

    const login = async (data: LoginFormData) => {
        try {
            const response = await authService.login(data);
            if (response.success) {
                setUser(response.data.user);
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (data: RegisterFormData) => {
        try {
            const response = await authService.register(data);
            if (response.success) {
                setUser(response.data.user);
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('vanigatech_user', JSON.stringify(updatedUser));
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
