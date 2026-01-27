---
@skills: content-creator, doc-coauthoring, ui-ux-pro-max, typescript-expert, architecture
context_priority: critical
document_type: technical-documentation
execution_date: 2024-01-28
reviewers: [human, ai-assistant]
---

# 🎨 Track Side Theme System Documentation

## 📚 Overview

The Track Side Theme System is a comprehensive, unified theming solution designed to provide consistent visual appearance and enhanced developer experience across the entire Track Side application. This system replaces hardcoded styles and fragmented theming approaches with a centralized, type-safe, and scalable solution.

## 🏗️ Architecture

### **Core Components**

#### **1. Theme Configuration (`src/theme/theme-config.ts`)**
```typescript
interface TrackSideTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    // ... comprehensive color palette
  };
  typography: {
    fonts: {
      primary: string;
      secondary: string;
    };
    weights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      black: number;
    };
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    hotPink: string;
    electricPink: string;
    neonPink: string;
    deepPink: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  effects: {
    glowBrand: string;
    glowOurTeam: string;
    glowTheirTeam: string;
  };
  team: {
    our: {
      primary: string;
      secondary: string;
      shadow: string;
    };
    their: {
      primary: string;
      secondary: string;
      shadow: string;
    };
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}
```

#### **2. CSS Variables (`src/theme/theme.css`)**
```css
:root {
  /* Brand Colors */
  --trackside-hot-pink: #FF1493;
  --trackside-neon-pink: #FF69B4;
  --trackside-deep-pink: #C71585;
  --trackside-electric-pink: #FF007F;
  
  /* Typography */
  --font-primary: 'Inter', system-ui, sans-serif;
  --font-secondary: 'JetBrains Mono', monospace;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-black: 900;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  --spacing-4xl: 6rem;
  
  /* Team Colors */
  --team-our-primary: #FF1493;
  --team-our-secondary: #FF69B4;
  --team-our-shadow: 0 0 20px rgba(255, 20, 147, 0.6);
  
  --team-their-primary: #FF007F;
  --team-their-secondary: #FF69B4;
  --team-their-shadow: 0 0 20px rgba(255, 0, 127, 0.6);
  
  /* Status Colors */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-error: #EF4444;
  --status-info: #3B82F6;
  
  /* Effects */
  --glow-brand: 0 0 20px rgba(255, 20, 147, 0.5);
  --glow-our-team: 0 0 20px rgba(255, 20, 147, 0.6);
  --glow-their-team: 0 0 20px rgba(255, 0, 127, 0.6);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}
```

#### **3. Theme Utilities (`src/theme/theme-utils.ts`)**
```typescript
// Theme getter functions
export const getThemeValue = (path: string): any;
export const getColorValue = (colorName: string): string;
export const getSpacingValue = (size: string): string;
export const getTypographyValue = (property: string, value: string): string;

// Style generators
export const createCardStyles = (): CSSProperties;
export const createButtonStyles = (variant: 'primary' | 'secondary' | 'danger'): CSSProperties;
export const createModalStyles = (): CSSProperties;
export const createInputStyles = (): CSSProperties;

// Migration helpers
export const migrateToTheme = (oldStyles: CSSProperties): CSSProperties;
export const validateThemeUsage = (component: React.ComponentType): boolean;

// Debug utilities
export const debugThemeValue = (path: string): void;
export const listThemeVariables = (): string[];
```

#### **4. React Hooks (`src/theme/useTheme.ts`)**
```typescript
// Main theme hook
export const useTheme = (): {
  colors: TrackSideTheme['colors'];
  typography: TrackSideTheme['typography'];
  spacing: TrackSideTheme['spacing'];
  borderRadius: TrackSideTheme['borderRadius'];
  shadows: TrackSideTheme['shadows'];
  transitions: TrackSideTheme['transitions'];
  effects: TrackSideTheme['effects'];
  team: TrackSideTheme['team'];
  status: TrackSideTheme['status'];
  createCardStyles: () => CSSProperties;
  createButtonStyles: (variant: 'primary' | 'secondary' | 'danger') => CSSProperties;
  createModalStyles: () => CSSProperties;
  createInputStyles: () => CSSProperties;
  getSpacingValue: (size: string) => string;
};

// Team-specific theme hook
export const useTeamTheme = (team: 'our' | 'their'): {
  colors: {
    primary: string;
    secondary: string;
    shadow: string;
  };
  getTeamColor: (type: 'primary' | 'secondary' | 'shadow') => string;
};
```

## 🎯 Usage Patterns

### **1. Basic Theme Usage**
```jsx
import { useTheme } from '../../theme/useTheme';

export const MyComponent = () => {
  const { colors, typography, spacing } = useTheme();
  
  return (
    <div style={{
      backgroundColor: colors.primary,
      color: colors.text,
      fontSize: typography.sizes.lg,
      padding: spacing.md,
    }}>
      Themed Content
    </div>
  );
};
```

### **2. Style Generators**
```jsx
import { useTheme } from '../../theme/useTheme';

export const MyCard = () => {
  const { createCardStyles, createButtonStyles } = useTheme();
  
  return (
    <div style={createCardStyles()}>
      <h2>Card Title</h2>
      <button style={createButtonStyles('primary')}>
        Action Button
      </button>
    </div>
  );
};
```

### **3. Team Colors**
```jsx
import { useTeamTheme } from '../../theme/useTheme';

export const ScoreDisplay = ({ ourScore, theirScore }) => {
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

### **4. Semantic Spacing**
```jsx
import { getSpacingValue } from '../../theme/useTheme';

export const LayoutComponent = () => {
  return (
    <div style={{
      padding: getSpacingValue('lg'),
      margin: getSpacingValue('md'),
      gap: getSpacingValue('sm'),
    }}>
      Content with semantic spacing
    </div>
  );
};
```

## 🎨 Design Tokens

### **Color System**

#### **Brand Colors**
- `--trackside-hot-pink`: #FF1493 (Primary brand)
- `--trackside-neon-pink`: #FF69B4 (Secondary brand)
- `--trackside-deep-pink`: #C71585 (Dark brand)
- `--trackside-electric-pink`: #FF007F (Accent brand)

#### **Team Colors**
- `--team-our-primary`: #FF1493 (Our team primary)
- `--team-our-secondary`: #FF69B4 (Our team secondary)
- `--team-our-shadow`: 0 0 20px rgba(255, 20, 147, 0.6) (Our team glow)
- `--team-their-primary`: #FF007F (Their team primary)
- `--team-their-secondary`: #FF69B4 (Their team secondary)
- `--team-their-shadow`: 0 0 20px rgba(255, 0, 127, 0.6) (Their team glow)

#### **Status Colors**
- `--status-success`: #10B981 (Success state)
- `--status-warning`: #F59E0B (Warning state)
- `--status-error`: #EF4444 (Error state)
- `--status-info`: #3B82F6 (Info state)

#### **Semantic Colors**
- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--text-muted`: Muted text color
- `--text-disabled`: Disabled text color
- `--bg-primary`: Primary background
- `--bg-secondary`: Secondary background
- `--bg-surface`: Surface background
- `--border-primary`: Primary border
- `--border-secondary`: Secondary border

### **Typography System**

#### **Font Families**
- `--font-primary`: 'Inter', system-ui, sans-serif
- `--font-secondary`: 'JetBrains Mono', monospace

#### **Font Weights**
- `--font-light`: 300
- `--font-normal`: 400
- `--font-medium`: 500
- `--font-semibold`: 600
- `--font-bold`: 700
- `--font-black`: 900

#### **Font Sizes**
- `--text-xs`: 0.75rem (12px)
- `--text-sm`: 0.875rem (14px)
- `--text-base`: 1rem (16px)
- `--text-lg`: 1.125rem (18px)
- `--text-xl`: 1.25rem (20px)
- `--text-2xl`: 1.5rem (24px)
- `--text-3xl`: 1.875rem (30px)
- `--text-4xl`: 2.25rem (36px)
- `--text-5xl`: 3rem (48px)
- `--text-6xl`: 3.75rem (60px)

### **Spacing System**

#### **Semantic Spacing**
- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)
- `--spacing-3xl`: 4rem (64px)
- `--spacing-4xl`: 6rem (96px)

### **Border Radius**
- `--radius-sm`: 0.25rem (4px)
- `--radius-md`: 0.5rem (8px)
- `--radius-lg`: 0.75rem (12px)
- `--radius-xl`: 1rem (16px)
- `--radius-2xl`: 1.5rem (24px)
- `--radius-full`: 9999px

### **Shadows**
- `--shadow-sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- `--shadow-md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- `--shadow-lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
- `--shadow-xl`: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
- `--shadow-2xl`: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
- `--shadow-hot-pink`: 0 4px 20px rgba(255, 20, 147, 0.4)
- `--shadow-electric-pink`: 0 4px 20px rgba(255, 0, 127, 0.4)
- `--shadow-neon-pink`: 0 4px 20px rgba(255, 105, 180, 0.4)
- `--shadow-deep-pink`: 0 4px 20px rgba(199, 21, 133, 0.4)

### **Transitions**
- `--transition-fast`: 150ms ease
- `--transition-normal`: 250ms ease
- `--transition-slow`: 350ms ease

### **Effects**
- `--glow-brand`: 0 0 20px rgba(255, 20, 147, 0.5)
- `--glow-our-team`: 0 0 20px rgba(255, 20, 147, 0.6)
- `--glow-their-team`: 0 0 20px rgba(255, 0, 127, 0.6)

## 🛠️ API Reference

### **useTheme Hook**

#### **Returns**
```typescript
{
  colors: TrackSideTheme['colors'];
  typography: TrackSideTheme['typography'];
  spacing: TrackSideTheme['spacing'];
  borderRadius: TrackSideTheme['borderRadius'];
  shadows: TrackSideTheme['shadows'];
  transitions: TrackSideTheme['transitions'];
  effects: TrackSideTheme['effects'];
  team: TrackSideTheme['team'];
  status: TrackSideTheme['status'];
  createCardStyles: () => CSSProperties;
  createButtonStyles: (variant: 'primary' | 'secondary' | 'danger') => CSSProperties;
  createModalStyles: () => CSSProperties;
  createInputStyles: () => CSSProperties;
  getSpacingValue: (size: string) => string;
}
```

#### **Example**
```jsx
const { 
  colors, 
  typography, 
  createCardStyles, 
  createButtonStyles,
  getSpacingValue 
} = useTheme();
```

### **useTeamTheme Hook**

#### **Parameters**
- `team`: 'our' | 'their' - Team identifier

#### **Returns**
```typescript
{
  colors: {
    primary: string;
    secondary: string;
    shadow: string;
  };
  getTeamColor: (type: 'primary' | 'secondary' | 'shadow') => string;
}
```

#### **Example**
```jsx
const ourTeam = useTeamTheme('our');
const theirTeam = useTeamTheme('their');
```

### **Style Generators**

#### **createCardStyles()**
Creates consistent card styling with theme integration.

```jsx
const cardStyles = createCardStyles();
// Returns: CSSProperties with theme-appropriate card styling
```

#### **createButtonStyles(variant)**
Creates button styling with different variants.

```jsx
const primaryButton = createButtonStyles('primary');
const secondaryButton = createButtonStyles('secondary');
const dangerButton = createButtonStyles('danger');
```

#### **createModalStyles()**
Creates modal styling with backdrop and content styling.

```jsx
const modalStyles = createModalStyles();
// Returns: CSSProperties with modal styling
```

#### **createInputStyles()**
Creates input field styling with theme integration.

```jsx
const inputStyles = createInputStyles();
// Returns: CSSProperties with input styling
```

### **Utility Functions**

#### **getSpacingValue(size)**
Gets semantic spacing value.

```jsx
const padding = getSpacingValue('md'); // '1rem'
const margin = getSpacingValue('lg'); // '1.5rem'
```

## 🔄 Migration Guide

### **From Hardcoded Styles**

#### **Before**
```jsx
<div style={{
  backgroundColor: '#FF1493',
  color: '#FFFFFF',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(255, 20, 147, 0.4)'
}}>
  Content
</div>
```

#### **After**
```jsx
<div style={{
  backgroundColor: 'var(--trackside-hot-pink)',
  color: 'var(--text-primary)',
  padding: getSpacingValue('md'),
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-hot-pink)'
}}>
  Content
</div>
```

### **From CSS Classes**

#### **Before**
```jsx
<div className="bg-gradient-to-r from-[#FF1493] to-[#FF007F] text-white px-4 py-2 rounded-lg">
  Button
</div>
```

#### **After**
```jsx
<button style={createButtonStyles('primary')}>
  Button
</button>
```

### **From Mixed Theme Variables**

#### **Before**
```jsx
<div style={{
  backgroundColor: 'var(--bg-secondary)',
  borderColor: 'var(--color-border)',
  color: 'var(--text-primary)'
}}>
  Content
</div>
```

#### **After**
```jsx
<div style={{
  backgroundColor: 'var(--bg-surface)',
  border: 'var(--border-primary)',
  color: 'var(--text-primary)'
}}>
  Content
</div>
```

## 🧪 Testing

### **Theme System Testing**

#### **Unit Tests**
```typescript
// Test theme hook
import { renderHook } from '@testing-library/react';
import { useTheme } from '../useTheme';

test('useTheme returns correct theme values', () => {
  const { result } = renderHook(() => useTheme());
  
  expect(result.current.colors.primary).toBe('#FF1493');
  expect(result.current.spacing.md).toBe('1rem');
});
```

#### **Integration Tests**
```typescript
// Test component integration
import { render } from '@testing-library/react';
import { MyThemedComponent } from '../MyThemedComponent';

test('component uses theme correctly', () => {
  const { container } = render(<MyThemedComponent />);
  
  expect(container.firstChild).toHaveStyle({
    backgroundColor: 'var(--trackside-hot-pink)'
  });
});
```

### **Visual Testing**

#### **Storybook Integration**
```typescript
// Theme stories
export default {
  title: 'Theme/Components',
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#FFFFFF' }
      ]
    }
  }
};

export const PrimaryButton = () => (
  <button style={createButtonStyles('primary')}>
    Primary Button
  </button>
);
```

## 🚀 Performance

### **Optimization Techniques**

#### **Memoization**
```typescript
// Theme values are memoized for performance
const useTheme = () => {
  const theme = useMemo(() => trackSideTheme, []);
  const createCardStyles = useCallback(() => ({
    // ... card styling logic
  }), [theme]);
  
  return { theme, createCardStyles };
};
```

#### **CSS Custom Properties**
```css
/* CSS variables are computed once and reused */
:root {
  --trackside-hot-pink: #FF1493;
  /* ... other variables */
}

/* Efficient usage */
.my-component {
  background-color: var(--trackside-hot-pink);
  transition: var(--transition-normal);
}
```

#### **Bundle Optimization**
```typescript
// Tree-shaking friendly exports
export { useTheme } from './useTheme';
export { createCardStyles } from './theme-utils';
export type { TrackSideTheme } from './theme-config';
```

## 🔧 Debugging

### **Theme Debug Tools**

#### **Debug Hook**
```typescript
import { debugThemeValue } from '../theme-utils';

// Debug specific theme value
debugThemeValue('colors.primary'); // Logs: #FF1493
debugThemeValue('spacing.md'); // Logs: 1rem
```

#### **Theme Validator**
```typescript
import { validateThemeUsage } from '../theme-utils';

// Validate component theme usage
const isValid = validateThemeUsage(MyComponent);
console.log('Theme usage valid:', isValid);
```

#### **Development Mode**
```typescript
// Development-only theme debugging
if (process.env.NODE_ENV === 'development') {
  window.debugTheme = {
    getValue: debugThemeValue,
    listVariables: listThemeVariables,
    validateUsage: validateThemeUsage
  };
}
```

## 📚 Best Practices

### **1. Use Semantic Tokens**
```jsx
// ✅ Good
<div style={{ padding: getSpacingValue('md') }}>

// ❌ Avoid
<div style={{ padding: '16px' }}>
```

### **2. Use Style Generators**
```jsx
// ✅ Good
<button style={createButtonStyles('primary')}>

// ❌ Avoid
<button style={{
  backgroundColor: 'var(--trackside-hot-pink)',
  color: 'var(--text-primary)',
  padding: 'var(--spacing-sm) var(--spacing-md)',
  borderRadius: 'var(--radius-lg)'
}}>
```

### **3. Use Team Colors for Team Elements**
```jsx
// ✅ Good
const ourTeam = useTeamTheme('our');
<span style={{ color: ourTeam.colors.primary }}>

// ❌ Avoid
<span style={{ color: 'var(--trackside-hot-pink)' }}>
```

### **4. Use Status Colors for States**
```jsx
// ✅ Good
<div style={{ color: 'var(--status-success)' }}>

// ❌ Avoid
<div style={{ color: '#10B981' }}>
```

### **5. Maintain Consistency**
```jsx
// ✅ Good
const { getSpacingValue } = useTheme();
<div style={{
  padding: getSpacingValue('md'),
  margin: getSpacingValue('md'),
  gap: getSpacingValue('sm')
}}>

// ❌ Avoid mixed approaches
<div style={{
  padding: '1rem',
  margin: '16px',
  gap: '8px'
}}>
```

## 🔮 Future Enhancements

### **Planned Features**
1. **Dark Mode Support**: Automatic dark mode switching
2. **Theme Variants**: Multiple theme variants (light, dark, high contrast)
3. **Dynamic Theming**: Runtime theme customization
4. **Component Library**: Pre-built themed components
5. **Animation System**: Theme-aware animations

### **Extension Points**
1. **Custom Themes**: Support for custom theme creation
2. **Plugin System**: Theme plugin architecture
3. **Design Tokens**: Extended design token system
4. **Accessibility**: Enhanced accessibility features
5. **Performance**: Advanced performance optimizations

---

## 📞 Support

### **Getting Help**
- **Documentation**: This comprehensive guide
- **Code Examples**: Component library examples
- **Troubleshooting**: Common issues and solutions
- **Best Practices**: Development guidelines

### **Contributing**
- **Theme Updates**: Follow contribution guidelines
- **Component Updates**: Use theme system consistently
- **Documentation**: Keep documentation updated
- **Testing**: Maintain test coverage

---

*Theme system documentation maintained with comprehensive API reference, usage patterns, and best practices for Track Side unified theming.*
