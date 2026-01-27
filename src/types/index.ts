// Global type definitions for Sideline Stats

// Game event types
export const EVENT_TYPES = {
  goal: 'goal',
  penalty: 'penalty',
  substitution: 'substitution',
  'yellow-card': 'yellow-card',
  'red-card': 'red-card',
} as const;

export type EventType = keyof typeof EVENT_TYPES;

// Team identifiers
export const TEAMS = {
  us: 'us',
  them: 'them',
} as const;

export type Team = keyof typeof TEAMS;

// Game event interface
export interface GameEvent {
  id: string;
  type: EventType;
  team: Team;
  label: string;
  meta: GameEventMeta;
  gameTime: number;
  timestamp: number;
}

// Game event metadata
export interface GameEventMeta {
  isPK?: boolean;
  [key: string]: unknown;
}

// Completed game interface
export interface CompletedGame {
  id: string;
  opponentName: string;
  myScore: number;
  opponentScore: number;
  events: GameEvent[];
  finalTime: number;
  timestamp: number;
}

// Game state interface
export interface GameState {
  activeGameId: string | null;
  opponentName: string;
  myScore: number;
  opponentScore: number;
  events: GameEvent[];
  roster: string[];
  isRunning: boolean;
  startTime: number | null;
  accumulatedTime: number;
  history: CompletedGame[];
}

// Store interface with all methods
export interface GameStore extends GameState {
  // Game management
  startGame: (opponentName: string) => void;
  finishGame: () => void;
  
  // Event management
  addEvent: (type: EventType, team: Team, label?: string, meta?: GameEventMeta) => void;
  updateEvent: (eventId: string, updates: Partial<GameEvent>) => void;
  undoLastEvent: () => void;
  
  // Roster management
  addToRoster: (name: string) => void;
  clearRoster: () => void;
  
  // History management
  deleteMatch: (gameId: string) => void;
  
  // Timer management
  toggleTimer: () => void;
  resetTimer: () => void;
  getElapsedTime: () => number;
  formatTime: (ms: number) => string;
}

// Component props interfaces
export interface ActionCardProps {
  card: ActionCardData;
  position: 'center' | 'left' | 'right';
  isSwipingUp: boolean;
  isVisible: boolean;
}

export interface ActionCardData {
  id: string;
  type: EventType;
  team: Team;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface GestureDeckProps {
  onAction: (type: EventType, team: Team) => void;
}

export interface FloatingHUDProps {
  myScore: number;
  opponentScore: number;
  displayTime: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  className?: string;
}

export interface SwipeStreamProps {
  events: GameEvent[];
  onUndo: () => void;
  onEdit: (event: GameEvent) => void;
  formatTime: (ms: number) => string;
  className?: string;
}

export interface TimerDisplayProps {
  time: number;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

// Modal state interface
export interface ModalState {
  isOpen: boolean;
  type: EventType;
  team: Team;
}

// Game modal props
export interface GameModalProps {
  isOpen: boolean;
  type: EventType;
  team: Team;
  initialLabel: string;
  initialIsPK: boolean;
  onConfirm: (label: string, meta: GameEventMeta) => void;
  onCancel: () => void;
}

// Performance monitoring interfaces
export interface PerformanceMetrics {
  [key: string]: number;
}

export interface ComputationCacheEntry<T = any> {
  value: T;
  timestamp: number;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type GestureEventHandler = (direction: string) => void;

// Animation variants
export interface AnimationVariants {
  [key: string]: {
    [key: string]: any;
  };
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// App configuration
export interface AppConfig {
  version: string;
  environment: 'development' | 'production' | 'test';
  features: {
    gestures: boolean;
    haptics: boolean;
    sounds: boolean;
    animations: boolean;
  };
  performance: {
    enableMonitoring: boolean;
    enableCaching: boolean;
    enableServiceWorker: boolean;
  };
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  timestamp: number;
}

// Navigation types
export type RouteParams = {
  [key: string]: string | undefined;
};

export interface NavigationState {
  from?: string;
  params?: RouteParams;
}

// Form types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
}

// Export all types for easy importing
export type {
  // Re-export commonly used types
  GameEvent as Event,
  CompletedGame as Game,
  GameState as State,
  GameStore as Store,
};
