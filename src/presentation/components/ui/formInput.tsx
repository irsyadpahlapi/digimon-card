'use client';

import React from 'react';
import { FormInputProps } from '@/core/entities/digimon.d';

export default function FormInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  icon,
  required = false,
  disabled = false,
  error,
  className = '',
}: Readonly<FormInputProps>) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 
            bg-gray-50 border border-gray-200 rounded-lg 
            text-gray-900 placeholder-gray-400 
            focus:outline-none focus:border-orange-500 
            focus:ring-2 focus:ring-orange-500/20 
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 ml-1">
          {error}
        </p>
      )}
    </div>
  );
}
