import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    Download,
    Share2,
    Plus,
    Users as UsersIcon,
    BarChart3,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { CreditSpeedometer } from '../components/ui/CreditSpeedometer';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { Button } from '../components/ui/Button';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { QuickActionCard } from '../components/ui/QuickActionCard';
import { AIInsights } from '../components/ui/AIInsights';
import { ScoreComparison } from '../components/ui/ScoreComparison';
import { AchievementBadges } from '../components/ui/AchievementBadges';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import { generateCreditReport } from '../utils/pdfGenerator';
import { shareCreditReport } from '../utils/whatsappShare';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { DashboardStats, Transaction } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsResponse, transactionsResponse] = await Promise.all([
                transactionService.getDashboardStats(),
                transactionService.getAll({ limit: 5 }),
            ]);

            if (statsResponse.success && statsResponse.data) {
                setStats(statsResponse.data);
            }

            if (transactionsResponse.success && transactionsResponse.data) {
                setRecentTransactions(transactionsResponse.data.transactions);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        if (!user) return;

        try {
            const response = await transactionService.getAll();
            const allTransactions = response.success && response.data ? response.data.transactions : [];
            generateCreditReport(user, allTransactions, stats);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handleShareWhatsApp = () => {
        if (!user) return;
        shareCreditReport(user, stats);
    };

    // Keyboard shortcuts
    useKeyboardShortcuts([
        { key: 't', ctrl: true, callback: () => navigate('/transactions') },
        { key: 'c', ctrl: true, callback: () => navigate('/customers') },
        { key: 'a', ctrl: true, callback: () => navigate('/analytics') },
        { key: 'd', ctrl: true, callback: handleDownloadReport },
    ]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {t('welcome')}, {user?.businessName}! 👋
                    </h1>
                    <p className="text-slate-600 mt-1">
                        {t('businessOverview')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <Button
                        onClick={handleShareWhatsApp}
                        variant="outline"
                        icon={<Share2 className="w-4 h-4" />}
                        className="hidden sm:flex"
                    >
                        WhatsApp
                    </Button>
                    <Button
                        onClick={handleDownloadReport}
                        icon={<Download className="w-4 h-4" />}
                        className="hidden md:flex"
                    >
                        {t('downloadReport')}
                    </Button>
                </div>
            </div>

            {/* Credit Score Section */}
            <Card className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
                {/* Speedometer - centered at top */}
                <div className="flex justify-center mb-8">
                    <CreditSpeedometer score={user?.vanigaScore || 300} size="md" />
                </div>

                {/* Heading and description */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Your Credit Score
                    </h2>
                    <p className="text-slate-600">
                        {user?.loanEligible
                            ? '🎉 Congratulations! You are eligible for loans.'
                            : 'Keep building your score to unlock loan eligibility.'}
                    </p>
                </div>

                {/* Score Breakdown Grid */}
                {stats?.scoreBreakdown && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                            <p className="text-sm text-slate-500 mb-1">Volume Score</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                +{stats.scoreBreakdown.breakdown.volume}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                            <p className="text-sm text-slate-500 mb-1">Consistency</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                +{stats.scoreBreakdown.breakdown.consistency}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                            <p className="text-sm text-slate-500 mb-1">Health Score</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                +{stats.scoreBreakdown.breakdown.health}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                            <p className="text-sm text-slate-500 mb-1">Active Days</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {stats.scoreBreakdown.metrics.activeDays}
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Score Comparison and Badges Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreComparison score={user?.vanigaScore || 300} />
                <AchievementBadges score={user?.vanigaScore || 300} />
            </div>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">{t('quickActions')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <QuickActionCard
                        icon={Plus}
                        title={t('addTransaction')}
                        description={t('recordNewTransaction')}
                        onClick={() => navigate('/transactions')}
                        color="indigo"
                        shortcut="Ctrl+T"
                    />
                    <QuickActionCard
                        icon={UsersIcon}
                        title={t('manageCustomers')}
                        description={t('viewAllCustomers')}
                        onClick={() => navigate('/customers')}
                        color="emerald"
                        shortcut="Ctrl+C"
                    />
                    <QuickActionCard
                        icon={BarChart3}
                        title={t('viewAnalytics')}
                        description={t('seeDetailedInsights')}
                        onClick={() => navigate('/analytics')}
                        color="blue"
                        shortcut="Ctrl+A"
                    />
                    <QuickActionCard
                        icon={Download}
                        title={t('downloadReport')}
                        description={t('getPDFReport')}
                        onClick={handleDownloadReport}
                        color="amber"
                        shortcut="Ctrl+D"
                    />
                </div>
            </Card>

            {/* AI Insights */}
            <AIInsights />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: t('totalCreditGiven'), value: `₹${stats?.stats.totalCreditGiven.toLocaleString('en-IN') || 0}`, icon: TrendingDown, color: 'bg-amber-100 text-amber-600' },
                    { label: t('paymentReceived'), value: `₹${stats?.stats.totalPaymentReceived.toLocaleString('en-IN') || 0}`, icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
                    { label: t('pendingAmount'), value: `₹${stats?.stats.pendingAmount.toLocaleString('en-IN') || 0}`, icon: Clock, color: 'bg-blue-100 text-blue-600' },
                    { label: t('totalExpenses'), value: `₹${stats?.stats.totalExpenses.toLocaleString('en-IN') || 0}`, icon: DollarSign, color: 'bg-red-100 text-red-600' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                    >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Transactions */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                        View All →
                    </button>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No transactions yet. Start adding your daily sales!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentTransactions.map((txn) => (
                            <div
                                key={txn._id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'PAYMENT_RECEIVED'
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : txn.type === 'CREDIT_GIVEN'
                                                ? 'bg-amber-100 text-amber-600'
                                                : 'bg-red-100 text-red-600'
                                            }`}
                                    >
                                        {txn.type === 'PAYMENT_RECEIVED' ? (
                                            <TrendingUp className="w-5 h-5" />
                                        ) : txn.type === 'CREDIT_GIVEN' ? (
                                            <TrendingDown className="w-5 h-5" />
                                        ) : (
                                            <DollarSign className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {txn.customerName || txn.type.replace('_', ' ')}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {new Date(txn.date).toLocaleDateString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-slate-900">
                                        ₹{txn.amount.toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-xs text-slate-500">{txn.paymentMethod}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* FAB for mobile */}
            <FloatingActionButton onClick={() => navigate('/transactions?add=true')} />
        </div>
    );
};
