/**
 * Track Side Theme React Hook
 * 
 * Provides theme access and management for React components
 * Ensures consistent theme usage across the application
 */

import { useMemo } from 'react';
import { trackSideTheme } from './theme-config';
import { 
  getThemeColors, 
  getThemeTypography, 
  getThemeEffects, 
  getThemeSpacing, 
  getThemeBorderRadius,
  getThemeComponents,
  getBrandColor,
  getSemanticColor,
  getTeamColor,
  getTypographyValue,
  getEffectValue,
  getSpacingValue,
  getBorderRadiusValue,
  getComponentStyles,
  createButtonStyles,
  createCardStyles,
  createModalStyles,
  createTeamStyles
} from './theme-utils';

/**
 * Main theme hook for accessing theme values
 */
export const useTheme = () => {
  const theme = useMemo(() => trackSideTheme, []);

  return {
    // Direct theme access
    theme,
    
    // Theme sections
    colors: useMemo(() => getThemeColors(), []),
    typography: useMemo(() => getThemeTypography(), []),
    effects: useMemo(() => getThemeEffects(), []),
    spacing: useMemo(() => getThemeSpacing(), []),
    borderRadius: useMemo(() => getThemeBorderRadius(), []),
    components: useMemo(() => getThemeComponents(), []),
    
    // Color helpers
    getBrandColor: useMemo(() => getBrandColor, []),
    getSemanticColor: useMemo(() => getSemanticColor, []),
    getTeamColor: useMemo(() => getTeamColor, []),
    
    // Typography helpers
    getTypographyValue: useMemo(() => getTypographyValue, []),
    
    // Effect helpers
    getEffectValue: useMemo(() => getEffectValue, []),
    
    // Layout helpers
    getSpacingValue: useMemo(() => getSpacingValue, []),
    getBorderRadiusValue: useMemo(() => getBorderRadiusValue, []),
    
    // Component helpers
    getComponentStyles: useMemo(() => getComponentStyles, []),
    createButtonStyles: useMemo(() => createButtonStyles, []),
    createCardStyles: useMemo(() => createCardStyles, []),
    createModalStyles: useMemo(() => createModalStyles, []),
    createTeamStyles: useMemo(() => createTeamStyles, []),
  };
};

/**
 * Hook for accessing theme colors
 */
export const useThemeColors = () => {
  const { colors, getBrandColor, getSemanticColor, getTeamColor } = useTheme();
  
  return {
    colors,
    getBrandColor,
    getSemanticColor,
    getTeamColor,
    
    // Common color shortcuts
    brand: {
      primary: getBrandColor('primary'),
      primaryLight: getBrandColor('primaryLight'),
      primaryDark: getBrandColor('primaryDark'),
      accent: getBrandColor('accent'),
    },
    
    semantic: {
      background: colors.semantic.background,
      text: colors.semantic.text,
      border: colors.semantic.border,
      status: colors.semantic.status,
    },
    
    teams: colors.teams,
  };
};

/**
 * Hook for accessing theme typography
 */
export const useThemeTypography = () => {
  const { typography, getTypographyValue } = useTheme();
  
  return {
    typography,
    getTypographyValue,
    
    // Common typography shortcuts
    families: typography.families,
    sizes: typography.sizes,
    weights: typography.weights,
  };
};

/**
 * Hook for accessing theme effects (shadows, glows, transitions)
 */
export const useThemeEffects = () => {
  const { effects, getEffectValue } = useTheme();
  
  return {
    effects,
    getEffectValue,
    
    // Common effect shortcuts
    shadows: effects.shadows,
    glows: effects.glows,
    transitions: effects.transitions,
  };
};

/**
 * Hook for accessing theme spacing and layout
 */
export const useThemeLayout = () => {
  const { spacing, borderRadius, getSpacingValue, getBorderRadiusValue } = useTheme();
  
  return {
    spacing,
    borderRadius,
    getSpacingValue,
    getBorderRadiusValue,
  };
};

/**
 * Hook for creating component styles
 */
export const useThemeComponents = () => {
  const { 
    components, 
    createButtonStyles, 
    createCardStyles, 
    createModalStyles, 
    createTeamStyles 
  } = useTheme();
  
  return {
    components,
    createButtonStyles,
    createCardStyles,
    createModalStyles,
    createTeamStyles,
  };
};

/**
 * Hook for team-specific styling
 */
export const useTeamTheme = (team: 'our' | 'their') => {
  const { getTeamColor, createTeamStyles } = useTheme();
  
  const teamColors = useMemo(() => ({
    primary: getTeamColor(team, 'primary'),
    light: getTeamColor(team, 'light'),
    dark: getTeamColor(team, 'dark'),
    background: getTeamColor(team, 'background'),
    border: getTeamColor(team, 'border'),
    text: getTeamColor(team, 'text'),
    shadow: getTeamColor(team, 'shadow'),
  }), [team, getTeamColor]);

  const teamStyles = useMemo(() => createTeamStyles(team), [team, createTeamStyles]);
  
  return {
    team,
    colors: teamColors,
    styles: teamStyles,
  };
};

/**
 * Hook for responsive theme values
 */
export const useResponsiveTheme = <T>(
  values: { base: T; sm?: T; md?: T; lg?: T; xl?: T },
  breakpoint: 'base' | 'sm' | 'md' | 'lg' | 'xl' = 'base'
) => {
  return useMemo(() => {
    return values[breakpoint] || values.base;
  }, [values, breakpoint]);
};

/**
 * Hook for theme-aware CSS-in-JS styles
 */
export const useThemeStyles = <T extends Record<string, any>>(styleFactory: (theme: typeof trackSideTheme) => T) => {
  const theme = useTheme();
  
  return useMemo(() => styleFactory(theme.theme), [theme.theme, styleFactory]);
};

/**
 * Hook for accessing CSS custom properties
 */
export const useThemeCSS = () => {
  const { theme } = useTheme();
  
  const cssVariables = useMemo(() => {
    const vars: Record<string, string> = {};
    
    const generateVariables = (obj: any, prefix: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          generateVariables(value, newPrefix);
        } else {
          vars[`--${newPrefix}`] = String(value);
        }
      }
    };
    
    generateVariables(theme);
    return vars;
  }, [theme]);
  
  return {
    cssVariables,
    getCSSVariable: (path: string) => {
      const cssVar = path.replace(/\./g, '-');
      return `var(--${cssVar})`;
    },
  };
};

/**
 * Hook for theme validation and debugging
 */
export const useThemeDebug = () => {
  const { theme } = useTheme();
  
  const debugThemeValue = (path: string) => {
    if (process.env.NODE_ENV === 'development') {
      const keys = path.split('.');
      let value: any = theme;
      
      for (const key of keys) {
        value = value[key];
        if (value === undefined) {
          console.warn(`Theme path "${path}" not found`);
          return;
        }
      }
      
      console.log(`Theme value for "${path}":`, value);
    }
  };
  
  const debugThemeColors = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Track Side Theme Colors:', theme.colors);
    }
  };
  
  const validateTheme = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Theme validation:', {
        hasColors: !!theme.colors,
        hasTypography: !!theme.typography,
        hasEffects: !!theme.effects,
        hasSpacing: !!theme.spacing,
        hasComponents: !!theme.components,
        version: theme.version,
      });
    }
  };
  
  return {
    debugThemeValue,
    debugThemeColors,
    validateTheme,
  };
};
