
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  iconColor?: string;
  onClick?: () => void;
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  className,
  iconColor = 'text-cyan-500',
  onClick
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        'premium-card p-6 transition-all duration-500 hover-scale cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        'rounded-full w-12 h-12 flex items-center justify-center mb-4',
        'bg-cyan-500/10', iconColor
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
