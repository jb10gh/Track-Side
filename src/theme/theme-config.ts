/**
 * Track Side Unified Theme Configuration
 * 
 * Centralized theme system for consistent branding across all components
 * Provides semantic tokens, design patterns, and brand governance
 */

export interface TrackSideTheme {
  name: 'track-side';
  version: '1.0.0';
  
  colors: {
    brand: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      accent: string;
    };
    semantic: {
      background: {
        primary: string;
        secondary: string;
        surface: string;
        overlay: string;
      };
      text: {
        primary: string;
        secondary: string;
        muted: string;
        disabled: string;
      };
      border: {
        primary: string;
        secondary: string;
        subtle: string;
      };
      status: {
        success: string;
        warning: string;
        error: string;
        info: string;
      };
    };
    teams: {
      our: {
        primary: string;
        light: string;
        dark: string;
        background: string;
        border: string;
        text: string;
        shadow: string;
      };
      their: {
        primary: string;
        light: string;
        dark: string;
        background: string;
        border: string;
        text: string;
        shadow: string;
      };
    };
  };
  
  typography: {
    families: {
      primary: string;
      mono: string;
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
    weights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      black: number;
    };
  };
  
  effects: {
    shadows: {
      brand: string;
      card: string;
      button: string;
      modal: string;
    };
    glows: {
      brand: string;
      accent: string;
      subtle: string;
    };
    transitions: {
      fast: string;
      normal: string;
      slow: string;
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
  };
  
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  
  components: {
    button: {
      primary: {
        background: string;
        hover: string;
        active: string;
        text: string;
        shadow: string;
      };
      secondary: {
        background: string;
        hover: string;
        active: string;
        text: string;
        border: string;
      };
      ghost: {
        background: string;
        hover: string;
        active: string;
        text: string;
      };
    };
    card: {
      background: string;
      border: string;
      shadow: string;
      padding: string;
    };
    modal: {
      background: string;
      border: string;
      shadow: string;
      overlay: string;
    };
  };
}

export const trackSideTheme: TrackSideTheme = {
  name: 'track-side',
  version: '1.0.0',
  
  colors: {
    brand: {
      primary: '#FF1493',      // Hot Pink
      primaryLight: '#FF69B4',  // Neon Pink
      primaryDark: '#C71585',   // Deep Pink
      accent: '#FF007F',        // Electric Pink
    },
    
    semantic: {
      background: {
        primary: '#000000',     // Pure Black
        secondary: '#0a0a0a',   // Dark Black
        surface: '#000000',      // Surface Black
        overlay: 'rgba(0, 0, 0, 0.8)', // Black Overlay
      },
      text: {
        primary: '#FFFFFF',      // Pure White
        secondary: '#FF1493',   // Brand Pink
        muted: '#E0E0E0',        // Light Gray
        disabled: '#808080',     // Gray
      },
      border: {
        primary: '#FF1493',      // Brand Pink
        secondary: 'rgba(255, 20, 147, 0.3)', // Pink with opacity
        subtle: 'rgba(255, 255, 255, 0.1)', // White with opacity
      },
      status: {
        success: '#FF1493',      // Pink for success
        warning: '#FF69B4',      // Light Pink for warning
        error: '#FF007F',        // Electric Pink for error
        info: '#C71585',         // Deep Pink for info
      },
    },
    
    teams: {
      our: {
        primary: '#FF1493',      // Hot Pink
        light: '#FF69B4',        // Neon Pink
        dark: '#C71585',         // Deep Pink
        background: 'rgba(255, 20, 147, 0.15)', // Pink background
        border: '#FF1493',       // Pink border
        text: '#FFFFFF',         // White text
        shadow: '0 0 40px rgba(255, 20, 147, 0.9)', // Pink glow
      },
      their: {
        primary: '#FF007F',      // Electric Pink
        light: '#FF69B4',        // Neon Pink
        dark: '#C71585',         // Deep Pink
        background: 'rgba(255, 0, 127, 0.15)', // Electric Pink background
        border: '#FF007F',       // Electric Pink border
        text: '#FFFFFF',         // White text
        shadow: '0 0 40px rgba(255, 0, 127, 0.9)', // Electric Pink glow
      },
    },
  },
  
  typography: {
    families: {
      primary: "'Space Grotesk', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
  },
  
  effects: {
    shadows: {
      brand: '0 6px 30px rgba(255, 20, 147, 0.6)',      // Brand shadow
      card: '0 4px 20px rgba(0, 0, 0, 0.4)',         // Card shadow
      button: '0 4px 20px rgba(255, 20, 147, 0.4)',    // Button shadow
      modal: '0 20px 40px rgba(0, 0, 0, 0.6)',         // Modal shadow
    },
    glows: {
      brand: '0 0 40px rgba(255, 20, 147, 0.9)',       // Brand glow
      accent: '0 0 50px rgba(255, 105, 180, 0.8)',     // Accent glow
      subtle: '0 0 20px rgba(255, 20, 147, 0.4)',      // Subtle glow
    },
    transitions: {
      fast: '150ms ease',
      normal: '300ms ease',
      slow: '500ms ease',
    },
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  borderRadius: {
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
  },
  
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #FF1493, #FF007F)',
        hover: 'linear-gradient(135deg, #FF69B4, #FF1493)',
        active: 'linear-gradient(135deg, #C71585, #FF1493)',
        text: '#FFFFFF',
        shadow: '0 4px 20px rgba(255, 20, 147, 0.4)',
      },
      secondary: {
        background: 'transparent',
        hover: 'rgba(255, 20, 147, 0.1)',
        active: 'rgba(255, 20, 147, 0.2)',
        text: '#FF1493',
        border: '2px solid #FF1493',
      },
      ghost: {
        background: 'transparent',
        hover: 'rgba(255, 255, 255, 0.1)',
        active: 'rgba(255, 255, 255, 0.2)',
        text: '#FFFFFF',
      },
    },
    card: {
      background: '#000000',
      border: '2px solid #FF1493',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      padding: '1.5rem',
    },
    modal: {
      background: '#000000',
      border: '2px solid #FF1493',
      shadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
  },
};

// Theme utility functions
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

export const getTeamColors = (team: 'our' | 'their') => {
  return trackSideTheme.colors.teams[team];
};

export const getButtonStyles = (variant: 'primary' | 'secondary' | 'ghost') => {
  return trackSideTheme.components.button[variant];
};

export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info') => {
  return trackSideTheme.colors.semantic.status[status];
};
