
import React from 'react';
import { Flame } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  // Size mapping
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };
  
  return (
    <div className={`flex items-center gap-2 font-bold ${sizes[size]} ${className}`}>
      <Flame 
        size={iconSizes[size]} 
        className="text-orange-500" 
        fill="currentColor" 
      />
      <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
        Blaze.IU
      </span>
    </div>
  );
};

export default Logo;
