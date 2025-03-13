
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoImageProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LogoImage = ({ className, size = 'md' }: LogoImageProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <img 
        src="/lovable-uploads/48aa5307-88d4-49d5-8ad7-814902452bb7.png" 
        alt="Logo" 
        className={cn(sizes[size], 'object-contain')}
      />
    </div>
  );
};
