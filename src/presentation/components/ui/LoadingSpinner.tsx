'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'orange';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'white',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const colorClasses = {
    white: 'border-white border-t-transparent',
    primary: 'border-blue-500 border-t-transparent',
    orange: 'border-orange-500 border-t-transparent',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
