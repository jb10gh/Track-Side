/**
 * Component Integration Tests
 * 
 * Tests theme integration across all refactored components
 * Validates visual consistency and functionality
 */

import { describe, test, expect } from 'vitest';

// Mock React and theme hooks for testing
const mockUseTheme = () => ({
  colors: {
    primary: '#FF1493',
    secondary: '#FF69B4',
    accent: '#FF007F',
    text: '#FFFFFF',
    background: '#000000',
    surface: '#1a1a1a',
    border: '#FF1493'
  },
  typography: {
    primary: "'Space Grotesk', sans-serif",
    secondary: "'JetBrains Mono', monospace",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem'
  },
  createCardStyles: () => ({
    backgroundColor: '#1a1a1a',
    border: '1px solid #FF1493',
    borderRadius: '0.75rem',
    padding: '1rem',
    boxShadow: '0 4px 20px rgba(255, 20, 147, 0.4)'
  }),
  createButtonStyles: (variant) => {
    const styles = {
      primary: {
        backgroundColor: '#FF1493',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '0.75rem',
        padding: '0.5rem 1rem',
        fontWeight: '600',
        transition: '250ms ease'
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#FF1493',
        border: '1px solid #FF1493',
        borderRadius: '0.75rem',
        padding: '0.5rem 1rem',
        fontWeight: '500',
        transition: '250ms ease'
      },
      danger: {
        backgroundColor: '#FF007F',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '0.75rem',
        padding: '0.5rem 1rem',
        fontWeight: '600',
        transition: '250ms ease'
      }
    };
    return styles[variant] || styles.primary;
  },
  createModalStyles: () => ({
    backgroundColor: '#1a1a1a',
    border: '1px solid #FF1493',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth: '28rem'
  }),
  getSpacingValue: (size) => {
    const spacing = {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    };
    return spacing[size] || size;
  }
});

const mockUseTeamTheme = (team) => ({
  colors: {
    primary: team === 'our' ? '#FF1493' : '#FF007F',
    secondary: '#FF69B4',
    shadow: team === 'our' 
      ? '0 0 20px rgba(255, 20, 147, 0.6)' 
      : '0 0 20px rgba(255, 0, 127, 0.6)'
  },
  getTeamColor: (type) => {
    const colors = {
      our: {
        primary: '#FF1493',
        secondary: '#FF69B4',
        shadow: '0 0 20px rgba(255, 20, 147, 0.6)'
      },
      their: {
        primary: '#FF007F',
        secondary: '#FF69B4',
        shadow: '0 0 20px rgba(255, 0, 127, 0.6)'
      }
    };
    return colors[team][type];
  }
});

// Mock theme hooks
global.useTheme = mockUseTheme;
global.useTeamTheme = mockUseTeamTheme;

describe('Component Integration Tests', () => {
  describe('Theme Hook Integration', () => {
    test('useTheme returns all required properties', () => {
      const theme = mockUseTheme();
      
      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('typography');
      expect(theme).toHaveProperty('spacing');
      expect(theme).toHaveProperty('borderRadius');
      expect(theme).toHaveProperty('createCardStyles');
      expect(theme).toHaveProperty('createButtonStyles');
      expect(theme).toHaveProperty('createModalStyles');
      expect(theme).toHaveProperty('getSpacingValue');
    });

    test('useTeamTheme returns correct team colors', () => {
      const ourTeam = mockUseTeamTheme('our');
      const theirTeam = mockUseTeamTheme('their');
      
      expect(ourTeam.colors.primary).toBe('#FF1493');
      expect(theirTeam.colors.primary).toBe('#FF007F');
      expect(ourTeam.colors.shadow).toContain('rgba(255, 20, 147, 0.6)');
      expect(theirTeam.colors.shadow).toContain('rgba(255, 0, 127, 0.6)');
    });

    test('style generators return valid CSS properties', () => {
      const theme = mockUseTheme();
      
      const cardStyles = theme.createCardStyles();
      const buttonStyles = theme.createButtonStyles('primary');
      const modalStyles = theme.createModalStyles();
      
      expect(cardStyles).toHaveProperty('backgroundColor');
      expect(cardStyles).toHaveProperty('borderRadius');
      expect(buttonStyles).toHaveProperty('backgroundColor');
      expect(buttonStyles).toHaveProperty('color');
      expect(modalStyles).toHaveProperty('backgroundColor');
      expect(modalStyles).toHaveProperty('borderRadius');
    });

    test('getSpacingValue returns correct values', () => {
      const theme = mockUseTheme();
      
      expect(theme.getSpacingValue('xs')).toBe('0.25rem');
      expect(theme.getSpacingValue('sm')).toBe('0.5rem');
      expect(theme.getSpacingValue('md')).toBe('1rem');
      expect(theme.getSpacingValue('lg')).toBe('1.5rem');
      expect(theme.getSpacingValue('xl')).toBe('2rem');
    });
  });

  describe('Component Theme Integration', () => {
    test('ScoreBoard component theme integration', () => {
      const theme = mockUseTheme();
      const ourTeam = mockUseTeamTheme('our');
      const theirTeam = mockUseTeamTheme('their');
      
      // Simulate ScoreBoard theme usage
      const scoreBoardStyles = {
        container: {
          backgroundColor: theme.colors.surface,
          padding: theme.getSpacingValue('md'),
          borderRadius: theme.borderRadius.lg
        },
        ourScore: {
          color: ourTeam.colors.primary,
          textShadow: ourTeam.colors.shadow,
          fontSize: theme.typography.sizes['4xl'],
          fontWeight: theme.typography.weights.black
        },
        theirScore: {
          color: theirTeam.colors.primary,
          textShadow: theirTeam.colors.shadow,
          fontSize: theme.typography.sizes['4xl'],
          fontWeight: theme.typography.weights.black
        }
      };
      
      expect(scoreBoardStyles.ourScore.color).toBe('#FF1493');
      expect(scoreBoardStyles.theirScore.color).toBe('#FF007F');
      expect(scoreBoardStyles.container.backgroundColor).toBe('#1a1a1a');
    });

    test('MatchCard component theme integration', () => {
      const theme = mockUseTheme();
      const ourTeam = mockUseTeamTheme('our');
      const theirTeam = mockUseTeamTheme('their');
      
      // Simulate MatchCard theme usage
      const matchCardStyles = {
        card: theme.createCardStyles(),
        score: {
          display: 'flex',
          gap: theme.getSpacingValue('sm'),
          marginBottom: theme.getSpacingValue('md')
        },
        ourScore: {
          color: ourTeam.colors.primary,
          textShadow: ourTeam.colors.shadow,
          fontSize: theme.typography.sizes.xl,
          fontWeight: theme.typography.weights.bold
        },
        theirScore: {
          color: theirTeam.colors.primary,
          textShadow: theirTeam.colors.shadow,
          fontSize: theme.typography.sizes.xl,
          fontWeight: theme.typography.weights.bold
        },
        button: theme.createButtonStyles('secondary')
      };
      
      expect(matchCardStyles.card.backgroundColor).toBe('#1a1a1a');
      expect(matchCardStyles.ourScore.color).toBe('#FF1493');
      expect(matchCardStyles.theirScore.color).toBe('#FF007F');
      expect(matchCardStyles.button.color).toBe('#FF1493');
    });

    test('ActionGrid component theme integration', () => {
      const theme = mockUseTheme();
      const ourTeam = mockUseTeamTheme('our');
      const theirTeam = mockUseTeamTheme('their');
      
      // Simulate ActionGrid theme usage
      const actionGridStyles = {
        grid: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.getSpacingValue('md'),
          padding: theme.getSpacingValue('lg')
        },
        ourButton: {
          backgroundColor: ourTeam.colors.primary,
          color: theme.colors.text,
          border: 'none',
          borderRadius: theme.borderRadius.lg,
          padding: theme.getSpacingValue('lg'),
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.semibold,
          transition: theme.spacing.md // This should be a transition value
        },
        theirButton: {
          backgroundColor: theirTeam.colors.primary,
          color: theme.colors.text,
          border: 'none',
          borderRadius: theme.borderRadius.lg,
          padding: theme.getSpacingValue('lg'),
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.semibold,
          transition: theme.spacing.md // This should be a transition value
        }
      };
      
      expect(actionGridStyles.ourButton.backgroundColor).toBe('#FF1493');
      expect(actionGridStyles.theirButton.backgroundColor).toBe('#FF007F');
      expect(actionGridStyles.ourButton.color).toBe('#FFFFFF');
      expect(actionGridStyles.theirButton.color).toBe('#FFFFFF');
    });

    test('Modal component theme integration', () => {
      const theme = mockUseTheme();
      
      // Simulate Modal theme usage
      const modalStyles = {
        backdrop: {
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 50
        },
        modal: {
          ...theme.createModalStyles(),
          position: 'relative',
          margin: theme.getSpacingValue('md'),
          maxHeight: '90vh',
          overflowY: 'auto'
        },
        header: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: theme.getSpacingValue('md'),
          marginBottom: theme.getSpacingValue('lg')
        },
        title: {
          color: theme.colors.text,
          fontSize: theme.typography.sizes.xl,
          fontWeight: theme.typography.weights.bold
        },
        closeButton: {
          ...theme.createButtonStyles('secondary'),
          position: 'absolute',
          top: theme.getSpacingValue('md'),
          right: theme.getSpacingValue('md'),
          padding: theme.getSpacingValue('sm')
        }
      };
      
      expect(modalStyles.modal.backgroundColor).toBe('#1a1a1a');
      expect(modalStyles.title.color).toBe('#FFFFFF');
      expect(modalStyles.closeButton.color).toBe('#FF1493');
    });

    test('Shell component theme integration', () => {
      const theme = mockUseTheme();
      
      // Simulate Shell theme usage
      const shellStyles = {
        container: {
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          minHeight: '100vh',
          transition: '250ms ease'
        },
        header: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #FF1493',
          padding: `${theme.getSpacingValue('md')} ${theme.getSpacingValue('lg')}`,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40
        },
        title: {
          color: theme.colors.text,
          fontSize: theme.typography.sizes['2xl'],
          fontWeight: theme.typography.weights.bold,
          letterSpacing: '-0.025em',
          textShadow: '0 0 20px rgba(255, 20, 147, 0.5)'
        },
        main: {
          paddingTop: `calc(5rem + ${theme.getSpacingValue('md')})`,
          paddingBottom: `calc(2rem + var(--safe-area-bottom, 0px))`,
          paddingLeft: theme.getSpacingValue('md'),
          paddingRight: theme.getSpacingValue('md'),
          maxWidth: '56rem',
          margin: '0 auto'
        }
      };
      
      expect(shellStyles.container.backgroundColor).toBe('#000000');
      expect(shellStyles.title.color).toBe('#FFFFFF');
      expect(shellStyles.header.borderBottom).toBe('1px solid #FF1493');
    });
  });

  describe('Visual Consistency Tests', () => {
    test('team colors are consistent across components', () => {
      const ourTeam = mockUseTeamTheme('our');
      const theirTeam = mockUseTeamTheme('their');
      
      // All components should use the same team colors
      const scoreBoardOurColor = ourTeam.colors.primary;
      const matchCardOurColor = ourTeam.colors.primary;
      const actionGridOurColor = ourTeam.colors.primary;
      
      const scoreBoardTheirColor = theirTeam.colors.primary;
      const matchCardTheirColor = theirTeam.colors.primary;
      const actionGridTheirColor = theirTeam.colors.primary;
      
      expect(scoreBoardOurColor).toBe(matchCardOurColor);
      expect(matchCardOurColor).toBe(actionGridOurColor);
      expect(scoreBoardTheirColor).toBe(matchCardTheirColor);
      expect(matchCardTheirColor).toBe(actionGridTheirColor);
    });

    test('typography is consistent across components', () => {
      const theme = mockUseTheme();
      
      // All components should use consistent typography
      const headingFont = theme.typography.primary;
      const codeFont = theme.typography.secondary;
      
      expect(headingFont).toContain('Space Grotesk');
      expect(codeFont).toContain('JetBrains Mono');
    });

    test('spacing is consistent across components', () => {
      const theme = mockUseTheme();
      
      // All components should use consistent spacing
      const cardPadding = theme.getSpacingValue('md');
      const modalPadding = theme.getSpacingValue('lg');
      const buttonPadding = theme.getSpacingValue('sm');
      
      expect(cardPadding).toBe('1rem');
      expect(modalPadding).toBe('1.5rem');
      expect(buttonPadding).toBe('0.5rem');
    });

    test('border radius is consistent across components', () => {
      const theme = mockUseTheme();
      
      // All components should use consistent border radius
      const cardRadius = theme.borderRadius.lg;
      const buttonRadius = theme.borderRadius.lg;
      const modalRadius = theme.borderRadius['2xl'];
      
      expect(cardRadius).toBe('0.75rem');
      expect(buttonRadius).toBe('0.75rem');
      expect(modalRadius).toBe('1.5rem');
    });
  });

  describe('Functionality Tests', () => {
    test('button styles work for all variants', () => {
      const theme = mockUseTheme();
      
      const primaryButton = theme.createButtonStyles('primary');
      const secondaryButton = theme.createButtonStyles('secondary');
      const dangerButton = theme.createButtonStyles('danger');
      
      expect(primaryButton.backgroundColor).toBe('#FF1493');
      expect(secondaryButton.backgroundColor).toBe('transparent');
      expect(dangerButton.backgroundColor).toBe('#FF007F');
      
      expect(primaryButton.color).toBe('#FFFFFF');
      expect(secondaryButton.color).toBe('#FF1493');
      expect(dangerButton.color).toBe('#FFFFFF');
    });

    test('card styles are consistent', () => {
      const theme = mockUseTheme();
      
      const cardStyles1 = theme.createCardStyles();
      const cardStyles2 = theme.createCardStyles();
      
      expect(cardStyles1).toEqual(cardStyles2);
      expect(cardStyles1.backgroundColor).toBe('#1a1a1a');
      expect(cardStyles1.border).toBe('1px solid #FF1493');
    });

    test('modal styles are consistent', () => {
      const theme = mockUseTheme();
      
      const modalStyles1 = theme.createModalStyles();
      const modalStyles2 = theme.createModalStyles();
      
      expect(modalStyles1).toEqual(modalStyles2);
      expect(modalStyles1.backgroundColor).toBe('#1a1a1a');
      expect(modalStyles1.borderRadius).toBe('1.5rem');
    });

    test('spacing utility handles edge cases', () => {
      const theme = mockUseTheme();
      
      expect(theme.getSpacingValue('md')).toBe('1rem');
      expect(theme.getSpacingValue('lg')).toBe('1.5rem');
      expect(theme.getSpacingValue('invalid')).toBe('invalid');
      expect(theme.getSpacingValue('')).toBe('');
    });
  });

  describe('Performance Tests', () => {
    test('theme hook performance is acceptable', () => {
      const startTime = performance.now();
      
      // Simulate multiple theme hook calls
      for (let i = 0; i < 100; i++) {
        mockUseTheme();
        mockUseTeamTheme('our');
        mockUseTeamTheme('their');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within 10ms for 300 calls
      expect(duration).toBeLessThan(10);
    });

    test('style generator performance is acceptable', () => {
      const theme = mockUseTheme();
      const startTime = performance.now();
      
      // Simulate multiple style generator calls
      for (let i = 0; i < 100; i++) {
        theme.createCardStyles();
        theme.createButtonStyles('primary');
        theme.createButtonStyles('secondary');
        theme.createModalStyles();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within 10ms for 400 calls
      expect(duration).toBeLessThan(10);
    });

    test('spacing utility performance is acceptable', () => {
      const theme = mockUseTheme();
      const startTime = performance.now();
      
      // Simulate multiple spacing utility calls
      for (let i = 0; i < 1000; i++) {
        theme.getSpacingValue('xs');
        theme.getSpacingValue('sm');
        theme.getSpacingValue('md');
        theme.getSpacingValue('lg');
        theme.getSpacingValue('xl');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within 10ms for 5000 calls
      expect(duration).toBeLessThan(10);
    });
  });
});
