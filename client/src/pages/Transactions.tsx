import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import type { Transaction, TransactionFormData } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Transactions: React.FC = () => {
    const { updateUser, user } = useAuth();
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<TransactionFormData>({
        type: 'CREDIT_GIVEN',
        amount: 0,
        customerName: '',
        description: '',
        paymentMethod: 'CASH',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTransactions();

        // Check if add=true in URL
        if (searchParams.get('add') === 'true') {
            setShowModal(true);
            setSearchParams({}); // Clear the param
        }
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getAll({ limit: 100 });
            if (response.success && response.data) {
                setTransactions(response.data.transactions);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await transactionService.create(formData);

            if (response.success && response.data) {
                // Update user's score in context
                if (user) {
                    updateUser({
                        ...user,
                        vanigaScore: response.data.updatedScore,
                        loanEligible: response.data.loanEligible,
                    });
                }

                // Refresh transactions
                await fetchTransactions();

                // Reset form and close modal
                setFormData({
                    type: 'CREDIT_GIVEN',
                    amount: 0,
                    customerName: '',
                    description: '',
                    paymentMethod: 'CASH',
                });
                setShowModal(false);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create transaction');
        } finally {
            setSubmitting(false);
        }
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'PAYMENT_RECEIVED':
                return <TrendingUp className="w-5 h-5" />;
            case 'CREDIT_GIVEN':
                return <TrendingDown className="w-5 h-5" />;
            default:
                return <DollarSign className="w-5 h-5" />;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'PAYMENT_RECEIVED':
                return 'bg-emerald-100 text-emerald-600';
            case 'CREDIT_GIVEN':
                return 'bg-amber-100 text-amber-600';
            default:
                return 'bg-red-100 text-red-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('transactions')}</h1>
                    <p className="text-slate-600 mt-1">{t('manageDailyTransactions')}</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setShowModal(true)}
                    className="hidden md:flex"
                >
                    {t('addTransaction')}
                </Button>
            </div>

            {/* Transactions List */}
            {transactions.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Transactions Yet</h3>
                        <p className="text-slate-600 mb-6">Start adding your daily sales and expenses to build your credit score</p>
                        <Button
                            variant="primary"
                            icon={<Plus className="w-5 h-5" />}
                            onClick={() => setShowModal(true)}
                        >
                            Add Your First Transaction
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {transactions.map((txn, index) => (
                        <motion.div
                            key={txn._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card hover>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTransactionColor(txn.type)}`}>
                                            {getTransactionIcon(txn.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {txn.customerName || txn.type.replace(/_/g, ' ')}
                                            </h3>
                                            <p className="text-sm text-slate-500">{txn.description}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-slate-400">
                                                    {new Date(txn.date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                                                    {txn.paymentMethod}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900">
                                            ₹{txn.amount.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {txn.type.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Transaction Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={() => setShowModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Add Transaction</h2>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Transaction Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Transaction Type *
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { value: 'CREDIT_GIVEN', label: 'Credit Given' },
                                                    { value: 'PAYMENT_RECEIVED', label: 'Payment' },
                                                    { value: 'EXPENSE', label: 'Expense' },
                                                ].map((type) => (
                                                    <button
                                                        key={type.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, type: type.value as any })}
                                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${formData.type === type.value
                                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <Input
                                            label="Amount *"
                                            type="number"
                                            placeholder="0"
                                            value={formData.amount || ''}
                                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                            required
                                            min={0}
                                        />

                                        <Input
                                            label="Customer Name"
                                            type="text"
                                            placeholder="Optional"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        />

                                        <Input
                                            label="Description"
                                            type="text"
                                            placeholder="Optional notes"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />

                                        {/* Category (for expenses) */}
                                        {formData.type === 'EXPENSE' && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Expense Category
                                                </label>
                                                <select
                                                    value={formData.category || 'OTHER'}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value="RENT">Rent</option>
                                                    <option value="INVENTORY">Inventory</option>
                                                    <option value="UTILITIES">Utilities</option>
                                                    <option value="SALARIES">Salaries</option>
                                                    <option value="TRANSPORT">Transport</option>
                                                    <option value="MARKETING">Marketing</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* GST Amount (optional) */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                GST Amount (Optional)
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={formData.gstAmount || ''}
                                                onChange={(e) => setFormData({ ...formData, gstAmount: parseFloat(e.target.value) || 0 })}
                                                min={0}
                                            />
                                            <p className="text-xs text-slate-500 mt-1">
                                                Enter GST amount if applicable (usually 18% of base amount)
                                            </p>
                                        </div>

                                        {/* Payment Method */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Payment Method *
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['CASH', 'UPI', 'PENDING'].map((method) => (
                                                    <button
                                                        key={method}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, paymentMethod: method as any })}
                                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${formData.paymentMethod === method
                                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        {method}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="flex-1"
                                                loading={submitting}
                                            >
                                                Add Transaction
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* FAB for mobile */}
            <FloatingActionButton onClick={() => setShowModal(true)} />
        </div>
    );
};
