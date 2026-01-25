/**
 * Industry Benchmarks for VanigaScore
 * Based on typical credit score distributions
 */

export interface ScoreBenchmark {
    range: [number, number];
    label: string;
    color: string;
    description: string;
    percentile: number;
}

export interface BadgeLevel {
    name: string;
    minScore: number;
    icon: string;
    color: string;
    gradient: string;
}

export const SCORE_BENCHMARKS: ScoreBenchmark[] = [
    {
        range: [300, 450],
        label: 'Building',
        color: 'red',
        description: 'Just getting started. Keep recording transactions!',
        percentile: 15,
    },
    {
        range: [451, 550],
        label: 'Fair',
        color: 'orange',
        description: 'Making progress. Maintain consistency.',
        percentile: 35,
    },
    {
        range: [551, 650],
        label: 'Good',
        color: 'yellow',
        description: 'Good standing. Almost loan-eligible!',
        percentile: 60,
    },
    {
        range: [651, 750],
        label: 'Very Good',
        color: 'green',
        description: 'Excellent! You are loan-eligible.',
        percentile: 80,
    },
    {
        range: [751, 900],
        label: 'Exceptional',
        color: 'emerald',
        description: 'Outstanding! Top-tier creditworthiness.',
        percentile: 95,
    },
];

export const INDUSTRY_AVERAGE = 580;

export const ACHIEVEMENT_BADGES: BadgeLevel[] = [
    {
        name: 'Bronze',
        minScore: 300,
        icon: '🥉',
        color: 'orange',
        gradient: 'from-orange-400 to-amber-600',
    },
    {
        name: 'Silver',
        minScore: 500,
        icon: '🥈',
        color: 'gray',
        gradient: 'from-gray-400 to-slate-600',
    },
    {
        name: 'Gold',
        minScore: 650,
        icon: '🥇',
        color: 'yellow',
        gradient: 'from-yellow-400 to-amber-500',
    },
    {
        name: 'Platinum',
        minScore: 750,
        icon: '💎',
        color: 'cyan',
        gradient: 'from-cyan-400 to-blue-600',
    },
    {
        name: 'Diamond',
        minScore: 850,
        icon: '💠',
        color: 'purple',
        gradient: 'from-purple-400 to-indigo-600',
    },
];
