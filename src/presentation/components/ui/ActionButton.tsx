'use client';

import LoadingSpinner from './LoadingSpinner';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
}

export default function ActionButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  loadingText = 'Loading...',
}: Readonly<ActionButtonProps>) {
  const baseStyles =
    'font-bold rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 flex items-center justify-center gap-2';

  const variants = {
    primary:
      'bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white hover:from-yellow-600 hover:via-orange-600 hover:to-amber-600 hover:shadow-xl focus:ring-orange-500/50',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 hover:shadow-xl focus:ring-gray-500/50',
    success:
      'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105 focus:ring-green-500/50',
    warning:
      'bg-gradient-to-r from-[#f1ba63] to-[#fbf39b] text-[#643c30] hover:shadow-xl transform hover:scale-105 focus:ring-yellow-500/50',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-xl focus:ring-red-500/50',
  };

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3.5 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
