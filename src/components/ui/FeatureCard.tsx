
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  iconColor?: string;
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  className,
  iconColor = 'text-meetease-blue',
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        'premium-card p-6 transition-all duration-500 hover-scale',
        className
      )}
    >
      <div className={cn(
        'rounded-full w-12 h-12 flex items-center justify-center mb-4',
        'bg-meetease-blue/10', iconColor
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
