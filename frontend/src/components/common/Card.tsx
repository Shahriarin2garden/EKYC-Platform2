import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'gradient' | 'bordered';
  hover?: boolean;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  hover = true,
  glow = false,
}) => {
  const baseClasses = 'rounded-3xl p-6 transition-all duration-300';
  
  const variantClasses = {
    glass: 'glass border shadow-soft backdrop-blur-xl',
    solid: 'bg-white border border-gray-200 shadow-soft',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200/50 shadow-lg',
    bordered: 'bg-white border-2 border-gray-300 shadow-md',
  };

  const hoverClasses = hover 
    ? 'hover:shadow-elevation-3 hover:scale-[1.01] hover:-translate-y-1 cursor-pointer' 
    : '';

  const glowClasses = glow 
    ? 'hover:shadow-glow-lg' 
    : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${glowClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
