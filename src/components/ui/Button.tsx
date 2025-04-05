import React from 'react';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  // Size class mapping
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant class mapping
  const variantClasses = {
    primary: 'bg-mars-red text-white hover:bg-mars-red/90 focus:ring-mars-red',
    secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-mars-red',
    outline: 'bg-transparent text-mars-red hover:bg-mars-red/10 border border-mars-red focus:ring-mars-red',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  // Combined classes
  const buttonClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors
    ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className || ''}
  `;

  // Button content
  const content = (
    <>
      {isLoading && (
        <span className="mr-2">
          <LoadingSpinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'primary'} />
        </span>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </>
  );

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses} aria-disabled={disabled}>
        {content}
      </Link>
    );
  }

  // Otherwise, render as button
  return (
    <button 
      className={buttonClasses}
      disabled={isLoading || disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;