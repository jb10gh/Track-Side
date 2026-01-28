import React from 'react';
import { cn } from '../utils/cn';

/**
 * Unified Button Component - Track Side Design System
 * Provides consistent button styling across the entire application
 */

const buttonVariants = {
  variant: {
    primary: `
      bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-accent)]
      text-white
      hover:from-[var(--color-brand-light)] hover:to-[var(--color-brand)]
      active:from-[var(--color-brand-dark)] active:to-[var(--color-brand-accent)]
      shadow-[var(--shadow-button)]
      hover:shadow-lg
      transform hover:scale-105
      transition-all duration-200
    `,
    secondary: `
      bg-[var(--btn-secondary-bg)]
      text-[var(--btn-secondary-text)]
      border-[var(--btn-secondary-border)]
      hover:bg-[var(--btn-secondary-hover)]
      active:bg-[var(--btn-secondary-active)]
      transition-all duration-200
    `,
    ghost: `
      bg-[var(--btn-ghost-bg)]
      text-[var(--btn-ghost-text)]
      hover:bg-[var(--btn-ghost-hover)]
      active:bg-[var(--btn-ghost-active)]
      transition-all duration-200
    `,
    danger: `
      bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-danger-dark)]
      text-white
      hover:from-[var(--color-danger-light)] hover:to-[var(--color-danger)]
      shadow-[var(--shadow-button)]
      transform hover:scale-105
      transition-all duration-200
    `
  },
  size: {
    sm: 'h-8 px-3 text-xs rounded-md font-semibold',
    md: 'h-10 px-4 text-sm rounded-lg font-semibold',
    lg: 'h-12 px-6 text-base rounded-xl font-bold'
  }
};

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'font-medium',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
        'relative overflow-hidden',
        
        // Variant styles
        buttonVariants.variant[variant],
        
        // Size styles
        buttonVariants.size[size],
        
        // Custom styles
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
