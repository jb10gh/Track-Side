/**
 * Track Side Theme Utilities
 * 
 * Helper functions and hooks for theme management
 * Provides consistent theme access and manipulation
 */

import { trackSideTheme } from './theme-config';

// Theme getter functions
export const getThemeColors = () => trackSideTheme.colors;

export const getThemeTypography = () => trackSideTheme.typography;

export const getThemeEffects = () => trackSideTheme.effects;

export const getThemeSpacing = () => trackSideTheme.spacing;

export const getThemeBorderRadius = () => trackSideTheme.borderRadius;

export const getThemeComponents = () => trackSideTheme.components;

// Specific theme value getters
export const getBrandColor = (variant: 'primary' | 'primaryLight' | 'primaryDark' | 'accent') => {
  return trackSideTheme.colors.brand[variant];
};

export const getSemanticColor = (type: 'background' | 'text' | 'border' | 'status', variant?: string) => {
  const colors = trackSideTheme.colors.semantic[type];
  return variant ? colors[variant as keyof typeof colors] : colors;
};

export const getTeamColor = (team: 'our' | 'their', property: keyof typeof trackSideTheme.colors.teams.our) => {
  return trackSideTheme.colors.teams[team][property];
};

export const getTypographyValue = (type: 'families' | 'sizes' | 'weights', variant: string) => {
  return trackSideTheme.typography[type][variant as keyof typeof trackSideTheme.typography[typeof type]];
};

export const getEffectValue = (type: 'shadows' | 'glows' | 'transitions', variant: string) => {
  return trackSideTheme.effects[type][variant as keyof typeof trackSideTheme.effects[typeof type]];
};

export const getSpacingValue = (size: keyof typeof trackSideTheme.spacing) => {
  return trackSideTheme.spacing[size];
};

export const getBorderRadiusValue = (size: keyof typeof trackSideTheme.borderRadius) => {
  return trackSideTheme.borderRadius[size];
};

export const getComponentStyles = (component: keyof typeof trackSideTheme.components, variant?: string) => {
  const comp = trackSideTheme.components[component];
  return variant ? comp[variant as keyof typeof comp] : comp;
};

// CSS custom property generators
export const generateCSSVariable = (path: string, value: string): string => {
  const cssVar = path.replace(/\./g, '-');
  return `--${cssVar}: ${value};`;
};

export const generateThemeCSS = (): string => {
  let css = ':root {\n';
  
  // Generate all CSS variables from theme config
  const generateVariables = (obj: any, prefix: string = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const newPrefix = prefix ? `${prefix}-${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        generateVariables(value, newPrefix);
      } else {
        css += `  --${newPrefix}: ${value};\n`;
      }
    }
  };
  
  generateVariables(trackSideTheme);
  css += '}\n';
  
  return css;
};

// Style object generators for React components
export const createButtonStyles = (variant: 'primary' | 'secondary' | 'ghost') => {
  const styles = trackSideTheme.components.button[variant];
  
  return {
    background: styles.background,
    color: styles.text,
    border: (styles as any).border || 'none',
    boxShadow: (styles as any).shadow || 'none',
    transition: trackSideTheme.effects.transitions.normal,
    cursor: 'pointer',
    borderRadius: trackSideTheme.borderRadius.md,
    padding: `${trackSideTheme.spacing.sm} ${trackSideTheme.spacing.md}`,
    fontFamily: trackSideTheme.typography.families.primary,
    fontWeight: trackSideTheme.typography.weights.semibold,
    fontSize: trackSideTheme.typography.sizes.base,
  };
};

export const createCardStyles = () => {
  const styles = trackSideTheme.components.card;
  
  return {
    background: styles.background,
    border: styles.border,
    boxShadow: styles.shadow,
    padding: styles.padding,
    borderRadius: trackSideTheme.borderRadius.lg,
    fontFamily: trackSideTheme.typography.families.primary,
  };
};

export const createModalStyles = () => {
  const styles = trackSideTheme.components.modal;
  
  return {
    background: styles.background,
    border: styles.border,
    boxShadow: styles.shadow,
    borderRadius: trackSideTheme.borderRadius.xl,
    fontFamily: trackSideTheme.typography.families.primary,
  };
};

export const createTeamStyles = (team: 'our' | 'their') => {
  const teamColors = trackSideTheme.colors.teams[team];
  
  return {
    color: teamColors.primary,
    backgroundColor: teamColors.background,
    borderColor: teamColors.border,
    boxShadow: teamColors.shadow,
    textShadow: `0 0 10px ${teamColors.primary}`,
  };
};

// Responsive design helpers
export const getResponsiveValue = <T>(values: { base: T; sm?: T; md?: T; lg?: T; xl?: T }, breakpoint: 'base' | 'sm' | 'md' | 'lg' | 'xl' = 'base') => {
  return values[breakpoint] || values.base;
};

// Theme validation helpers
export const validateThemeColor = (color: string): boolean => {
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\([^)]+\)$/;
  return colorRegex.test(color);
};

export const validateThemeValue = (path: string): boolean => {
  try {
    const keys = path.split('.');
    let value: any = trackSideTheme;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// Helper function to get theme value by path
export const getThemeValue = (path: string): string => {
  const keys = path.split('.');
  let value: any = trackSideTheme;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Theme path "${path}" not found`);
      return '';
    }
  }
  
  return value as string;
};

// Theme migration helpers
export const migrateOldThemeValue = (oldValue: string): string => {
  const migrations: Record<string, string> = {
    '#FF1493': 'var(--brand-primary)',
    '#FF69B4': 'var(--brand-primary-light)',
    '#C71585': 'var(--brand-primary-dark)',
    '#FF007F': 'var(--brand-accent)',
    '#000000': 'var(--bg-primary)',
    '#FFFFFF': 'var(--text-primary)',
    'rgba(255, 20, 147, 0.6)': 'var(--shadow-brand)',
    '0 0 40px rgba(255, 20, 147, 0.9)': 'var(--glow-brand)',
  };
  
  return migrations[oldValue] || oldValue;
};

// Performance optimization helpers
export const createMemoizedThemeGetter = <T>(getter: () => T) => {
  let cachedValue: T | null = null;
  
  return (): T => {
    if (cachedValue === null) {
      cachedValue = getter();
    }
    return cachedValue;
  };
};

// Export memoized getters for performance
export const getMemoizedThemeColors = createMemoizedThemeGetter(getThemeColors);
export const getMemoizedThemeTypography = createMemoizedThemeGetter(getThemeTypography);
export const getMemoizedThemeEffects = createMemoizedThemeGetter(getThemeEffects);

// Type guards for theme values
export const isThemeColor = (value: unknown): value is keyof typeof trackSideTheme.colors => {
  return typeof value === 'string' && value in trackSideTheme.colors;
};

export const isThemeComponent = (value: unknown): value is keyof typeof trackSideTheme.components => {
  return typeof value === 'string' && value in trackSideTheme.components;
};

// Theme debugging helpers
export const debugThemeValue = (path: string): void => {
  if (process.env.NODE_ENV === 'development') {
    const value = getThemeValue(path);
    console.log(`Theme value for "${path}":`, value);
  }
};

export const debugThemeColors = (): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Track Side Theme Colors:', trackSideTheme.colors);
  }
};
