import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  pulse = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
    primary: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-300',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300',
    warning: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300',
    danger: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300',
    info: 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 border border-cyan-300',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-none shadow-md',
  };

  const pulseClasses = pulse ? 'animate-pulse-slow' : '';

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} ${variantClasses[variant]} ${pulseClasses} rounded-full font-semibold shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
