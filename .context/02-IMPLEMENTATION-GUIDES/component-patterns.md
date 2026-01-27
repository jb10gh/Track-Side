---
@skills: ui-ux-pro-max, typescript-expert, doc-coauthoring
context_priority: high
document_type: patterns
technical_depth: expert
audience: [developers, ui-engineers]
last_updated: 2024-01-26
reviewers: [human, ai-assistant]
---

# 🎨 Component Patterns

## 🤖 AI Assistant Instructions
**Primary Skills:**
- @skills:ui-ux-pro-max for design system and user experience
- @skills:typescript-expert for component architecture and type safety
- @skills:doc-coauthoring for structured documentation and review

## 📋 Overview (@skills:ui-ux-pro-max)
This document defines the component patterns and design system used throughout Track Side. All components should follow these patterns to ensure consistency, maintainability, and excellent user experience.

## 🎯 **Design System Architecture**

### **Design Tokens** (@skills:ui-ux-pro-max)
```css
:root {
  /* Colors */
  --color-primary: #ec4899;      /* Team pink */
  --color-secondary: #3b82f6;    /* Opponent blue */
  --color-success: #10b981;      /* Success green */
  --color-warning: #f59e0b;      /* Warning yellow */
  --color-danger: #ef4444;        /* Error red */
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### **Team Color System** (@skills:ui-ux-pro-max)
```css
:root {
  /* Our Team - Pink Theme */
  --team-our-primary: #ec4899;
  --team-our-light: #f9a8d4;
  --team-our-dark: #be185d;
  --team-our-bg: #fce7f3;
  --team-our-border: #ec4899;
  --team-our-text: #831843;
  
  /* Opponent Team - Contrasting Blue */
  --team-their-primary: #3b82f6;
  --team-their-light: #93c5fd;
  --team-their-dark: #1d4ed8;
  --team-their-bg: #dbeafe;
  --team-their-border: #3b82f6;
  --team-their-text: #1e3a8a;
}
```

## 🧩 **Component Architecture** (@skills:typescript-expert)

### **Base Component Interface**
```typescript
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface DataComponentProps<T> extends BaseComponentProps {
  data: T;
  onUpdate?: (data: T) => void;
}
```

### **Component Factory Pattern**
```typescript
// Generic component factory for consistent props
const createComponent = <T extends BaseComponentProps>(
  displayName: string,
  render: (props: T) => React.ReactElement
) => {
  const Component = render;
  Component.displayName = displayName;
  return Component;
};

// Usage example
const Button = createComponent<ButtonProps>('Button', ({
  className,
  children,
  onClick,
  disabled,
  loading,
  testId,
  ...props
}) => (
  <button
    className={`btn ${className || ''}`}
    onClick={onClick}
    disabled={disabled || loading}
    data-testid={testId}
    {...props}
  >
    {loading ? <Spinner /> : children}
  </button>
));
```

## 📱 **Mobile-First Components**

### **Touch-Optimized Button** (@skills:ui-ux-pro-max)
```typescript
interface TouchButtonProps extends InteractiveComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  loading,
  onClick,
  testId,
  ...props
}) => {
  const baseClasses = `
    touch-button
    ${variant === 'primary' ? 'touch-button-primary' : ''}
    ${variant === 'secondary' ? 'touch-button-secondary' : ''}
    ${variant === 'ghost' ? 'touch-button-ghost' : ''}
    ${size === 'sm' ? 'touch-button-sm' : ''}
    ${size === 'md' ? 'touch-button-md' : ''}
    ${size === 'lg' ? 'touch-button-lg' : ''}
    ${fullWidth ? 'touch-button-full-width' : ''}
    ${disabled ? 'touch-button-disabled' : ''}
    ${className}
  `;

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      {...props}
    >
      {children}
    </button>
  );
};
```

### **CSS for Touch Optimization**
```css
/* Touch button styles */
.touch-button {
  min-height: 44px; /* iOS touch target minimum */
  min-width: 44px;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.touch-button:active {
  transform: scale(0.98);
}

.touch-button-primary {
  background-color: var(--team-our-primary);
  color: white;
  border: none;
}

.touch-button-secondary {
  background-color: var(--color-secondary);
  color: white;
  border: none;
}

.touch-button-ghost {
  background-color: transparent;
  color: var(--team-our-primary);
  border: 2px solid var(--team-our-primary);
}
```

## 📊 **Data Display Components**

### **Score Display Component** (@skills:ui-ux-pro-max)
```typescript
interface ScoreDisplayProps {
  score: number;
  team: 'our' | 'their';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  testId?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  team,
  size = 'lg',
  animated = false,
  testId,
  className = ''
}) => {
  const teamColors = {
    our: {
      color: 'var(--team-our-primary)',
      bg: 'var(--team-our-bg)',
      border: 'var(--team-our-border)'
    },
    their: {
      color: 'var(--team-their-primary)',
      bg: 'var(--team-their-bg)',
      border: 'var(--team-their-border)'
    }
  };

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  const colors = teamColors[team];

  return (
    <div
      className={`
        score-display
        ${sizeClasses[size]}
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
      style={{
        color: colors.color,
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`
      }}
      data-testid={testId}
    >
      {score}
    </div>
  );
};
```

### **Event Timeline Component** (@skills:ui-ux-pro-max)
```typescript
interface EventTimelineProps {
  events: GameEvent[];
  onEdit: (event: GameEvent) => void;
  onDelete?: (event: GameEvent) => void;
  formatTime: (time: string) => string;
  className?: string;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  onEdit,
  onDelete,
  formatTime,
  className = ''
}) => {
  return (
    <div className={`event-timeline ${className}`}>
      {events.map((event, index) => (
        <EventItem
          key={event.id}
          event={event}
          position={index}
          onEdit={onEdit}
          onDelete={onDelete}
          formatTime={formatTime}
        />
      ))}
    </div>
  );
};

interface EventItemProps {
  event: GameEvent;
  position: number;
  onEdit: (event: GameEvent) => void;
  onDelete?: (event: GameEvent) => void;
  formatTime: (time: string) => string;
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  position,
  onEdit,
  onDelete,
  formatTime
}) => {
  const isOurEvent = event.team === 'us';
  const isGoal = event.type === 'goal';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1 }}
      className={`
        event-item
        ${isOurEvent ? 'event-our' : 'event-their'}
        ${isGoal ? 'event-goal' : 'event-penalty'}
      `}
      layout
      whileHover={{ scale: 1.02 }}
      onClick={() => onEdit(event)}
    >
      <div className="event-time">
        {formatTime(event.gameTime)}
      </div>
      <div className="event-content">
        <div className="event-type">
          {isGoal ? '⚽' : '🟨'}
        </div>
        <div className="event-label">
          {event.label || 'Unnamed'}
        </div>
        {event.meta?.isPK && (
          <span className="event-pk">PK</span>
        )}
      </div>
      <div className="event-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
          className="event-edit"
          aria-label="Edit event"
        >
          <Edit3 size={16} />
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event);
            }}
            className="event-delete"
            aria-label="Delete event"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
```

## 🎛️ **Modal and Overlay Components**

### **Modal Component** (@skills:ui-ux-pro-max)
```typescript
interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  children,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`modal-content modal-${size}`}
        >
          {title && (
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="modal-close"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}
          <div className="modal-body">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```

### **CSS for Modal**
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-sm {
  max-width: 400px;
}

.modal-md {
  max-width: 600px;
}

.modal-lg {
  max-width: 800px;
}

.modal-xl {
  max-width: 1200px;
}
```

## 🎯 **Form Components**

### **Input Component** (@skills:ui-ux-pro-max)
```typescript
interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  disabled = false,
  className = '',
  testId,
  ...props
}) => {
  const inputId = React.useId();
  
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            input-field
            ${error ? 'input-error' : ''}
            ${disabled ? 'input-disabled' : ''}
          `}
          data-testid={testId}
          {...props}
      />
      {error && (
        <div className="input-error-message">{error}</div>
      )}
    </div>
  );
};
```

### **Form Component** (@skills:ui-ux-pro-max)
```typescript
interface FormProps extends BaseComponentProps {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className = '',
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} className={`form ${className}`} {...props}>
      {children}
    </form>
  );
};
```

## 📱 **List and Grid Components**

### **List Component** (@skills:ui-ux-pro-max)
```typescript
interface ListProps extends BaseComponentProps {
  items: React.ReactNode[];
  variant?: 'default' | 'card' | 'timeline';
  className?: string;
}

export const List: React.FC<ListProps> = ({
  items,
  variant = 'default',
  className = ''
}) => {
  const variantClasses = {
    default: 'list-default',
    card: 'list-card',
    timeline: 'list-timeline'
  };

  return (
    <div className={`list ${variantClasses[variant]} ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="list-item">
          {item}
        </li>
      ))}
    </div>
  );
};
```

### **Grid Component** (@skills:ui-ux-pro-max)
```typescript
interface GridProps extends BaseComponentProps {
  cols?: number | string;
  gap?: number | string;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  cols = 1,
  gap = 4,
  className = '',
  children,
  ...props
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols,
    gap: `${gap * 4}px`
  };

  return (
    <div className={`grid ${className}`} style={gridStyle} {...props}>
      {children}
    </div>
  );
};
```

## 🚀 **Animation Components**

### **Loading Spinner** (@skills:ui-ux-pro-max)
```typescript
interface SpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  };

  return (
    <div
      className={`spinner ${sizeClasses[size]} ${className}`}
      style={{ color }}
    >
      <div className="spinner-circle" />
      <div className="spinner-circle" />
      <div className="spinner-circle" />
    </div>
  );
};
```

### **CSS for Animations**
```css
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid currentColor;
  margin: 0 2px;
  animation: spin 1.2s linear infinite;
}

.spinner-circle:nth-child(2) {
  animation-delay: 0.2s;
}

.spinner-circle:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 📱 **Responsive Design Patterns**

### **Responsive Container**
```typescript
interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> ({
  maxWidth = 'lg',
  padding = true,
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  };

  const paddingClasses = padding ? 'container-padding' : '';

  return (
    <div className={`container ${maxWidthClasses[maxWidth]} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};
```

### **Responsive Grid**
```typescript
interface ResponsiveGridProps {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> ({
  sm,
  md,
  lg,
  xl,
  className = ''
}) => {
  const gridClasses = [
    sm && `grid-cols-${sm}`,
    md && `md:grid-cols-${md}`,
    lg && `lg:grid-cols-${lg}`,
    xl && `xl:grid-cols-${xl}`
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid ${gridClasses} ${className}`}>
      {children}
    </div>
  );
};
```

## 🧪 **Testing Patterns** (@skills:typescript-expert)

### **Component Testing Template**
```typescript
describe('ComponentName', () => {
  const defaultProps = {
    // Default props for testing
  };

  const mockProps = {
    // Mock props for specific test cases
  };

  it('renders with default props', () => {
    render(<Component {...defaultProps} />);
    // Test default behavior
  });

  it('renders with custom props', () => {
    render(<Component {...mockProps} />);
    // Test custom behavior
  });

  it('handles user interactions', async () => {
    const mockCallback = jest.fn();
    render(<Component onClick={mockCallback} />);
    
    await userEvent.click(screen.getByRole('button'));
    expect(mockCallback).toHaveBeenCalled();
  });

  it('displays correctly with accessibility features', () => {
    render(<Component {...defaultProps} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });
});
```

## 📚 **Performance Optimization**

### **Memoization Strategy** (@skills:typescript-expert)
```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo<ExpensiveProps>(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return processExpensiveData(data);
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
});

// Memoize callback functions
const handleEventEdit = useCallback((event: GameEvent) => {
  onEdit(event);
}, [onEdit]);

// Use React.memo for stable references
const StableComponent = React.memo<StableProps>(({ data }) => {
  return <div>{data}</div>;
});
```

---

*Component patterns maintained with @skills:ui-ux-pro-max, @skills:typescript-expert, and @skills:doc-coauthoring*
