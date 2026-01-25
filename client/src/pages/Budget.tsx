import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    Plus,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Edit,
    Trash2,
    X,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { budgetService, type Budget, type BudgetFormData } from '../services/budgetService';

const CATEGORIES = [
    { value: 'RENT', label: 'Rent', icon: '🏠', color: 'from-blue-500 to-blue-600' },
    { value: 'INVENTORY', label: 'Inventory', icon: '📦', color: 'from-purple-500 to-purple-600' },
    { value: 'UTILITIES', label: 'Utilities', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
    { value: 'SALARIES', label: 'Salaries', icon: '👥', color: 'from-green-500 to-green-600' },
    { value: 'TRANSPORT', label: 'Transport', icon: '🚗', color: 'from-red-500 to-red-600' },
    { value: 'MARKETING', label: 'Marketing', icon: '📢', color: 'from-pink-500 to-pink-600' },
    { value: 'OTHER', label: 'Other', icon: '📋', color: 'from-gray-500 to-gray-600' },
];

export const BudgetPage: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [formData, setFormData] = useState<BudgetFormData>({
        category: '',
        monthlyLimit: 0,
        alertThreshold: 80,
    });
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

    useEffect(() => {
        fetchBudgets();
    }, [currentMonth]);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const response = await budgetService.getAll(currentMonth);
            if (response.success) {
                setBudgets(response.data);
            }
        } catch (error) {
            console.error('Error fetching budgets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBudget) {
                await budgetService.update(editingBudget._id, formData);
            } else {
                await budgetService.create({ ...formData, month: currentMonth });
            }
            await fetchBudgets();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this budget?')) return;
        try {
            await budgetService.delete(id);
            await fetchBudgets();
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const handleOpenModal = (budget?: Budget) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({
                category: budget.category,
                monthlyLimit: budget.monthlyLimit,
                alertThreshold: budget.alertThreshold,
            });
        } else {
            setEditingBudget(null);
            setFormData({ category: '', monthlyLimit: 0, alertThreshold: 80 });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBudget(null);
        setFormData({ category: '', monthlyLimit: 0, alertThreshold: 80 });
    };

    const getUtilizationPercentage = (budget: Budget) => {
        return (budget.currentSpent / budget.monthlyLimit) * 100;
    };

    const getProgressColor = (percentage: number, threshold: number) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= threshold) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.currentSpent, 0);
    const totalRemaining = totalBudget - totalSpent;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Budget Management</h1>
                        <p className="text-slate-600 mt-1">Track and manage your monthly expenses</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
                        Add Budget
                    </Button>
                </div>

                {/* Month Selector */}
                <Card>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-slate-700">Month:</label>
                        <input
                            type="month"
                            value={currentMonth}
                            onChange={(e) => setCurrentMonth(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Budget</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    ₹{totalBudget.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <Wallet className="w-8 h-8 text-indigo-600" />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Spent</p>
                                <p className="text-2xl font-bold text-amber-600">
                                    ₹{totalSpent.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-amber-600" />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Remaining</p>
                                <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    ₹{totalRemaining.toLocaleString('en-IN')}
                                </p>
                            </div>
                            {totalRemaining >= 0 ? (
                                <TrendingDown className="w-8 h-8 text-emerald-600" />
                            ) : (
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            )}
                        </div>
                    </Card>
                </div>

                {/* Budget Categories */}
                {budgets.length === 0 ? (
                    <Card>
                        <div className="text-center py-16">
                            <Wallet className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Budgets Set</h3>
                            <p className="text-slate-600 mb-4">
                                Start managing your expenses by setting budgets for different categories.
                            </p>
                            <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
                                Create Your First Budget
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {budgets.map((budget) => {
                            const category = CATEGORIES.find((c) => c.value === budget.category);
                            const percentage = getUtilizationPercentage(budget);
                            const isOverBudget = percentage >= 100;
                            const isNearLimit = percentage >= budget.alertThreshold;

                            return (
                                <motion.div
                                    key={budget._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card hover>
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-12 h-12 bg-gradient-to-br ${category?.color} rounded-lg flex items-center justify-center text-2xl`}
                                                    >
                                                        {category?.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900">
                                                            {category?.label}
                                                        </h3>
                                                        <p className="text-sm text-slate-600">
                                                            ₹{budget.currentSpent.toLocaleString('en-IN')} / ₹
                                                            {budget.monthlyLimit.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleOpenModal(budget)}
                                                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4 text-slate-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(budget._id)}
                                                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {percentage.toFixed(1)}% used
                                                    </span>
                                                    {isOverBudget && (
                                                        <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            Over budget!
                                                        </span>
                                                    )}
                                                    {!isOverBudget && isNearLimit && (
                                                        <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            Near limit
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full transition-all ${getProgressColor(
                                                            percentage,
                                                            budget.alertThreshold
                                                        )}`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Remaining */}
                                            <div className="pt-3 border-t border-slate-200">
                                                <p className="text-sm text-slate-600">Remaining</p>
                                                <p
                                                    className={`text-xl font-bold ${budget.monthlyLimit - budget.currentSpent >= 0
                                                        ? 'text-emerald-600'
                                                        : 'text-red-600'
                                                        }`}
                                                >
                                                    ₹
                                                    {(budget.monthlyLimit - budget.currentSpent).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add/Edit Budget Modal */}
            {showModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={handleCloseModal}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {editingBudget ? 'Edit Budget' : 'Add Budget'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                        disabled={!!editingBudget}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                                    >
                                        <option value="">Select category</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.icon} {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Input
                                    label="Monthly Limit (₹) *"
                                    type="number"
                                    value={formData.monthlyLimit}
                                    onChange={(e) =>
                                        setFormData({ ...formData, monthlyLimit: parseFloat(e.target.value) })
                                    }
                                    required
                                    min="0"
                                />

                                <Input
                                    label="Alert Threshold (%) *"
                                    type="number"
                                    value={formData.alertThreshold}
                                    onChange={(e) =>
                                        setFormData({ ...formData, alertThreshold: parseFloat(e.target.value) })
                                    }
                                    required
                                    min="0"
                                    max="100"
                                />

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        {editingBudget ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
};
