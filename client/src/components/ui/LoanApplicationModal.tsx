import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { loanService, type LoanFormData } from '../../services/loanService';

interface LoanApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    vanigaScore: number;
    loanEligible: boolean;
    onSuccess?: () => void;
}

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
    isOpen,
    onClose,
    vanigaScore,
    loanEligible,
    onSuccess,
}) => {
    const [formData, setFormData] = useState<LoanFormData>({
        amount: 50000,
        purpose: '',
        tenure: 12,
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await loanService.apply(formData);
            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                    setSuccess(false);
                }, 2000);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to submit loan application');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const maxLoanAmount = loanEligible ? Math.min(vanigaScore * 10000, 10000000) : 0;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
                            <p className="text-slate-600">
                                Your loan application has been submitted successfully. We'll review it and get back to you soon.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Apply for Loan</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Eligibility Status */}
                            <div className={`p-4 rounded-lg mb-6 ${loanEligible ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                                <div className="flex items-start gap-3">
                                    {loanEligible ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                    )}
                                    <div>
                                        <p className={`font-semibold ${loanEligible ? 'text-emerald-900' : 'text-amber-900'}`}>
                                            {loanEligible ? 'You are eligible for a loan!' : 'Build your score to get eligible'}
                                        </p>
                                        <p className={`text-sm ${loanEligible ? 'text-emerald-700' : 'text-amber-700'}`}>
                                            {loanEligible
                                                ? `Maximum loan amount: ₹${maxLoanAmount.toLocaleString('en-IN')}`
                                                : 'VanigaScore must be 650+ to apply for loans'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* VanigaScore Display */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-700">Your VanigaScore</span>
                                    <span className="text-2xl font-bold text-indigo-600">{vanigaScore}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Loan Amount (₹) *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                            required
                                            min="10000"
                                            max={maxLoanAmount}
                                            disabled={!loanEligible}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Min: ₹10,000 | Max: ₹{maxLoanAmount.toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Tenure (months) *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <select
                                            value={formData.tenure}
                                            onChange={(e) => setFormData({ ...formData, tenure: parseInt(e.target.value) })}
                                            required
                                            disabled={!loanEligible}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                                        >
                                            <option value="3">3 months</option>
                                            <option value="6">6 months</option>
                                            <option value="12">12 months</option>
                                            <option value="24">24 months</option>
                                            <option value="36">36 months</option>
                                            <option value="48">48 months</option>
                                            <option value="60">60 months</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Purpose *
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                        <textarea
                                            value={formData.purpose}
                                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                            required
                                            disabled={!loanEligible}
                                            rows={3}
                                            minLength={10}
                                            maxLength={500}
                                            placeholder="e.g., Inventory purchase, business expansion, equipment..."
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {formData.purpose.length}/500 characters
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={!loanEligible || submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Application'}
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
};
