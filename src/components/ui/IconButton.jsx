import React from 'react';
import { Button } from './Button';
import { cn } from '../utils/cn';

/**
 * Icon Button Component - Track Side Design System
 * Button optimized for icon-only interactions
 */

const IconButton = React.forwardRef(({ 
  className, 
  variant = 'ghost', 
  size = 'md', 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  return (
    <Button
      className={cn(
        'p-2',
        'aspect-square',
        'flex items-center justify-center',
        className
      )}
      variant={variant}
      size={size}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

export { IconButton };
