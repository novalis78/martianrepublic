import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
  fullPage?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md',
  color = 'primary',
  fullPage = false,
}: LoadingSpinnerProps) => {
  // Size class mapping
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  // Color class mapping
  const colorClasses = {
    primary: 'border-t-mars-red',
    white: 'border-t-white',
  };

  // Base spinner classes
  const spinnerClasses = `animate-spin rounded-full border-b-transparent ${sizeClasses[size]} ${colorClasses[color]}`;

  // If fullPage, center on screen with dark overlay
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
        <div className={spinnerClasses}></div>
      </div>
    );
  }

  // Otherwise, just return the spinner
  return <div className={spinnerClasses}></div>;
};

export default LoadingSpinner;