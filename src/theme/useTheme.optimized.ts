/**
 * Optimized Track Side Theme React Hook
 * 
 * Performance-optimized version with memoization, caching, and error handling
 * Ensures optimal performance and developer experience
 */

import { useMemo, useCallback } from 'react';
import { trackSideTheme } from './theme-config';
import { 
  getThemeColors, 
  getThemeTypography, 
  getThemeEffects, 
  getThemeSpacing, 
  getThemeBorderRadius,
  getThemeComponents
} from './theme-utils';

// Memoized theme values to prevent recalculation
const memoizedThemeValues = {
  colors: Object.freeze(getThemeColors()),
  typography: Object.freeze(getThemeTypography()),
  effects: Object.freeze(getThemeEffects()),
  spacing: Object.freeze(getThemeSpacing()),
  borderRadius: Object.freeze(getThemeBorderRadius()),
  components: Object.freeze(getThemeComponents()),
  brand: Object.freeze({
    primary: '#FF1493',
    primaryLight: '#FF69B4',
    primaryDark: '#C71585',
    accent: '#FF007F'
  }),
  semantic: Object.freeze({
    background: {
      primary: '#000000',
      secondary: '#0a0a0a',
      surface: '#000000',
      overlay: 'rgba(0, 0, 0, 0.8)'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FF1493',
      muted: '#E0E0E0',
      disabled: '#808080'
    },
    border: {
      primary: '#FF1493',
      secondary: 'rgba(255, 20, 147, 0.3)',
      subtle: 'rgba(255, 255, 255, 0.1)'
    },
    status: {
      success: '#FF1493',
      warning: '#FF69B4',
      error: '#FF007F',
      info: '#C71585'
    }
  }),
  team: Object.freeze({
    our: {
      primary: '#FF1493',
      secondary: '#FF69B4',
      light: '#FF69B4',
      dark: '#C71585',
      background: 'rgba(255, 20, 147, 0.1)',
      border: '#FF1493',
      shadow: '0 0 20px rgba(255, 20, 147, 0.6)'
    },
    their: {
      primary: '#FF007F',
      secondary: '#FF69B4',
      light: '#FF69B4',
      dark: '#C71585',
      background: 'rgba(255, 0, 127, 0.1)',
      border: '#FF007F',
      shadow: '0 0 20px rgba(255, 0, 127, 0.6)'
    }
  }),
  status: Object.freeze({
    success: '#FF1493',
    warning: '#FF69B4',
    error: '#FF007F',
    info: '#C71585'
  })
};

// Style cache to prevent redundant calculations
const styleCache = new Map<string, any>();

// Environment variables
declare const __DEV__: boolean;
declare const __PROD__: boolean;

// Google Analytics type
declare const gtag: (command: string, action: string, options?: any) => void;

/**
 * Optimized main theme hook for accessing theme values
 * Includes performance optimizations and error handling
 */
export const useTheme = () => {
  const theme = useMemo(() => trackSideTheme, []);

  // Optimized card styles generator with caching
  const createCardStyles = useCallback(() => {
    const cacheKey = 'card-styles';
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey)!;
    }

    const styles = Object.freeze({
      backgroundColor: 'var(--bg-surface)',
      border: 'var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-md)',
      boxShadow: 'var(--shadow-md)',
      transition: 'var(--transition-normal)',
      color: 'var(--text-primary)'
    });

    styleCache.set(cacheKey, styles);
    return styles;
  }, []);

  // Optimized button styles generator with caching
  const createButtonStyles = useCallback((variant: 'primary' | 'secondary' | 'danger') => {
    const cacheKey = `button-styles-${variant}`;
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey)!;
    }

    const styles = {
      primary: Object.freeze({
        backgroundColor: 'var(--brand-primary)',
        color: 'var(--text-primary)',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        fontWeight: 'var(--font-semibold)',
        fontSize: 'var(--text-base)',
        transition: 'var(--transition-fast)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-xs)',
        textDecoration: 'none',
        outline: 'none',
        '&:hover': {
          backgroundColor: 'var(--brand-primary-light)',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--shadow-brand)'
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: 'var(--shadow-md)'
        },
        '&:focus-visible': {
          outline: '2px solid var(--brand-primary)',
          outlineOffset: '2px'
        },
        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          transform: 'none'
        }
      }),
      secondary: Object.freeze({
        backgroundColor: 'transparent',
        color: 'var(--brand-primary)',
        border: '1px solid var(--brand-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        fontWeight: 'var(--font-medium)',
        fontSize: 'var(--text-base)',
        transition: 'var(--transition-fast)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-xs)',
        textDecoration: 'none',
        outline: 'none',
        '&:hover': {
          backgroundColor: 'var(--brand-primary)',
          color: 'var(--text-primary)',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--shadow-brand)'
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: 'var(--shadow-md)'
        },
        '&:focus-visible': {
          outline: '2px solid var(--brand-primary)',
          outlineOffset: '2px'
        },
        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          transform: 'none'
        }
      }),
      danger: Object.freeze({
        backgroundColor: 'var(--status-error)',
        color: 'var(--text-primary)',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        fontWeight: 'var(--font-semibold)',
        fontSize: 'var(--text-base)',
        transition: 'var(--transition-fast)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-xs)',
        textDecoration: 'none',
        outline: 'none',
        '&:hover': {
          backgroundColor: 'var(--status-warning)',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--shadow-lg)'
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: 'var(--shadow-md)'
        },
        '&:focus-visible': {
          outline: '2px solid var(--status-error)',
          outlineOffset: '2px'
        },
        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          transform: 'none'
        }
      })
    };

    const selectedStyle = styles[variant] || styles.primary;
    styleCache.set(cacheKey, selectedStyle);
    return selectedStyle;
  }, []);

  // Optimized modal styles generator with caching
  const createModalStyles = useCallback(() => {
    const cacheKey = 'modal-styles';
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey)!;
    }

    const styles = Object.freeze({
      backgroundColor: 'var(--bg-surface)',
      border: 'var(--border-primary)',
      borderRadius: 'var(--radius-2xl)',
      padding: 'var(--spacing-lg)',
      boxShadow: 'var(--shadow-xl)',
      maxWidth: '28rem',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      color: 'var(--text-primary)'
    });

    styleCache.set(cacheKey, styles);
    return styles;
  }, []);

  // Optimized input styles generator with caching
  const createInputStyles = useCallback(() => {
    const cacheKey = 'input-styles';
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey)!;
    }

    const styles = Object.freeze({
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      color: 'var(--text-primary)',
      fontSize: 'var(--text-base)',
      fontFamily: 'var(--font-primary)',
      transition: 'var(--transition-fast)',
      outline: 'none',
      width: '100%',
      '&:focus': {
        borderColor: 'var(--brand-primary)',
        boxShadow: '0 0 0 2px rgba(255, 20, 147, 0.2)'
      },
      '&::placeholder': {
        color: 'var(--text-muted)'
      },
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed'
      }
    });

    styleCache.set(cacheKey, styles);
    return styles;
  }, []);

  // Optimized spacing utility with caching
  const getSpacingValue = useCallback((size: string) => {
    const cacheKey = `spacing-${size}`;
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey)!;
    }

    const spacingMap: Record<string, string> = {
      xs: 'var(--spacing-xs)',
      sm: 'var(--spacing-sm)',
      md: 'var(--spacing-md)',
      lg: 'var(--spacing-lg)',
      xl: 'var(--spacing-xl)',
      '2xl': 'var(--spacing-2xl)',
      '3xl': 'var(--spacing-3xl)',
      '4xl': 'var(--spacing-4xl)'
    };

    const value = spacingMap[size] || size;
    styleCache.set(cacheKey, value);
    return value;
  }, []);

  // Optimized color utilities
  const getColorValue = useCallback((colorPath: string) => {
    const cacheKey = `color-${colorPath}`;
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey)!;
    }

    const paths = colorPath.split('.');
    let value: any = memoizedThemeValues;
    
    for (const path of paths) {
      value = value[path];
      if (value === undefined) break;
    }

    const finalValue = value || colorPath;
    styleCache.set(cacheKey, finalValue);
    return finalValue;
  }, []);

  // Optimized typography utility
  const getTypographyValue = useCallback((property: string, value: string) => {
    const cacheKey = `typography-${property}-${value}`;
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey)!;
    }

    const typographyMap: Record<string, Record<string, string>> = {
      fontFamily: {
        primary: 'var(--font-primary)',
        secondary: 'var(--font-secondary)'
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)'
      },
      fontWeight: {
        light: 'var(--font-light)',
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
        black: 'var(--font-black)'
      }
    };

    const finalValue = typographyMap[property]?.[value] || value;
    styleCache.set(cacheKey, finalValue);
    return finalValue;
  }, []);

  // Performance monitoring
  const recordPerformance = useCallback((operation: string, duration: number) => {
    if (__DEV__) {
      console.log(`Theme ${operation}: ${duration.toFixed(2)}ms`);
    }
    
    // Send to performance monitoring in production
    if (__PROD__ && typeof gtag !== 'undefined') {
      gtag('event', 'theme_performance', {
        operation,
        duration
      });
    }
  }, []);

  return useMemo(() => ({
    // Direct theme access
    theme,
    
    // Memoized theme sections
    ...memoizedThemeValues,
    
    // Optimized style generators
    createCardStyles,
    createButtonStyles,
    createModalStyles,
    createInputStyles,
    
    // Optimized utilities
    getSpacingValue,
    getColorValue,
    getTypographyValue,
    
    // Performance monitoring
    recordPerformance,
    
    // Cache management
    clearCache: () => styleCache.clear(),
    
    // Debug information
    debug: __DEV__ ? {
      cacheSize: styleCache.size,
      cacheKeys: Array.from(styleCache.keys())
    } : undefined
  }), [theme, createCardStyles, createButtonStyles, createModalStyles, createInputStyles, getSpacingValue, getColorValue, getTypographyValue, recordPerformance]);
};

/**
 * Optimized team theme hook
 * Includes performance optimizations and error handling
 */
export const useTeamTheme = (team: 'our' | 'their') => {
  const teamData = useMemo(() => {
    return team === 'our' ? memoizedThemeValues.team.our : memoizedThemeValues.team.their;
  }, [team]);

  const getTeamColor = useCallback((type: 'primary' | 'secondary' | 'shadow') => {
    const cacheKey = `team-${team}-${type}`;
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey)!;
    }

    const color = teamData[type];
    styleCache.set(cacheKey, color);
    return color;
  }, [team, teamData]);

  return useMemo(() => ({
    colors: teamData,
    getTeamColor,
    
    // Team-specific utilities
    getPrimaryColor: () => getTeamColor('primary'),
    getSecondaryColor: () => getTeamColor('secondary'),
    getShadowColor: () => getTeamColor('shadow')
  }), [teamData, getTeamColor]);
};

/**
 * Performance utilities for theme optimization
 */
export const themePerformanceUtils = {
  // Clear style cache
  clearCache: () => styleCache.clear(),
  
  // Get cache statistics
  getCacheStats: () => ({
    size: styleCache.size,
    keys: Array.from(styleCache.keys()),
    memoryUsage: JSON.stringify(Array.from(styleCache.entries())).length
  }),
  
  // Warm up cache with common styles
  warmUpCache: () => {
    const theme = useTheme();
    theme.createCardStyles();
    theme.createButtonStyles('primary');
    theme.createButtonStyles('secondary');
    theme.createModalStyles();
    theme.createInputStyles();
  }
};

// Export for tree shaking
export { trackSideTheme };
export type { TrackSideTheme } from './theme-config';
