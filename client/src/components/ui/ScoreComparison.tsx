import React from 'react';
import { Trophy, TrendingUp, Users, Target } from 'lucide-react';
import {
    calculatePercentile,
    getScoreBenchmark,
    compareWithIndustry,
    getImprovementTips,
} from '../../utils/scoreUtils';
import { INDUSTRY_AVERAGE } from '../../data/industryBenchmarks';
import { Card } from './Card';

interface ScoreComparisonProps {
    score: number;
}

export const ScoreComparison: React.FC<ScoreComparisonProps> = ({ score }) => {
    const percentile = calculatePercentile(score);
    const benchmark = getScoreBenchmark(score);
    const industryComparison = compareWithIndustry(score);
    const tips = getImprovementTips(score);

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            red: 'bg-red-100 text-red-700 border-red-200',
            orange: 'bg-orange-100 text-orange-700 border-orange-200',
            yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            green: 'bg-green-100 text-green-700 border-green-200',
            emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
        return colors[color] || colors.green;
    };

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Score Comparison</h3>
                    <p className="text-sm text-slate-600">See how you rank</p>
                </div>
            </div>

            {/* Score Category */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Your Category</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getColorClasses(benchmark.color)}`}>
                        {benchmark.label}
                    </span>
                </div>
                <p className="text-sm text-slate-600">{benchmark.description}</p>
            </div>

            {/* Percentile Ranking */}
            <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-medium text-slate-700">Percentile Ranking</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">{percentile}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentile}%` }}
                    />
                </div>
                <p className="text-xs text-slate-600 mt-2">
                    You're in the top {100 - percentile}% of businesses
                </p>
            </div>

            {/* Industry Average Comparison */}
            <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">vs Industry Average</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">
                        {INDUSTRY_AVERAGE}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {industryComparison.status === 'above' ? (
                        <>
                            <div className="flex-1 bg-emerald-100 rounded-lg p-3">
                                <p className="text-sm font-semibold text-emerald-700">
                                    +{industryComparison.difference} points above average
                                </p>
                                <p className="text-xs text-emerald-600 mt-1">
                                    {industryComparison.percentage.toFixed(1)}% better than average
                                </p>
                            </div>
                        </>
                    ) : industryComparison.status === 'below' ? (
                        <>
                            <div className="flex-1 bg-orange-100 rounded-lg p-3">
                                <p className="text-sm font-semibold text-orange-700">
                                    {Math.abs(industryComparison.difference)} points below average
                                </p>
                                <p className="text-xs text-orange-600 mt-1">
                                    Room for {industryComparison.percentage.toFixed(1)}% improvement
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex-1 bg-blue-100 rounded-lg p-3">
                                <p className="text-sm font-semibold text-blue-700">
                                    Right at industry average
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Keep up the good work!
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Improvement Tips */}
            <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">How to Improve</span>
                </div>
                <ul className="space-y-2">
                    {tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};
