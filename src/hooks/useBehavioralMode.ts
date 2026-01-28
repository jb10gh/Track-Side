/**
 * Behavioral Modes Hook
 * 
 * Smart UI state calculation based on game context and user context
 * Implements the "Athletic Intelligence" design system
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { UIMode, GameContext, UserContext, UIState, LayoutConfig, InteractionConfig, FeedbackConfig, PerformanceConfig, ActionType } from '../types/design-system';

/**
 * Calculate optimal UI mode based on game and user context
 */
const calculateUIMode = (gameContext: GameContext, userContext: UserContext): UIMode => {
  // Priority 1: Game state considerations
  if (!gameContext.isRunning) {
    return 'SETUP';
  }
  
  // Priority 2: Game intensity
  if (gameContext.events.length > 10) {
    return 'INTENSIVE';
  }
  
  // Priority 3: User context
  if (userContext.isOneHanded) {
    return 'ONE_HAND';
  }
  
  // Priority 4: Game analysis context
  if (gameContext.timeInGame > 0 && !gameContext.isRunning) {
    return 'ANALYSIS';
  }
  
  return 'STANDARD';
};

/**
 * Calculate layout configuration based on mode and context
 */
const calculateLayoutConfig = (mode: UIMode, userContext: UserContext): LayoutConfig => {
  const baseConfig = {
    type: 'stacked' as const,
    primaryActionZone: 'bottom' as const,
    density: 'comfortable' as const,
    breakpoints: {
      mobile: 640,
      tablet: 1024,
      desktop: 1440,
    },
  };

  switch (mode) {
    case 'SETUP':
      return {
        ...baseConfig,
        type: 'stacked',
        density: 'spacious',
        primaryActionZone: 'center',
      };
    
    case 'STANDARD':
      return {
        ...baseConfig,
        type: userContext.deviceType === 'mobile' ? 'thumb-optimized' : 'side-by-side',
        density: 'comfortable',
        primaryActionZone: 'bottom',
      };
    
    case 'INTENSIVE':
      return {
        ...baseConfig,
        type: 'compact',
        density: 'compact',
        primaryActionZone: 'bottom',
      };
    
    case 'ONE_HAND':
      return {
        ...baseConfig,
        type: 'thumb-optimized',
        density: 'comfortable',
        primaryActionZone: 'bottom',
      };
    
    case 'ANALYSIS':
      return {
        ...baseConfig,
        type: 'side-by-side',
        density: 'spacious',
        primaryActionZone: 'top',
      };
    
    default:
      return baseConfig;
  }
};

/**
 * Calculate interaction configuration based on mode and capabilities
 */
const calculateInteractionConfig = (mode: UIMode, _userContext: UserContext): InteractionConfig => {
  const baseActions: ActionType[] = ['GOAL', 'PENALTY'];
  
  const gestureSupport = {
    tap: true,
    longPress: true,
    swipe: true,
    pinch: false,
    doubleTap: false,
  };

  switch (mode) {
    case 'SETUP':
      return {
        primaryActions: ['SAVE', 'UNDO'] as ActionType[],
        gestureSupport,
        touchTargetSize: 48,
        feedbackDelay: 150,
        animationDuration: 200,
      };
    
    case 'STANDARD':
      return {
        primaryActions: baseActions,
        gestureSupport,
        touchTargetSize: 44,
        feedbackDelay: 100,
        animationDuration: 150,
      };
    
    case 'INTENSIVE':
      return {
        primaryActions: baseActions,
        gestureSupport,
        touchTargetSize: 44,
        feedbackDelay: 50,
        animationDuration: 100,
      };
    
    case 'ONE_HAND':
      return {
        primaryActions: baseActions,
        gestureSupport,
        touchTargetSize: 48,
        feedbackDelay: 100,
        animationDuration: 150,
      };
    
    case 'ANALYSIS':
      return {
        primaryActions: ['SAVE', 'EXPORT', 'SHARE'] as ActionType[],
        gestureSupport,
        touchTargetSize: 44,
        feedbackDelay: 200,
        animationDuration: 250,
      };
    
    default:
      return {
        primaryActions: baseActions,
        gestureSupport,
        touchTargetSize: 44,
        feedbackDelay: 100,
        animationDuration: 150,
      };
  }
};

/**
 * Calculate feedback configuration based on user preferences
 */
const calculateFeedbackConfig = (userContext: UserContext): FeedbackConfig => {
  return {
    haptic: {
      enabled: userContext.prefersHaptic && userContext.touchCapabilities.supportsHaptic,
      intensity: 'medium',
      patterns: {
        success: [50],
        error: [100, 50, 100],
        warning: [200],
        tap: [25],
        longPress: [100],
      },
    },
    audio: {
      enabled: userContext.prefersAudio,
      volume: 0.3,
      sounds: {
        success: '/sounds/success.mp3',
        error: '/sounds/error.mp3',
        warning: '/sounds/warning.mp3',
        tap: '/sounds/tap.mp3',
        goal: '/sounds/goal.mp3',
        penalty: '/sounds/penalty.mp3',
      },
    },
    visual: {
      animations: true,
      reducedMotion: false,
      contrast: 'normal',
    },
  };
};

/**
 * Calculate performance configuration based on mode and device
 */
const calculatePerformanceConfig = (mode: UIMode, userContext: UserContext): PerformanceConfig => {
  const isMobile = userContext.deviceType === 'mobile';
  const isIntensive = mode === 'INTENSIVE';
  
  return {
    renderMode: isIntensive ? 'async' : 'sync',
    updateInterval: isIntensive ? 100 : 50,
    maxFPS: isMobile ? 60 : 120,
    batteryOptimization: isMobile,
  };
};

/**
 * Main behavioral modes hook
 */
export const useBehavioralMode = (
  gameContext: GameContext,
  userContext: UserContext
): UIState => {
  // Calculate mode based on context
  const mode = useMemo(() => 
    calculateUIMode(gameContext, userContext), 
    [gameContext, userContext]
  );

  // Calculate all configuration aspects
  const layout = useMemo(() => 
    calculateLayoutConfig(mode, userContext), 
    [mode, userContext]
  );

  const interactions = useMemo(() => 
    calculateInteractionConfig(mode, userContext), 
    [mode, userContext]
  );

  const feedback = useMemo(() => 
    calculateFeedbackConfig(userContext), 
    [userContext]
  );

  const performance = useMemo(() => 
    calculatePerformanceConfig(mode, userContext), 
    [mode, userContext]
  );

  // Apply mode to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-ui-mode', mode.toLowerCase());
    
    // Apply performance optimizations
    if (performance.batteryOptimization) {
      document.documentElement.setAttribute('data-battery-opt', 'true');
    }
    
    if (feedback.visual.reducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    }
  }, [mode, performance.batteryOptimization, feedback.visual.reducedMotion]);

  // Handle mode changes
  const handleModeChange = useCallback((_newMode: UIMode) => {
    // Mode change logic handled by parent component
  }, []);

  return {
    mode,
    layout,
    interactions,
    feedback,
    performance,
  };
};

/**
 * Hook for detecting user capabilities and preferences
 */
export const useUserContext = (): UserContext => {
  const [userContext, setUserContext] = useState<UserContext>({
    isOneHanded: false,
    prefersHaptic: true,
    prefersAudio: true,
    deviceType: 'mobile',
    touchCapabilities: {
      supportsHaptic: false,
      supportsGestures: false,
      maxTouchPoints: 1,
      hasForceTouch: false,
    },
  });

  useEffect(() => {
    // Detect device type
    const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    // Detect touch capabilities
    const detectTouchCapabilities = () => {
      const capabilities = {
        supportsHaptic: 'vibrate' in navigator,
        supportsGestures: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints || 1,
        hasForceTouch: 'force' in (TouchEvent.prototype as any),
      };
      return capabilities;
    };

    // Detect one-handed usage (simplified heuristic)
    const detectOneHanded = (): boolean => {
      // This is a simplified detection - in production, you'd want more sophisticated logic
      return window.innerWidth < 400 || userContext.deviceType === 'mobile';
    };

    // Update user context
    setUserContext(prev => ({
      ...prev,
      deviceType: detectDeviceType(),
      touchCapabilities: detectTouchCapabilities(),
      isOneHanded: detectOneHanded(),
    }));
  }, []);

  return userContext;
};

/**
 * Hook for applying design system CSS variables
 */
export const useDesignSystem = (mode: UIMode) => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply mode-specific CSS variables
    const cssVariables = getCSSVariablesForMode(mode);
    
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [mode]);
};

/**
 * Get CSS variables for a specific mode
 */
const getCSSVariablesForMode = (mode: UIMode): Record<string, string> => {
  const colorPalettes = {
    SETUP: {
      '--primary': '#3B82F6',
      '--accent': '#10B981',
      '--neutral': '#6B7280',
      '--surface': '#F8FAFC',
      '--text': '#1F2937',
    },
    STANDARD: {
      '--primary': '#FF1493',
      '--accent': '#FCD34D',
      '--neutral': '#FFFFFF',
      '--surface': '#1F2937',
      '--text': '#FFFFFF',
    },
    INTENSIVE: {
      '--primary': '#FF1493',
      '--accent': '#FCD34D',
      '--neutral': '#FFFFFF',
      '--surface': '#111827',
      '--text': '#FFFFFF',
    },
    ONE_HAND: {
      '--primary': '#FF1493',
      '--accent': '#FCD34D',
      '--neutral': '#FFFFFF',
      '--surface': '#1F2937',
      '--text': '#FFFFFF',
    },
    ANALYSIS: {
      '--primary': '#8B5CF6',
      '--accent': '#06B6D4',
      '--neutral': '#1F2937',
      '--surface': '#0F172A',
      '--text': '#E2E8F0',
    },
  };

  return colorPalettes[mode] || colorPalettes.STANDARD;
};
