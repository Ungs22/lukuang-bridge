import React from 'react';
import clsx from 'clsx';

export const Card = ({ children, className }) => (
    <div className={clsx("bg-white rounded-lg shadow-sm border border-slate-200 p-5", className)}>
        {children}
    </div>
);

export const Badge = ({ children, className, variant = 'default' }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-orange-100 text-orange-700',
        danger: 'bg-red-100 text-red-700',
        primary: 'bg-blue-100 text-blue-700'
    };
    return (
        <span className={clsx("px-2 py-0.5 rounded text-xs font-medium", variants[variant] || variants.default, className)}>
            {children}
        </span>
    );
};
