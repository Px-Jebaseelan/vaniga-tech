import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Receipt,
    BarChart3,
    User,
    Users,
    LogOut,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Receipt, label: 'Transactions', path: '/transactions' },
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Wallet, label: 'Budget', path: '/budget' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    const handleLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    return (
        <>
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-40"
            >
                {/* Logo/Brand */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">VanigaTech</h1>
                            <p className="text-xs text-slate-500">Credit Platform</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                {user && (
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold text-lg">
                                    {user.businessName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                    {user.businessName}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{user.phone}</p>
                            </div>
                        </div>
                        {/* VanigaScore Badge */}
                        <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-600">VanigaScore</span>
                                <span className="text-lg font-bold text-indigo-600">
                                    {user.vanigaScore}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={() => setShowLogoutModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirm Logout</h2>
                                <p className="text-slate-600 mb-6">
                                    Are you sure you want to logout? You'll need to login again to access your account.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
