import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick: () => void;
    color?: string;
    shortcut?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
    icon: Icon,
    title,
    description,
    onClick,
    color = 'indigo',
    shortcut,
}) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
        amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative p-4 rounded-xl ${colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo} transition-all duration-200 text-left w-full`}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-0.5">{title}</h3>
                    <p className="text-xs opacity-80">{description}</p>
                </div>
            </div>
            {shortcut && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/50 rounded text-xs font-mono">
                    {shortcut}
                </div>
            )}
        </motion.button>
    );
};
