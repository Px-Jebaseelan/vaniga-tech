import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import {
    getCurrentBadge,
    getNextBadge,
    getProgressToNextBadge,
} from '../../utils/scoreUtils';
import { ACHIEVEMENT_BADGES } from '../../data/industryBenchmarks';
import { Card } from './Card';

interface AchievementBadgesProps {
    score: number;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ score }) => {
    const currentBadge = getCurrentBadge(score);
    const nextBadge = getNextBadge(score);
    const progress = getProgressToNextBadge(score);

    return (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Achievement Badges</h3>
                    <p className="text-sm text-slate-600">Unlock rewards as you grow</p>
                </div>
            </div>

            {/* Current Badge */}
            <div className="bg-white rounded-xl p-6 mb-6 text-center">
                <div className="text-6xl mb-3 animate-bounce">{currentBadge.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">{currentBadge.name} Badge</h4>
                <p className="text-sm text-slate-600">Your current achievement level</p>
            </div>

            {/* Progress to Next Badge */}
            {nextBadge && (
                <div className="bg-white rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Next Badge</p>
                            <p className="text-lg font-bold text-purple-600 flex items-center gap-2">
                                <span>{nextBadge.icon}</span>
                                {nextBadge.name}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-600">Need</p>
                            <p className="text-lg font-bold text-slate-900">{nextBadge.minScore}</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${nextBadge.gradient} rounded-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-600 mt-2 text-center">
                        {progress.toFixed(0)}% progress • {nextBadge.minScore - score} points to go
                    </p>
                </div>
            )}

            {/* All Badges */}
            <div className="bg-white rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-4">All Achievements</p>
                <div className="grid grid-cols-5 gap-3">
                    {ACHIEVEMENT_BADGES.map((badge) => {
                        const isUnlocked = score >= badge.minScore;
                        const isCurrent = badge.name === currentBadge.name;

                        return (
                            <div
                                key={badge.name}
                                className={`relative flex flex-col items-center p-3 rounded-lg transition-all ${isUnlocked
                                        ? 'bg-gradient-to-br ' + badge.gradient + ' shadow-lg'
                                        : 'bg-slate-100'
                                    } ${isCurrent ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                            >
                                {!isUnlocked && (
                                    <div className="absolute inset-0 bg-slate-900/20 rounded-lg flex items-center justify-center">
                                        <Lock className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div className={`text-3xl mb-1 ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>
                                    {badge.icon}
                                </div>
                                <p className={`text-xs font-semibold text-center ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                    {badge.name}
                                </p>
                                <p className={`text-xs text-center ${isUnlocked ? 'text-white/80' : 'text-slate-400'}`}>
                                    {badge.minScore}+
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {!nextBadge && (
                <div className="mt-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4 text-center">
                    <p className="text-lg font-bold text-amber-900 mb-1">🎉 All Badges Unlocked!</p>
                    <p className="text-sm text-amber-700">You've achieved the highest level!</p>
                </div>
            )}
        </Card>
    );
};
