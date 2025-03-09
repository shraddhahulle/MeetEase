
import React from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const GradientButton = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: GradientButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-meetease-blue to-meetease-indigo text-white',
    secondary: 'bg-gradient-to-r from-meetease-purple to-meetease-pink text-white',
    outline: 'bg-white border border-meetease-blue text-meetease-blue hover:bg-meetease-blue/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={cn(
        'rounded-full font-medium transition-all duration-300 relative overflow-hidden',
        'hover:shadow-[0_6px_20px_rgba(10,132,255,0.25)] active:translate-y-[1px]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-meetease-blue/90 to-meetease-indigo/90 transition-opacity duration-300" />
    </button>
  );
};

export default GradientButton;
