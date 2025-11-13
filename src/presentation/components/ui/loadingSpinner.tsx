'use client';
import { LoadingSpinnerProps } from '@/core/entities/digimon.d';

export default function LoadingSpinner({
  size = 'md',
  color = 'white',
  className = '',
}: Readonly<LoadingSpinnerProps>) {
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
    <output
      data-testid="loading-spinner"
      data-size={size}
      data-color={color}
      className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full animate-spin ${className}`}
      aria-label="Loading"
    />
  );
}
