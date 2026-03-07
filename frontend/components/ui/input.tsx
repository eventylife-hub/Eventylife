/**
 * Composant Input réutilisable avec label et gestion d'erreur
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

/**
 * Composant Input
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    icon,
    className,
    disabled,
    ...props
  }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border-2 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
              'min-h-[44px] text-base',
              icon ? 'pl-10' : '',
              error
                ? 'border-red-300 focus:border-red-400'
                : 'border-gray-300 focus:border-blue-500',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
