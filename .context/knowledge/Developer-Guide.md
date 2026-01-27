---
@skills: content-creator, doc-coauthoring, ui-ux-pro-max, typescript-expert, architecture
context_priority: critical
document_type: developer-guide
execution_date: 2024-01-28
reviewers: [human, ai-assistant]
---

# 🚀 Track Side Developer Guide

## 📚 Getting Started

Welcome to the Track Side developer guide! This comprehensive guide will help you get up to speed with the unified theme system and development practices.

## 🎯 Prerequisites

### **Required Knowledge**
- **React**: Basic understanding of React components and hooks
- **TypeScript**: Familiarity with TypeScript types and interfaces
- **CSS**: Understanding of CSS custom properties and styling
- **Modern JavaScript**: ES6+ features and async/await

### **Development Environment**
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **Code Editor**: VS Code with recommended extensions
- **Browser**: Chrome/Firefox with developer tools

### **VS Code Extensions**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🏗️ Project Structure

### **Theme System Structure**
```
src/
├── theme/
│   ├── theme-config.ts      # Theme configuration and types
│   ├── theme.css           # CSS custom properties
│   ├── theme-utils.ts      # Theme utilities and helpers
│   └── useTheme.ts         # React hooks for theme access
├── components/
│   ├── game/              # Game-related components
│   ├── home/              # Home page components
│   ├── layout/            # Layout components
│   └── match/             # Match-related components
└── styles/
    └── team-colors.css    # Legacy team colors (deprecated)
```

### **Component Structure**
```
src/components/[category]/
├── ComponentName.jsx      # Main component file
├── ComponentName.test.js  # Component tests
└── index.js              # Component exports
```

## 🎨 Theme System Quick Start

### **1. Import Theme Hooks**
```jsx
import { useTheme, useTeamTheme } from '../../theme/useTheme';
```

### **2. Use Theme in Components**
```jsx
export const MyComponent = () => {
  const { 
    colors, 
    typography, 
    spacing, 
    createCardStyles, 
    createButtonStyles,
    getSpacingValue 
  } = useTheme();
  
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  return (
    <div style={createCardStyles()}>
      <h2 style={{
        color: colors.primary,
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold
      }}>
        Themed Component
      </h2>
      <button style={createButtonStyles('primary')}>
        Action Button
      </button>
    </div>
  );
};
```

### **3. Team Color Usage**
```jsx
const ScoreDisplay = ({ ourScore, theirScore }) => {
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  return (
    <div>
      <span style={{ 
        color: ourTeam.colors.primary, 
        textShadow: ourTeam.colors.shadow 
      }}>
        {ourScore}
      </span>
      <span>-</span>
      <span style={{ 
        color: theirTeam.colors.primary, 
        textShadow: theirTeam.colors.shadow 
      }}>
        {theirScore}
      </span>
    </div>
  );
};
```

## 🔧 Development Workflow

### **1. Setup Development Environment**
```bash
# Clone the repository
git clone <repository-url>
cd sideline-stats

# Install dependencies
npm install

# Start development server
npm run dev
```

### **2. Component Development**
```bash
# Create new component
mkdir src/components/category/ComponentName
touch src/components/category/ComponentName/ComponentName.jsx
touch src/components/category/ComponentName/ComponentName.test.js
touch src/components/category/ComponentName/index.js
```

### **3. Theme Integration**
```jsx
// ComponentName.jsx
import React from 'react';
import { useTheme } from '../../theme/useTheme';

export const ComponentName = ({ prop1, prop2 }) => {
  const { createCardStyles, createButtonStyles, getSpacingValue } = useTheme();
  
  return (
    <div style={createCardStyles()}>
      <h2>{prop1}</h2>
      <button style={createButtonStyles('primary')}>
        {prop2}
      </button>
    </div>
  );
};

export default ComponentName;
```

### **4. Testing**
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🎯 Theme System Usage

### **Theme Hook API**
```typescript
const {
  colors,           // Color palette
  typography,       // Typography settings
  spacing,          // Spacing scale
  borderRadius,     // Border radius values
  shadows,          // Shadow definitions
  transitions,      // Transition settings
  effects,          // Visual effects
  team,             // Team color settings
  status,           // Status colors
  createCardStyles, // Card style generator
  createButtonStyles, // Button style generator
  createModalStyles, // Modal style generator
  createInputStyles, // Input style generator
  getSpacingValue   // Spacing utility
} = useTheme();
```

### **Team Theme Hook API**
```typescript
const {
  colors: {
    primary,    // Team primary color
    secondary,  // Team secondary color
    shadow      // Team shadow effect
  },
  getTeamColor  // Get team color by type
} = useTeamTheme('our' | 'their');
```

### **Style Generators**
```jsx
// Card styles
const cardStyles = createCardStyles();
// Returns: CSSProperties with theme-appropriate card styling

// Button styles
const primaryButton = createButtonStyles('primary');
const secondaryButton = createButtonStyles('secondary');
const dangerButton = createButtonStyles('danger');

// Modal styles
const modalStyles = createModalStyles();

// Input styles
const inputStyles = createInputStyles();
```

### **Utility Functions**
```jsx
// Semantic spacing
const padding = getSpacingValue('md'); // '1rem'
const margin = getSpacingValue('lg'); // '1.5rem'
const gap = getSpacingValue('sm');   // '0.5rem'
```

## 🎨 Design Tokens

### **Color Usage**
```jsx
// Brand colors
<div style={{ backgroundColor: 'var(--trackside-hot-pink)' }}>
<div style={{ color: 'var(--trackside-neon-pink)' }}>

// Team colors
<div style={{ color: 'var(--team-our-primary)' }}>
<div style={{ color: 'var(--team-their-primary)' }}>

// Status colors
<div style={{ color: 'var(--status-success)' }}>
<div style={{ color: 'var(--status-error)' }}>

// Semantic colors
<div style={{ color: 'var(--text-primary)' }}>
<div style={{ backgroundColor: 'var(--bg-surface)' }}>
<div style={{ border: 'var(--border-primary)' }}>
```

### **Typography Usage**
```jsx
// Font sizes
<h1 style={{ fontSize: 'var(--text-3xl)' }}>
<p style={{ fontSize: 'var(--text-base)' }}>

// Font weights
<span style={{ fontWeight: 'var(--font-bold)' }}>
<span style={{ fontWeight: 'var(--font-semibold)' }}>

// Font families
<div style={{ fontFamily: 'var(--font-primary)' }}>
<code style={{ fontFamily: 'var(--font-secondary)' }}>
```

### **Spacing Usage**
```jsx
// Semantic spacing
<div style={{ padding: 'var(--spacing-md)' }}>
<div style={{ margin: 'var(--spacing-lg)' }}>
<div style={{ gap: 'var(--spacing-sm)' }}>

// Using utility function
<div style={{ padding: getSpacingValue('md') }}>
<div style={{ margin: getSpacingValue('lg') }}>
<div style={{ gap: getSpacingValue('sm') }}>
```

### **Effects Usage**
```jsx
// Shadows
<div style={{ boxShadow: 'var(--shadow-lg)' }}>
<div style={{ boxShadow: 'var(--shadow-hot-pink)' }}>

// Glows
<h1 style={{ textShadow: 'var(--glow-brand)' }}>
<span style={{ textShadow: 'var(--glow-our-team)' }}>

// Transitions
<button style={{ transition: 'var(--transition-normal)' }}>
```

## 🏗️ Component Development

### **1. Component Template**
```jsx
import React from 'react';
import { useTheme } from '../../theme/useTheme';
import PropTypes from 'prop-types';

/**
 * ComponentName - Brief description
 * 
 * @param {Object} props - Component props
 * @param {string} props.prop1 - Description of prop1
 * @param {number} props.prop2 - Description of prop2
 * @param {Function} props.onAction - Description of onAction
 */
export const ComponentName = ({ prop1, prop2, onAction }) => {
  const { createCardStyles, createButtonStyles, getSpacingValue } = useTheme();
  
  const handleAction = () => {
    onAction?.();
  };
  
  return (
    <div style={createCardStyles()}>
      <div style={{ padding: getSpacingValue('md') }}>
        <h2 style={{
          color: 'var(--text-primary)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-bold)',
          marginBottom: getSpacingValue('sm')
        }}>
          {prop1}
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-base)',
          marginBottom: getSpacingValue('lg')
        }}>
          {prop2}
        </p>
        <button
          onClick={handleAction}
          style={createButtonStyles('primary')}
        >
          Action
        </button>
      </div>
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onAction: PropTypes.func
};

ComponentName.defaultProps = {
  prop2: 0,
  onAction: () => {}
};

export default ComponentName;
```

### **2. Component with Team Colors**
```jsx
import React from 'react';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

export const TeamScoreDisplay = ({ ourScore, theirScore }) => {
  const { getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: getSpacingValue('lg'),
      padding: getSpacingValue('lg')
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: 'var(--font-black)',
          color: ourTeam.colors.primary,
          textShadow: ourTeam.colors.shadow
        }}>
          {ourScore}
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginTop: getSpacingValue('xs')
        }}>
          Our Team
        </div>
      </div>
      
      <div style={{
        fontSize: 'var(--text-2xl)',
        color: 'var(--text-muted)',
        fontWeight: 'var(--font-bold)'
      }}>
        -
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: 'var(--font-black)',
          color: theirTeam.colors.primary,
          textShadow: theirTeam.colors.shadow
        }}>
          {theirScore}
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginTop: getSpacingValue('xs')
        }}>
          Their Team
        </div>
      </div>
    </div>
  );
};

export default TeamScoreDisplay;
```

### **3. Modal Component Template**
```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, createButtonStyles, getSpacingValue } from '../../theme/useTheme';

export const MyModal = ({ isOpen, onClose, title, children }) => {
  const { createModalStyles } = useTheme();
  
  if (!isOpen) return null;
  
  const modalStyles = createModalStyles();
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 modal-overlay"
          onClick={onClose}
          style={{ background: 'var(--modal-overlay)' }}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative rounded-2xl p-6 max-w-md w-full"
          style={{
            ...modalStyles,
            padding: getSpacingValue('lg'),
            maxWidth: '28rem'
          }}
        >
          {/* Header */}
          {title && (
            <div style={{
              borderBottom: 'var(--border-subtle)',
              paddingBottom: getSpacingValue('md'),
              marginBottom: getSpacingValue('lg')
            }}>
              <h2 style={{
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)'
              }}>
                {title}
              </h2>
            </div>
          )}
          
          {/* Content */}
          <div style={{ marginBottom: getSpacingValue('lg') }}>
            {children}
          </div>
          
          {/* Footer */}
          <div style={{
            display: 'flex',
            gap: getSpacingValue('sm'),
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                ...createButtonStyles('secondary'),
                padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MyModal;
```

## 🧪 Testing

### **1. Component Testing Template**
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    prop1: 'Test Prop',
    prop2: 42,
    onAction: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<ComponentName {...defaultProps} />);
    
    expect(screen.getByText('Test Prop')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('calls onAction when button is clicked', () => {
    render(<ComponentName {...defaultProps} />);
    
    const button = screen.getByText('Action');
    fireEvent.click(button);
    
    expect(defaultProps.onAction).toHaveBeenCalledTimes(1);
  });

  test('applies theme styles correctly', () => {
    render(<ComponentName {...defaultProps} />);
    
    const container = screen.getByText('Test Prop').closest('div');
    expect(container).toHaveStyle({
      backgroundColor: 'var(--bg-surface)'
    });
  });
});
```

### **2. Theme Hook Testing**
```jsx
import { renderHook } from '@testing-library/react';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

describe('Theme Hooks', () => {
  test('useTheme returns correct theme values', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.colors.primary).toBe('#FF1493');
    expect(result.current.spacing.md).toBe('1rem');
    expect(result.current.typography.sizes.lg).toBe('1.125rem');
  });

  test('useTeamTheme returns correct team colors', () => {
    const { result: ourResult } = renderHook(() => useTeamTheme('our'));
    const { result: theirResult } = renderHook(() => useTeamTheme('their'));
    
    expect(ourResult.current.colors.primary).toBe('#FF1493');
    expect(theirResult.current.colors.primary).toBe('#FF007F');
  });

  test('createCardStyles returns valid styles', () => {
    const { result } = renderHook(() => useTheme());
    const cardStyles = result.current.createCardStyles();
    
    expect(cardStyles).toHaveProperty('backgroundColor');
    expect(cardStyles).toHaveProperty('borderRadius');
  });
});
```

### **3. Integration Testing**
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from '../game/ScoreBoard';

describe('ScoreBoard Integration', () => {
  test('displays team scores with correct colors', () => {
    render(<ScoreBoard ourScore={3} theirScore={2} timer={0} isRunning={false} />);
    
    const ourScore = screen.getByText('3');
    const theirScore = screen.getByText('2');
    
    expect(ourScore).toHaveStyle({
      color: 'var(--team-our-primary)'
    });
    expect(theirScore).toHaveStyle({
      color: 'var(--team-their-primary)'
    });
  });

  test('applies theme spacing correctly', () => {
    render(<ScoreBoard ourScore={3} theirScore={2} timer={0} isRunning={false} />);
    
    const container = screen.getByText('3').closest('div');
    expect(container).toHaveStyle({
      padding: 'var(--spacing-md)'
    });
  });
});
```

## 🔧 Debugging

### **1. Theme Debug Tools**
```jsx
// Development-only debugging
if (process.env.NODE_ENV === 'development') {
  // Debug theme values
  console.log('Theme colors:', useTheme().colors);
  console.log('Team colors:', useTeamTheme('our').colors);
  
  // Debug spacing values
  const { getSpacingValue } = useTheme();
  console.log('Spacing md:', getSpacingValue('md'));
  
  // Debug style generators
  const { createCardStyles } = useTheme();
  console.log('Card styles:', createCardStyles());
}
```

### **2. Browser DevTools**
```javascript
// Check CSS variables
getComputedStyle(document.documentElement)
  .getPropertyValue('--trackside-hot-pink');

// List all CSS variables
Array.from(document.styleSheets)
  .flatMap(sheet => Array.from(sheet.cssRules || []))
  .filter(rule => rule.style && rule.style.cssText.includes('--'))
  .map(rule => rule.style.cssText);
```

### **3. Common Issues**
```jsx
// Issue: Theme values not updating
// Solution: Ensure theme is imported correctly
import { useTheme } from '../../theme/useTheme';

// Issue: Team colors not working
// Solution: Check team parameter
const ourTeam = useTeamTheme('our'); // Make sure 'our' is correct

// Issue: Spacing not applying
// Solution: Use getSpacingValue utility
const { getSpacingValue } = useTheme();
<div style={{ padding: getSpacingValue('md') }}>
```

## 📋 Best Practices

### **1. Code Organization**
```jsx
// ✅ Good: Organize imports at top
import React from 'react';
import { useTheme, useTeamTheme } from '../../theme/useTheme';
import { ComponentName } from './ComponentName';

// ✅ Good: Destructure theme hooks
const { createCardStyles, getSpacingValue } = useTheme();
const ourTeam = useTeamTheme('our');

// ✅ Good: Use semantic spacing
<div style={{ padding: getSpacingValue('md') }}>

// ❌ Avoid: Mixed approaches
<div style={{ padding: '16px', margin: '1rem' }}>
```

### **2. Performance**
```jsx
// ✅ Good: Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(theme);
}, [theme]);

// ✅ Good: Use useCallback for event handlers
const handleClick = useCallback(() => {
  onAction(value);
}, [onAction, value]);

// ❌ Avoid: Creating new objects on every render
<div style={{ backgroundColor: theme.colors.primary }}>
```

### **3. Accessibility**
```jsx
// ✅ Good: Use semantic HTML
<button
  onClick={handleAction}
  style={createButtonStyles('primary')}
  aria-label="Perform action"
>
  Action
</button>

// ✅ Good: Provide focus indicators
<button
  style={{
    ...createButtonStyles('primary'),
    ':focus': {
      outline: '2px solid var(--trackside-hot-pink)'
    }
  }}
>

// ✅ Good: Use ARIA attributes
<div role="alert" style={{ color: 'var(--status-error)' }}>
  Error message
</div>
```

### **4. Error Handling**
```jsx
// ✅ Good: Handle missing props gracefully
export const ComponentName = ({ prop1, prop2, onAction }) => {
  const { createCardStyles } = useTheme();
  
  if (!prop1) {
    return (
      <div style={{ color: 'var(--status-error)' }}>
        Error: prop1 is required
      </div>
    );
  }
  
  return (
    <div style={createCardStyles()}>
      {/* Component content */}
    </div>
  );
};

// ✅ Good: Provide default values
ComponentName.defaultProps = {
  prop2: 0,
  onAction: () => {}
};
```

## 🚀 Deployment

### **1. Build Process**
```bash
# Build for production
npm run build

# Build with analysis
npm run build:analyze

# Build for staging
npm run build:staging
```

### **2. Environment Variables**
```bash
# .env.production
NODE_ENV=production
VITE_APP_TITLE=Track Side
VITE_API_URL=https://api.trackside.com
```

### **3. Production Checklist**
- [ ] All components use theme system
- [ ] No hardcoded colors or values
- [ ] Tests pass with 100% coverage
- [ ] Performance scores are acceptable
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility tested
- [ ] Documentation is up to date

## 📞 Support

### **Getting Help**
- **Documentation**: Theme system and component documentation
- **Code Examples**: Component library and usage examples
- **Troubleshooting**: Common issues and solutions
- **Best Practices**: Development guidelines and patterns

### **Community**
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Code Reviews**: Get feedback on your changes
- **Contributing**: Guidelines for contributing to the project

### **Resources**
- **React Documentation**: https://react.dev
- **TypeScript Documentation**: https://www.typescriptlang.org
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Framer Motion**: https://www.framer.com/motion

---

## 🎯 Quick Reference

### **Common Theme Patterns**
```jsx
// Card with theme
<div style={createCardStyles()}>

// Button with theme
<button style={createButtonStyles('primary')}>

// Modal with theme
<div style={createModalStyles()}>

// Team colors
const ourTeam = useTeamTheme('our');
<span style={{ color: ourTeam.colors.primary }}>

// Semantic spacing
<div style={{ padding: getSpacingValue('md') }}>

// Status colors
<div style={{ color: 'var(--status-success)' }}>
```

### **Theme Hook Cheat Sheet**
```jsx
const {
  colors,              // Color palette
  typography,          // Typography settings
  spacing,             // Spacing scale
  createCardStyles,    // Card styles
  createButtonStyles,  // Button styles
  createModalStyles,   // Modal styles
  getSpacingValue      // Spacing utility
} = useTheme();
```

---

*Developer guide maintained with comprehensive getting started instructions, development workflow, best practices, and troubleshooting for Track Side theme system.*
