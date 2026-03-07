/**
 * Composant Button réutilisable
 */

import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'default' | 'destructive' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800',
  outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  link: 'text-blue-600 hover:text-blue-700 underline'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm rounded-md min-h-[36px]',
  md: 'px-4 py-2.5 text-base rounded-lg min-h-[44px]',
  lg: 'px-6 py-3 text-lg rounded-lg min-h-[48px]'
};

/**
 * Composant Button
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    className,
    disabled,
    children,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-medium transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Chargement...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
