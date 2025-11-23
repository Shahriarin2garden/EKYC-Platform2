import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-500',
      progress: 'bg-green-500',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-500',
      progress: 'bg-red-500',
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      text: 'text-red-800',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      border: 'border-yellow-500',
      progress: 'bg-yellow-500',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      text: 'text-yellow-800',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      border: 'border-blue-500',
      progress: 'bg-blue-500',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      text: 'text-blue-800',
    },
  };

  const styles = typeStyles[type];

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in-right`}>
      <div className={`${styles.bg} ${styles.border} border-l-4 rounded-xl shadow-elevation-3 p-4 max-w-md backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="flex-1">
            <p className={`${styles.text} font-semibold text-sm leading-relaxed`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 hover:opacity-70 transition-opacity"
          >
            <svg className={`w-5 h-5 ${styles.text}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${styles.progress}`}
            style={{
              animation: `toast-progress ${duration}ms linear`,
            }}
          ></div>
        </div>
      </div>
      <style>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
