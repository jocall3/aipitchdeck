
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  let spinnerSizeClass = 'h-16 w-16';
  if (size === 'small') spinnerSizeClass = 'h-5 w-5'; // For inline use, like in buttons
  if (size === 'large') spinnerSizeClass = 'h-24 w-24';

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-4 border-b-4 border-indigo-500 ${spinnerSizeClass}`}></div>
    </div>
  );
};
