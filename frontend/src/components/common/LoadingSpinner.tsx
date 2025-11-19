import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'dots' | 'pulse';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'gradient',
  message,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-40 animate-pulse-slow"></div>
            <div className={`relative ${sizeClasses[size]} border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin`}></div>
          </div>
        );

      case 'dots':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );

      case 'pulse':
        return (
          <div className="relative inline-flex items-center justify-center">
            <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full animate-ping absolute opacity-75`}></div>
            <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full`}></div>
          </div>
        );

      default:
        return (
          <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
        );
    }
  };

  const content = (
    <div className="text-center animate-fade-in-up">
      {renderSpinner()}
      {message && (
        <p className="mt-4 text-base font-semibold gradient-text">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
