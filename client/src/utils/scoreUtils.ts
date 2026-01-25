import { SCORE_BENCHMARKS, ACHIEVEMENT_BADGES, INDUSTRY_AVERAGE } from '../data/industryBenchmarks';
import type { ScoreBenchmark, BadgeLevel } from '../data/industryBenchmarks';

/**
 * Get the benchmark category for a given score
 */
export const getScoreBenchmark = (score: number): ScoreBenchmark => {
    return (
        SCORE_BENCHMARKS.find(
            (benchmark) => score >= benchmark.range[0] && score <= benchmark.range[1]
        ) || SCORE_BENCHMARKS[0]
    );
};

/**
 * Calculate percentile ranking
 * Returns the percentage of users with a lower score
 */
export const calculatePercentile = (score: number): number => {
    const benchmark = getScoreBenchmark(score);

    // Interpolate within the range
    const [min, max] = benchmark.range;
    const rangePosition = (score - min) / (max - min);

    // Get percentile range for this benchmark
    const currentIndex = SCORE_BENCHMARKS.indexOf(benchmark);
    const prevPercentile = currentIndex > 0 ? SCORE_BENCHMARKS[currentIndex - 1].percentile : 0;
    const currentPercentile = benchmark.percentile;

    // Interpolate percentile
    return Math.round(prevPercentile + rangePosition * (currentPercentile - prevPercentile));
};

/**
 * Get the current achievement badge
 */
export const getCurrentBadge = (score: number): BadgeLevel => {
    // Find the highest badge the user has earned
    const earnedBadges = ACHIEVEMENT_BADGES.filter((badge) => score >= badge.minScore);
    return earnedBadges[earnedBadges.length - 1] || ACHIEVEMENT_BADGES[0];
};

/**
 * Get the next badge to unlock
 */
export const getNextBadge = (score: number): BadgeLevel | null => {
    const nextBadge = ACHIEVEMENT_BADGES.find((badge) => score < badge.minScore);
    return nextBadge || null;
};

/**
 * Calculate progress to next badge (0-100)
 */
export const getProgressToNextBadge = (score: number): number => {
    const currentBadge = getCurrentBadge(score);
    const nextBadge = getNextBadge(score);

    if (!nextBadge) return 100; // Already at max badge

    const progress = ((score - currentBadge.minScore) / (nextBadge.minScore - currentBadge.minScore)) * 100;
    return Math.min(100, Math.max(0, progress));
};

/**
 * Get improvement tips based on score
 */
export const getImprovementTips = (score: number): string[] => {
    if (score < 450) {
        return [
            'Record transactions daily to build consistency',
            'Track both credit given and payments received',
            'Maintain accurate expense records',
        ];
    } else if (score < 550) {
        return [
            'Improve your payment collection rate',
            'Increase transaction volume gradually',
            'Keep your outstanding balance low',
        ];
    } else if (score < 650) {
        return [
            'Maintain consistent transaction activity',
            'Focus on timely payment collection',
            'You\'re close to loan eligibility - keep going!',
        ];
    } else if (score < 750) {
        return [
            'Excellent work! Maintain your current practices',
            'Consider applying for business loans',
            'Keep your collection rate above 80%',
        ];
    } else {
        return [
            'Outstanding! You\'re in the top tier',
            'Share your success story with other businesses',
            'Explore premium loan options',
        ];
    }
};

/**
 * Compare score with industry average
 */
export const compareWithIndustry = (score: number): {
    difference: number;
    percentage: number;
    status: 'above' | 'below' | 'average';
} => {
    const difference = score - INDUSTRY_AVERAGE;
    const percentage = Math.abs((difference / INDUSTRY_AVERAGE) * 100);

    let status: 'above' | 'below' | 'average' = 'average';
    if (difference > 20) status = 'above';
    else if (difference < -20) status = 'below';

    return { difference, percentage, status };
};
