import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98';

    const variantClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5',
        secondary: 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5',
        outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
};
