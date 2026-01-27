/**
 * Dynamic Color Service for TrackSide
 * Provides dynamic opponent color generation and theme management
 */

export interface ColorPalette {
  primary: string;      // Hot pink
  secondary: string;    // Pink variants
  opponent: string;     // Dynamic contrasting color
  background: string;   // Black
  text: string;         // White/contrasting
  accent: string;       // Additional accent colors
}

export interface ColorOption {
  name: string;
  value: string;
  light: string;
  dark: string;
  bg: string;
  shadow: string;
}

export class DynamicColorService {
  private readonly HOT_PINK = '#FF1493';
  private readonly BLACK = '#000000';
  private readonly WHITE = '#FFFFFF';
  
  private readonly OPPONENT_COLORS: ColorOption[] = [
    {
      name: 'Turquoise',
      value: '#00CED1',
      light: '#40E0D0',
      dark: '#008B8B',
      bg: 'rgba(0, 206, 209, 0.1)',
      shadow: '0 0 30px rgba(0, 206, 209, 0.8)'
    },
    {
      name: 'Lime Green',
      value: '#32CD32',
      light: '#90EE90',
      dark: '#228B22',
      bg: 'rgba(50, 205, 50, 0.1)',
      shadow: '0 0 30px rgba(50, 205, 50, 0.8)'
    },
    {
      name: 'Dark Orange',
      value: '#FF8C00',
      light: '#FFA500',
      dark: '#FF6347',
      bg: 'rgba(255, 140, 0, 0.1)',
      shadow: '0 0 30px rgba(255, 140, 0, 0.8)'
    },
    {
      name: 'Royal Blue',
      value: '#4169E1',
      light: '#6495ED',
      dark: '#0000CD',
      bg: 'rgba(65, 105, 225, 0.1)',
      shadow: '0 0 30px rgba(65, 105, 225, 0.8)'
    },
    {
      name: 'Gold',
      value: '#FFD700',
      light: '#FFED4E',
      dark: '#DAA520',
      bg: 'rgba(255, 215, 0, 0.1)',
      shadow: '0 0 30px rgba(255, 215, 0, 0.8)'
    },
    {
      name: 'Tomato',
      value: '#FF6347',
      light: '#FF7F50',
      dark: '#DC143C',
      bg: 'rgba(255, 99, 71, 0.1)',
      shadow: '0 0 30px rgba(255, 99, 71, 0.8)'
    },
    {
      name: 'Medium Purple',
      value: '#9370DB',
      light: '#BA55D3',
      dark: '#663399',
      bg: 'rgba(147, 112, 219, 0.1)',
      shadow: '0 0 30px rgba(147, 112, 219, 0.8)'
    },
    {
      name: 'Light Sea Green',
      value: '#20B2AA',
      light: '#48D1CC',
      dark: '#008B8B',
      bg: 'rgba(32, 178, 170, 0.1)',
      shadow: '0 0 30px rgba(32, 178, 170, 0.8)'
    }
  ];

  /**
   * Generate a random opponent color
   */
  generateOpponentColor(): ColorOption {
    return this.OPPONENT_COLORS[Math.floor(Math.random() * this.OPPONENT_COLORS.length)];
  }

  /**
   * Get all available opponent color options
   */
  getOpponentColorOptions(): ColorOption[] {
    return this.OPPONENT_COLORS;
  }

  /**
   * Validate contrast between two colors
   */
  validateContrast(color1: string, color2: string): boolean {
    const contrast = this.calculateContrast(color1, color2);
    return contrast >= 4.5; // WCAG AA standard
  }

  /**
   * Calculate contrast ratio between two colors
   */
  calculateContrast(color1: string, color2: string): number {
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calculate relative luminance of a color
   */
  private getLuminance(color: string): number {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Apply gamma correction
    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  /**
   * Generate complete color palette
   */
  generateColorPalette(opponentColor?: string): ColorPalette {
    const opponent = opponentColor || this.generateOpponentColor().value;
    
    return {
      primary: this.HOT_PINK,
      secondary: '#FF69B4',
      opponent: opponent,
      background: this.BLACK,
      text: this.WHITE,
      accent: '#FFB6C1' // Light pink as default accent
    };
  }

  /**
   * Apply theme to DOM
   */
  applyThemeToDOM(opponentColor: ColorOption): void {
    const root = document.documentElement;
    
    // Apply TrackSide brand colors
    root.style.setProperty('--team-our-primary', this.HOT_PINK);
    root.style.setProperty('--team-our-secondary', '#FF69B4');
    root.style.setProperty('--team-our-accent', '#FFB6C1');
    root.style.setProperty('--team-our-dark', '#8B008B');
    root.style.setProperty('--team-our-bg', 'rgba(255, 20, 147, 0.1)');
    root.style.setProperty('--team-our-border', this.HOT_PINK);
    root.style.setProperty('--team-our-text', '#FFFFFF');
    root.style.setProperty('--team-our-shadow', '0 0 30px rgba(255, 20, 147, 0.8)');
    
    // Apply opponent colors
    root.style.setProperty('--team-their-primary', opponentColor.value);
    root.style.setProperty('--team-their-secondary', opponentColor.light);
    root.style.setProperty('--team-their-dark', opponentColor.dark);
    root.style.setProperty('--team-their-bg', opponentColor.bg);
    root.style.setProperty('--team-their-border', opponentColor.value);
    root.style.setProperty('--team-their-text', '#FFFFFF');
    root.style.setProperty('--team-their-shadow', opponentColor.shadow);
    
    // Apply semantic mappings
    root.style.setProperty('--score-our-color', this.HOT_PINK);
    root.style.setProperty('--score-their-color', opponentColor.value);
    root.style.setProperty('--glow-our', '0 0 30px rgba(255, 20, 147, 0.8)');
    root.style.setProperty('--glow-their', opponentColor.shadow);
  }

  /**
   * Get current theme from DOM
   */
  getCurrentTheme(): { ourColor: string; opponentColor: string } {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    
    return {
      ourColor: styles.getPropertyValue('--team-our-primary').trim(),
      opponentColor: styles.getPropertyValue('--team-their-primary').trim()
    };
  }

  /**
   * Save theme preference to localStorage
   */
  saveThemePreference(opponentColor: string): void {
    localStorage.setItem('trackside-opponent-color', opponentColor);
  }

  /**
   * Load theme preference from localStorage
   */
  loadThemePreference(): string | null {
    return localStorage.getItem('trackside-opponent-color');
  }

  /**
   * Initialize theme with saved preference or random color
   */
  initializeTheme(): void {
    const savedColor = this.loadThemePreference();
    const opponentOption = savedColor 
      ? this.OPPONENT_COLORS.find(c => c.value === savedColor) || this.generateOpponentColor()
      : this.generateOpponentColor();
    
    this.applyThemeToDOM(opponentOption);
  }

  /**
   * Validate color accessibility for all combinations
   */
  validateThemeAccessibility(opponentColor: string): {
    ourTeamOnBackground: boolean;
    opponentOnBackground: boolean;
    ourTeamOnOpponent: boolean;
    textOnBackground: boolean;
    textOnOurTeam: boolean;
    textOnOpponent: boolean;
  } {
    return {
      ourTeamOnBackground: this.validateContrast(this.HOT_PINK, this.BLACK),
      opponentOnBackground: this.validateContrast(opponentColor, this.BLACK),
      ourTeamOnOpponent: this.validateContrast(this.HOT_PINK, opponentColor),
      textOnBackground: this.validateContrast(this.WHITE, this.BLACK),
      textOnOurTeam: this.validateContrast(this.WHITE, this.HOT_PINK),
      textOnOpponent: this.validateContrast(this.WHITE, opponentColor)
    };
  }

  /**
   * Generate CSS custom properties for a color option
   */
  generateCSSVariables(colorOption: ColorOption): Record<string, string> {
    return {
      '--team-their-primary': colorOption.value,
      '--team-their-secondary': colorOption.light,
      '--team-their-dark': colorOption.dark,
      '--team-their-bg': colorOption.bg,
      '--team-their-border': colorOption.value,
      '--team-their-text': '#FFFFFF',
      '--team-their-shadow': colorOption.shadow,
      '--score-their-color': colorOption.value,
      '--glow-their': colorOption.shadow
    };
  }

  /**
   * Get color option by value
   */
  getColorOptionByValue(value: string): ColorOption | undefined {
    return this.OPPONENT_COLORS.find(c => c.value === value);
  }
}

// Export singleton instance
export const colorService = new DynamicColorService();
