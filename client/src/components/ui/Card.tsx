import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    onClick,
}) => {
    const Component = hover || onClick ? motion.div : 'div';

    return (
        <Component
            className={`
        bg-white rounded-xl shadow-md p-6
        ${hover ? 'cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1' : ''}
        ${className}
      `}
            onClick={onClick}
            {...(hover && {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
            })}
        >
            {children}
        </Component>
    );
};
