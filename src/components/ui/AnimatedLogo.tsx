
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
          'flex items-center justify-center bg-gradient-to-r from-meetease-blue to-meetease-cyan rounded-xl',
          sizes[size]
        )}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-2/3 h-2/3 text-white"
        >
          <path 
            d="M6 9.5V8C6 4.686 8.686 2 12 2C15.314 2 18 4.686 18 8V9.5M7 10.5V18.5M17 10.5V18.5M3 10.5H21V20C21 21.105 20.105 22 19 22H5C3.895 22 3 21.105 3 20V10.5Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedLogo;
