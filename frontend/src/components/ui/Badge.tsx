import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200';
  
  const variants = {
    default: 'bg-neutral-900 text-neutral-300 border-neutral-700',
    success: 'bg-green-950 text-green-400 border-green-800',
    warning: 'bg-yellow-950 text-yellow-400 border-yellow-800',
    danger: 'bg-red-950 text-red-400 border-red-800',
    info: 'bg-blue-950 text-blue-400 border-blue-800'
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
