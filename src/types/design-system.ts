/**
 * Design System Types for Track Side UX/UI Evolution
 * 
 * Athletic Intelligence Design System - Smart, responsive, performance-focused UX
 */

// Branded types for domain modeling
type Brand<K, T> = K & { __brand: T };
type DesignTokenId = Brand<string, 'DesignTokenId'>;

// Core design system interface
export interface DesignSystem {
  mode: UIMode;
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  animations: AnimationConfig;
  interactions: InteractionConfig;
}

// Behavioral modes for adaptive UI
export type UIMode = 'SETUP' | 'STANDARD' | 'INTENSIVE' | 'ONE_HAND' | 'ANALYSIS';

// Game context for UI state calculation
export interface GameContext {
  isRunning: boolean;
  events: GameEvent[];
  scoreDifference: number;
  timeInGame: number;
  opponentName: string;
  myScore: number;
  opponentScore: number;
}

// User context for personalization
export interface UserContext {
  isOneHanded: boolean;
  prefersHaptic: boolean;
  prefersAudio: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  touchCapabilities: TouchCapabilities;
}

// Touch capabilities for gesture recognition
export interface TouchCapabilities {
  supportsHaptic: boolean;
  supportsGestures: boolean;
  maxTouchPoints: number;
  hasForceTouch: boolean;
}

// Complete UI state with all adaptive properties
export interface UIState {
  mode: UIMode;
  layout: LayoutConfig;
  interactions: InteractionConfig;
  feedback: FeedbackConfig;
  performance: PerformanceConfig;
}

// Layout configuration based on mode and context
export interface LayoutConfig {
  type: 'stacked' | 'side-by-side' | 'thumb-optimized' | 'compact';
  primaryActionZone: 'top' | 'bottom' | 'left' | 'right' | 'center';
  density: 'comfortable' | 'compact' | 'spacious';
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// Interaction configuration for different modes
export interface InteractionConfig {
  primaryActions: ActionType[];
  gestureSupport: GestureSupport;
  touchTargetSize: number;
  feedbackDelay: number;
  animationDuration: number;
}

// Gesture support configuration
export interface GestureSupport {
  tap: boolean;
  longPress: boolean;
  swipe: boolean;
  pinch: boolean;
  doubleTap: boolean;
}

// Feedback configuration for haptic and audio
export interface FeedbackConfig {
  haptic: HapticConfig;
  audio: AudioConfig;
  visual: VisualConfig;
}

// Haptic feedback configuration
export interface HapticConfig {
  enabled: boolean;
  intensity: 'light' | 'medium' | 'strong';
  patterns: Record<string, number[]>;
}

// Audio feedback configuration
export interface AudioConfig {
  enabled: boolean;
  volume: number;
  sounds: Record<string, string>;
}

// Visual feedback configuration
export interface VisualConfig {
  animations: boolean;
  reducedMotion: boolean;
  contrast: 'normal' | 'high' | 'low';
}

// Performance configuration for optimization
export interface PerformanceConfig {
  renderMode: 'sync' | 'async' | 'deferred';
  updateInterval: number;
  maxFPS: number;
  batteryOptimization: boolean;
}

// Color palette for different modes
export interface ColorPalette {
  primary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  surface: string[];
  text: string[];
}

// Typography scale for consistent text styling
export interface TypographyScale {
  display: {
    fontFamily: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
  heading: {
    fontFamily: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
  body: {
    fontFamily: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
  data: {
    fontFamily: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
}

// Spacing scale for consistent layout
export interface SpacingScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  scale: number; // Base multiplier for responsive scaling
}

// Animation configuration for smooth interactions
export interface AnimationConfig {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  spring: {
    tension: number;
    friction: number;
  };
}

// Action types for game events
export type ActionType = 'GOAL' | 'PENALTY' | 'TIMEOUT' | 'SUBSTITUTION' | 'FOUL' | 'ASSIST' | 'SAVE' | 'UNDO' | 'EXPORT' | 'SHARE';

// Game event interface
export interface GameEvent {
  id: string;
  type: ActionType;
  team: 'OUR' | 'OPPONENT';
  timestamp: number;
  gameTime: number;
  label?: string;
  meta?: Record<string, any>;
}

// Touch event interface
export interface TouchEvent {
  type: 'tap' | 'longPress' | 'swipe' | 'pinch' | 'doubleTap';
  position: { x: number; y: number };
  timestamp: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  velocity?: number;
}

// Gesture recognition result
export interface GestureResult {
  gesture: TouchEvent['type'];
  confidence: number;
  action?: ActionType;
  parameters?: Record<string, any>;
}

// Performance metrics for monitoring
export interface PerformanceMetrics {
  renderTime: number;
  interactionLatency: number;
  memoryUsage: number;
  batteryImpact: number;
  errorRate: number;
}

// Component props interface for evolved components
export interface EvolvedComponentProps {
  gameState: GameContext;
  userContext: UserContext;
  uiState: UIState;
  onAction?: (action: ActionType, team: 'OUR' | 'OPPONENT') => void;
  onModeChange?: (mode: UIMode) => void;
}

// Design token interface for CSS variables
export interface DesignToken {
  id: DesignTokenId;
  category: 'color' | 'typography' | 'spacing' | 'animation' | 'interaction';
  name: string;
  value: string | number;
  mode?: UIMode;
}

// Theme configuration for CSS custom properties
export interface ThemeConfig {
  mode: UIMode;
  tokens: Record<string, string>;
  cssVariables: Record<string, string>;
}

// Validation helpers
export const isValidUIMode = (mode: string): mode is UIMode => {
  return ['SETUP', 'STANDARD', 'INTENSIVE', 'ONE_HAND', 'ANALYSIS'].includes(mode);
};

export const isValidActionType = (action: string): action is ActionType => {
  return ['GOAL', 'PENALTY', 'TIMEOUT', 'SUBSTITUTION', 'FOUL', 'ASSIST', 'SAVE', 'UNDO', 'EXPORT', 'SHARE'].includes(action);
};

// Type guards for runtime validation
export const isGameContext = (context: any): context is GameContext => {
  return context &&
    typeof context.isRunning === 'boolean' &&
    Array.isArray(context.events) &&
    typeof context.scoreDifference === 'number' &&
    typeof context.timeInGame === 'number';
};

export const isUserContext = (context: any): context is UserContext => {
  return context &&
    typeof context.isOneHanded === 'boolean' &&
    typeof context.prefersHaptic === 'boolean' &&
    typeof context.prefersAudio === 'boolean' &&
    ['mobile', 'tablet', 'desktop'].includes(context.deviceType);
};
