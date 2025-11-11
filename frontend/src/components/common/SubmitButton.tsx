import React from 'react';

interface SubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: 'submit' | 'button' | 'reset';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  loading, 
  disabled = false, 
  children,
  type = 'submit'
}) => {
  const isDisabled = loading || disabled;

  return (
    <div className="relative group">
      {/* Glow effect behind button */}
      {!isDisabled && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300 animate-pulse-slow"></div>
      )}
      
      <button
        type={type}
        disabled={isDisabled}
        className={`relative w-full py-5 px-8 rounded-2xl font-bold text-lg text-white shadow-2xl transform transition-all duration-300 overflow-hidden ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed opacity-60'
            : 'btn-gradient hover:scale-[1.02] hover:shadow-glow-lg active:scale-[0.98] animate-gradient'
        }`}
      >
        {/* Shimmer effect */}
        {!isDisabled && !loading && (
          <div className="absolute inset-0 bg-shimmer opacity-30 animate-shimmer pointer-events-none"></div>
        )}
        
        {loading ? (
          <span className="flex items-center justify-center">
            {/* Enhanced Loading Spinner */}
            <div className="relative w-6 h-6 mr-3">
              <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            </div>
            <span className="animate-pulse">Processing with AI...</span>
          </span>
        ) : (
          children || (
            <span className="flex items-center justify-center group">
              <span className="mr-2">Submit KYC Form</span>
              <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
