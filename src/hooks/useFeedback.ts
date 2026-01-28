/**
 * Feedback Hook
 * 
 * Haptic and audio feedback system for Track Side
 * Implements the "Athletic Intelligence" design system
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { UserContext, HapticConfig, AudioConfig } from '../types/design-system';

// Sound file paths
const SOUND_FILES = {
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  warning: '/sounds/warning.mp3',
  tap: '/sounds/tap.mp3',
  goal: '/sounds/goal.mp3',
  penalty: '/sounds/penalty.mp3',
  timeout: '/sounds/timeout.mp3',
  substitution: '/sounds/substitution.mp3',
  foul: '/sounds/foul.mp3',
  assist: '/sounds/assist.mp3',
  save: '/sounds/save.mp3',
  undo: '/sounds/undo.mp3',
  export: '/sounds/export.mp3',
  share: '/sounds/share.mp3',
};

// Haptic patterns
const HAPTIC_PATTERNS = {
  success: [50],
  error: [100, 50, 100],
  warning: [200],
  tap: [25],
  longPress: [100],
  goal: [50, 100, 50],
  penalty: [100, 50],
  timeout: [200, 100],
  substitution: [50],
  foul: [150],
  assist: [50, 25],
  save: [75],
  undo: [50, 50],
  export: [100],
  share: [50, 100],
};

// Audio context for better performance
let audioContext: AudioContext | null = null;

/**
 * Initialize audio context
 */
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Create audio element with caching
 */
const createAudioElement = (src: string): HTMLAudioElement => {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = 0.3;
  return audio;
};

/**
 * Main feedback hook
 */
export const useFeedback = (userContext: UserContext) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(userContext.prefersAudio);
  const [isHapticEnabled, setIsHapticEnabled] = useState(userContext.prefersHaptic);
  const [volume, setVolume] = useState(0.3);
  
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const lastHapticTime = useRef<number>(0);
  const lastAudioTime = useRef<number>(0);

  // Initialize audio cache
  useEffect(() => {
    Object.entries(SOUND_FILES).forEach(([key, src]) => {
      try {
        const audio = createAudioElement(src);
        audioCache.current.set(key, audio);
      } catch (error) {
        console.warn(`Failed to load audio file: ${src}`, error);
      }
    });

    return () => {
      audioCache.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current.clear();
    };
  }, []);

  // Trigger haptic feedback
  const triggerHaptic = useCallback((type: keyof typeof HAPTIC_PATTERNS) => {
    if (!isHapticEnabled || !userContext.touchCapabilities.supportsHaptic) {
      return;
    }

    // Debounce haptic feedback to prevent spam
    const now = Date.now();
    if (now - lastHapticTime.current < 50) {
      return;
    }
    lastHapticTime.current = now;

    try {
      const pattern = HAPTIC_PATTERNS[type];
      if (pattern && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, [isHapticEnabled, userContext.touchCapabilities.supportsHaptic]);

  // Trigger audio feedback
  const triggerAudio = useCallback((type: keyof typeof SOUND_FILES) => {
    if (!isAudioEnabled) {
      return;
    }

    // Debounce audio feedback to prevent spam
    const now = Date.now();
    if (now - lastAudioTime.current < 100) {
      return;
    }
    lastAudioTime.current = now;

    try {
      const audio = audioCache.current.get(type);
      if (audio) {
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(error => {
          console.warn(`Audio playback failed for ${type}:`, error);
        });
      }
    } catch (error) {
      console.warn('Audio feedback failed:', error);
    }
  }, [isAudioEnabled, volume]);

  // Combined feedback trigger
  const triggerFeedback = useCallback((
    type: keyof typeof HAPTIC_PATTERNS,
    options?: {
      haptic?: boolean;
      audio?: boolean;
      volume?: number;
    }
  ) => {
    const { haptic = true, audio = true, volume: newVolume } = options || {};

    if (haptic) {
      triggerHaptic(type);
    }

    if (audio && newVolume !== undefined) {
      setVolume(newVolume);
      triggerAudio(type);
    } else if (audio) {
      triggerAudio(type);
    }
  }, [triggerHaptic, triggerAudio]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
  }, []);

  // Toggle haptic
  const toggleHaptic = useCallback(() => {
    setIsHapticEnabled(prev => !prev);
  }, []);

  // Set volume
  const setVolumeLevel = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    // Update all cached audio elements
    audioCache.current.forEach(audio => {
      audio.volume = clampedVolume;
    });
  }, []);

  // Test feedback
  const testFeedback = useCallback(() => {
    triggerFeedback('success', { haptic: true, audio: true });
  }, [triggerFeedback]);

  // Get feedback status
  const getFeedbackStatus = useCallback(() => ({
    audio: {
      enabled: isAudioEnabled,
      supported: true,
      volume,
    },
    haptic: {
      enabled: isHapticEnabled,
      supported: userContext.touchCapabilities.supportsHaptic,
    },
  }), [isAudioEnabled, isHapticEnabled, volume, userContext.touchCapabilities.supportsHaptic]);

  // Check if feedback is available
  const isFeedbackAvailable = useCallback(() => {
    return (
      (isAudioEnabled && audioCache.current.size > 0) ||
      (isHapticEnabled && userContext.touchCapabilities.supportsHaptic)
    );
  }, [isAudioEnabled, isHapticEnabled, userContext.touchCapabilities.supportsHaptic]);

  return {
    // State
    isAudioEnabled,
    isHapticEnabled,
    volume,
    
    // Actions
    triggerHaptic,
    triggerAudio,
    triggerFeedback,
    toggleAudio,
    toggleHaptic,
    setVolumeLevel,
    testFeedback,
    
    // Status
    getFeedbackStatus,
    isFeedbackAvailable,
  };
};

/**
 * Hook for game-specific feedback
 */
export const useGameFeedback = (userContext: UserContext) => {
  const { triggerFeedback } = useFeedback(userContext);

  const gameFeedback = useCallback((action: string, outcome: 'success' | 'error' | 'warning' | 'neutral') => {
    const feedbackMap = {
      goal: { type: 'goal' as const, outcome: 'success' as const },
      penalty: { type: 'penalty' as const, outcome: 'warning' as const },
      timeout: { type: 'timeout' as const, outcome: 'warning' as const },
      substitution: { type: 'substitution' as const, outcome: 'neutral' as const },
      foul: { type: 'foul' as const, outcome: 'warning' as const },
      assist: { type: 'assist' as const, outcome: 'success' as const },
      save: { type: 'save' as const, outcome: 'success' as const },
      undo: { type: 'undo' as const, outcome: 'warning' as const },
      export: { type: 'export' as const, outcome: 'success' as const },
      share: { type: 'share' as const, outcome: 'success' as const },
    };

    const feedback = feedbackMap[action as keyof typeof feedbackMap];
    if (feedback) {
      triggerFeedback(feedback.type, { haptic: true, audio: true });
    } else {
      // Default feedback for unknown actions
      triggerFeedback(outcome, { haptic: true, audio: false });
    }
  }, [triggerFeedback]);

  return {
    gameFeedback,
  };
};

/**
 * Hook for accessibility feedback
 */
export const useAccessibilityFeedback = (userContext: UserContext) => {
  const { triggerAudio } = useFeedback(userContext);

  const announceToScreenReader = useCallback((message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.volume = 0.8;
      utterance.rate = 1.1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const playAccessibilitySound = useCallback((type: 'success' | 'error' | 'warning' | 'info') => {
    triggerAudio(type);
  }, [triggerAudio]);

  return {
    announceToScreenReader,
    playAccessibilitySound,
  };
};

/**
 * Hook for performance monitoring
 */
export const useFeedbackPerformance = () => {
  const [metrics, setMetrics] = useState({
    hapticCalls: 0,
    audioCalls: 0,
    errors: 0,
  });

  const recordHapticCall = useCallback(() => {
    setMetrics(prev => ({ ...prev, hapticCalls: prev.hapticCalls + 1 }));
  }, []);

  const recordAudioCall = useCallback(() => {
    setMetrics(prev => ({ ...prev, audioCalls: prev.audioCalls + 1 }));
  }, []);

  const recordError = useCallback(() => {
    setMetrics(prev => ({ ...prev, errors: prev.errors + 1 }));
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({ hapticCalls: 0, audioCalls: 0, errors: 0 });
  }, []);

  return {
    metrics,
    recordHapticCall,
    recordAudioCall,
    recordError,
    resetMetrics,
  };
};

/**
 * Hook for battery optimization
 */
export const useBatteryOptimization = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level * 100);
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });

        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {
        // Battery API not available
      });
    }
  }, []);

  const shouldReduceFeedback = useCallback(() => {
    return batteryLevel !== null && batteryLevel < 20 && !isCharging;
  }, [batteryLevel, isCharging]);

  return {
    batteryLevel,
    isCharging,
    shouldReduceFeedback,
  };
};

export default useFeedback;
