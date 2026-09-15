import React from 'react';

/**
 * Shared Atomic Button Component
 * @param {'primary'|'secondary'|'outline'|'danger'|'ghost'} variant - Visual style variant
 * @param {'sm'|'md'|'lg'} size - Button size
 * @param {boolean} isLoading - Loading state spinner indicator
 * @param {boolean} fullWidth - Expands button to 100% parent width
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = {
    primary:
      'bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold focus:ring-yellow-400 shadow-sm',
    secondary:
      'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700 shadow-sm',
    outline:
      'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-yellow-400',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
