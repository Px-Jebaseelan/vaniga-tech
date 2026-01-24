import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Calendar, PieChart as PieChartIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { transactionService } from '../services/transactionService';
import type { Transaction } from '../types';
import { useTranslation } from 'react-i18next';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export const Analytics: React.FC = () => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getAll();
            if (response.success && response.data) {
                setTransactions(response.data.transactions);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Prepare data for transaction trends (last 7 days)
    const getTrendData = () => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        return last7Days.map((date) => {
            const dayTransactions = transactions.filter(
                (t) => new Date(t.date).toISOString().split('T')[0] === date
            );

            const credit = dayTransactions
                .filter((t) => t.type === 'CREDIT_GIVEN')
                .reduce((sum, t) => sum + t.amount, 0);

            const payment = dayTransactions
                .filter((t) => t.type === 'PAYMENT_RECEIVED')
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = dayTransactions
                .filter((t) => t.type === 'EXPENSE')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                credit,
                payment,
                expense,
            };
        });
    };

    // Prepare data for transaction type breakdown
    const getTypeBreakdown = () => {
        const creditGiven = transactions
            .filter((t) => t.type === 'CREDIT_GIVEN')
            .reduce((sum, t) => sum + t.amount, 0);

        const paymentReceived = transactions
            .filter((t) => t.type === 'PAYMENT_RECEIVED')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter((t) => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);

        return [
            { name: 'Credit Given', value: creditGiven, color: '#f59e0b' },
            { name: 'Payment Received', value: paymentReceived, color: '#10b981' },
            { name: 'Expenses', value: expenses, color: '#ef4444' },
        ].filter((item) => item.value > 0);
    };

    // Prepare monthly comparison data
    const getMonthlyData = () => {
        const months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (5 - i));
            return {
                month: date.toLocaleDateString('en-IN', { month: 'short' }),
                year: date.getFullYear(),
                monthIndex: date.getMonth(),
            };
        });

        return months.map(({ month, year, monthIndex }) => {
            const monthTransactions = transactions.filter((t) => {
                const txDate = new Date(t.date);
                return txDate.getMonth() === monthIndex && txDate.getFullYear() === year;
            });

            const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
            const count = monthTransactions.length;

            return { month, total, count };
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    const trendData = getTrendData();
    const typeBreakdown = getTypeBreakdown();
    const monthlyData = getMonthlyData();

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{t('analytics')}</h1>
                <p className="text-slate-600 mt-1">{t('detailedInsights')}</p>
            </div>

            {transactions.length === 0 ? (
                <Card>
                    <div className="text-center py-16">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Data Yet</h3>
                        <p className="text-slate-600 max-w-md mx-auto">
                            Start adding transactions to see detailed analytics and insights about your business.
                        </p>
                    </div>
                </Card>
            ) : (
                <>
                    {/* Transaction Trends - Last 7 Days */}
                    <Card>
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-bold text-slate-900">Transaction Trends (Last 7 Days)</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                    }}
                                    formatter={(value: number | undefined) => value !== undefined ? `₹${value.toLocaleString('en-IN')}` : '₹0'}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="credit"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    name="Credit Given"
                                    dot={{ fill: '#f59e0b' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="payment"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Payment Received"
                                    dot={{ fill: '#10b981' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    name="Expenses"
                                    dot={{ fill: '#ef4444' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Transaction Type Breakdown */}
                        <Card>
                            <div className="flex items-center gap-2 mb-6">
                                <PieChartIcon className="w-5 h-5 text-indigo-600" />
                                <h2 className="text-xl font-bold text-slate-900">Transaction Breakdown</h2>
                            </div>
                            {typeBreakdown.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={typeBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {typeBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? `₹${value.toLocaleString('en-IN')}` : '₹0'} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center py-8 text-slate-500">No transaction data</div>
                            )}
                        </Card>

                        {/* Monthly Comparison */}
                        <Card>
                            <div className="flex items-center gap-2 mb-6">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                <h2 className="text-xl font-bold text-slate-900">Monthly Comparison</h2>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        formatter={(value: number | undefined) => value !== undefined ? `₹${value.toLocaleString('en-IN')}` : '₹0'}
                                    />
                                    <Legend />
                                    <Bar dataKey="total" fill="#4f46e5" name="Total Amount" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                    {/* Summary Stats */}
                    <Card>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Summary Statistics</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-indigo-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">Total Transactions</p>
                                <p className="text-2xl font-bold text-indigo-600">{transactions.length}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">Avg Transaction</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    ₹
                                    {transactions.length > 0
                                        ? Math.round(
                                            transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
                                        ).toLocaleString('en-IN')
                                        : 0}
                                </p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">This Month</p>
                                <p className="text-2xl font-bold text-amber-600">
                                    {
                                        transactions.filter(
                                            (t) => new Date(t.date).getMonth() === new Date().getMonth()
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">This Week</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {
                                        transactions.filter((t) => {
                                            const txDate = new Date(t.date);
                                            const weekAgo = new Date();
                                            weekAgo.setDate(weekAgo.getDate() - 7);
                                            return txDate >= weekAgo;
                                        }).length
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};
