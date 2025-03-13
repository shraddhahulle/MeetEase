
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedLogo = ({ className, size = 'md' }: AnimatedLogoProps) => {
  const logoRef = useRef<HTMLDivElement>(null);
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  useEffect(() => {
    const createRipple = () => {
      if (!logoRef.current) return;
      
      const ripple = document.createElement('div');
      ripple.classList.add('logo-animation');
      
      const size = logoRef.current.offsetWidth;
      
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      
      logoRef.current.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 1500);
    };
    
    const interval = setInterval(createRipple, 2000);
    createRipple(); // Initial ripple
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('logo-animation-container', className)}>
      <div 
        ref={logoRef} 
        className={cn(
          'flex items-center justify-center',
          sizes[size]
        )}
      >
        <img 
          src="/lovable-uploads/48aa5307-88d4-49d5-8ad7-814902452bb7.png" 
          alt="Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default AnimatedLogo;
