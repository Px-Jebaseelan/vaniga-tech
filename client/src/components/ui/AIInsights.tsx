import React, { useState } from 'react';
import { Sparkles, RefreshCw, Lightbulb, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { aiService, type AIInsight } from '../../services/aiService';
import { Card } from './Card';
import { Button } from './Button';

export const AIInsights: React.FC = () => {
    const [insights, setInsights] = useState<AIInsight | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [hasGenerated, setHasGenerated] = useState(false);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            setError('');
            setHasGenerated(true);
            const response = await aiService.getBusinessInsights();

            if (response.success && response.data) {
                setInsights(response.data);
            }
        } catch (err: any) {
            console.error('Failed to fetch AI insights:', err);
            setError(err.message || 'Failed to load insights');
        } finally {
            setLoading(false);
        }
    };

    const getInsightIcon = (index: number) => {
        const icons = [Lightbulb, TrendingUp, Sparkles, AlertCircle];
        const Icon = icons[index % icons.length];
        return Icon;
    };

    const getInsightColor = (index: number) => {
        const colors = [
            'from-blue-500 to-cyan-500',
            'from-green-500 to-emerald-500',
            'from-purple-500 to-pink-500',
            'from-orange-500 to-red-500',
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">AI Insights</h3>
                        <p className="text-sm text-slate-600">Powered by Google Gemini</p>
                    </div>
                </div>

                {/* Animated Loading State */}
                <div className="py-8 space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Sparkles className="w-6 h-6 text-indigo-600 animate-spin" />
                        <p className="text-indigo-600 font-medium animate-pulse">
                            Analyzing your business data...
                        </p>
                    </div>

                    {/* Skeleton loaders with animation */}
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-4 shadow-sm animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                                    <div className="h-3 bg-slate-200 rounded w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-gradient-to-br from-red-50 to-orange-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">AI Insights</h3>
                        <p className="text-sm text-slate-600">Unable to load insights</p>
                    </div>
                </div>
                <p className="text-sm text-slate-700 mb-4">{error}</p>
                <Button
                    onClick={fetchInsights}
                    variant="outline"
                    icon={<RefreshCw className="w-4 h-4" />}
                    size="sm"
                >
                    Try Again
                </Button>
            </Card>
        );
    }

    if (!hasGenerated) {
        return (
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">AI Insights</h3>
                        <p className="text-sm text-slate-600">Powered by Google Gemini</p>
                    </div>
                </div>

                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                        Get AI-Powered Business Insights
                    </h4>
                    <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
                        Let our AI analyze your transactions and provide personalized recommendations to grow your business.
                    </p>
                    <Button
                        onClick={fetchInsights}
                        icon={<Sparkles className="w-4 h-4" />}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                        Generate Insights
                    </Button>
                </div>
            </Card>
        );
    }

    if (!insights || insights.insights.length === 0) {
        return (
            <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">AI Insights</h3>
                        <p className="text-sm text-slate-600">No insights available yet</p>
                    </div>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                    Start recording transactions to get personalized AI insights!
                </p>
                <Button
                    onClick={fetchInsights}
                    variant="outline"
                    icon={<RefreshCw className="w-4 h-4" />}
                    size="sm"
                >
                    Try Again
                </Button>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">AI Insights</h3>
                        <p className="text-sm text-slate-600">Powered by Google Gemini</p>
                    </div>
                </div>
                <Button
                    onClick={fetchInsights}
                    variant="outline"
                    icon={<RefreshCw className="w-4 h-4" />}
                    size="sm"
                >
                    Refresh
                </Button>
            </div>

            <div className="space-y-4">
                {insights.insights.map((insight, index) => {
                    const Icon = getInsightIcon(index);
                    const gradientColor = getInsightColor(index);

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex gap-3">
                                <div className={`w-8 h-8 bg-gradient-to-br ${gradientColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed flex-1">
                                    {insight}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            {insights && (
                <p className="text-xs text-gray-500 text-center mt-4">
                    Last updated: {insights.generatedAt
                        ? new Date(insights.generatedAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })
                        : 'Just now'}
                </p>
            )}
        </Card>
    );
};
