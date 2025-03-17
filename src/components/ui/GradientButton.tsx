
import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  to?: string;
}

const GradientButton = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading = false,
  disabled,
  to,
  ...props
}: GradientButtonProps) => {
  const navigate = useNavigate();
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
    secondary: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
    outline: 'bg-white border border-cyan-500 text-cyan-600 hover:bg-cyan-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-3.5 text-lg',
  };

  const isDisabled = disabled || isLoading;
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (to && !isDisabled) {
      e.preventDefault();
      navigate(to);
    }
    
    if (props.onClick && !isDisabled) {
      props.onClick(e);
    }
  };

  return (
    <button
      className={cn(
        'rounded-full font-medium transition-all duration-300 relative overflow-hidden',
        'hover:shadow-[0_6px_20px_rgba(6,182,212,0.25)] active:translate-y-[1px]',
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </span>
      <span className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-cyan-500/90 to-blue-500/90 transition-opacity duration-300" />
    </button>
  );
};

export default GradientButton;
