import React from 'react';

/**
 * Shared Atomic Input Component
 * @param {string} label - Input label text
 * @param {string} error - Validation error text
 * @param {string} helperText - Supplementary guidance text
 */
export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || name;

  const borderStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-200';

  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-3.5 py-2 text-sm text-gray-900 bg-white border rounded-lg transition shadow-sm outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${borderStyles}`}
        {...props}
      />

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
