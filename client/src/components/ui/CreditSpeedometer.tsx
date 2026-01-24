import React from 'react';
import { motion } from 'framer-motion';

interface CreditSpeedometerProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
}

export const CreditSpeedometer: React.FC<CreditSpeedometerProps> = ({
    score,
    size = 'md',
}) => {
    // Calculate percentage (300-900 range)
    // Show at least 5% arc even at minimum score of 300
    const percentage = Math.max(5, ((score - 300) / 600) * 100);

    // Determine color based on score
    const getColor = () => {
        if (score >= 750) return '#10b981'; // Emerald (Excellent)
        if (score >= 650) return '#3b82f6'; // Blue (Good)
        if (score >= 550) return '#f59e0b'; // Amber (Fair)
        return '#ef4444'; // Red (Poor)
    };

    // Determine rating text
    const getRating = () => {
        if (score >= 750) return 'Excellent';
        if (score >= 650) return 'Good';
        if (score >= 550) return 'Fair';
        return 'Building';
    };

    const sizes = {
        sm: { width: 200, strokeWidth: 12 },
        md: { width: 280, strokeWidth: 16 },
        lg: { width: 350, strokeWidth: 20 },
    };

    const { width, strokeWidth } = sizes[size];
    const radius = (width - strokeWidth * 2) / 2;
    const centerY = width / 2;
    const circumference = Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width, height: width / 2 + 60 }}>
                {/* Background Arc */}
                <svg
                    width={width}
                    height={width / 2 + 40}
                    viewBox={`0 0 ${width} ${width / 2 + 40}`}
                    className="overflow-visible"
                >
                    {/* Background arc (gray) */}
                    <path
                        d={`M ${strokeWidth} ${centerY} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${centerY}`}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Animated Score Arc */}
                    <motion.path
                        d={`M ${strokeWidth} ${centerY} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${centerY}`}
                        fill="none"
                        stroke={getColor()}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                </svg>

                {/* Score Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '40%' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="text-5xl font-bold" style={{ color: getColor() }}>
                            {score}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">VanigaScore™</div>
                    </motion.div>
                </div>
            </div>

            {/* Rating Badge */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-4 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                    backgroundColor: `${getColor()}20`,
                    color: getColor(),
                }}
            >
                {getRating()}
            </motion.div>

            {/* Score Range Indicator */}
            <div className="mt-6 w-full max-w-xs">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>300</span>
                    <span>550</span>
                    <span>650</span>
                    <span>750</span>
                    <span>900</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-red-500 via-amber-500 via-blue-500 to-emerald-500 rounded-full" />
            </div>
        </div>
    );
};
