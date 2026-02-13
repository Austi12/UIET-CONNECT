import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 hover:scale-[1.02] active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'bg-transparent text-white hover:bg-white/10 border border-neutral-800 hover:border-neutral-700'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
