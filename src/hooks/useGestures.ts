/**
 * Gesture Recognition Hook
 * 
 * Touch-first interaction system for Track Side
 * Implements gesture-driven interface with haptic feedback
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { TouchEvent, GestureResult, ActionType, UserContext } from '../types/design-system';

// Native TouchEvent interface
interface NativeTouchEvent {
  changedTouches: TouchList;
  targetTouches: TouchList;
  touches: TouchList;
}

// Gesture configuration
const GESTURE_CONFIG = {
  TAP_TIMEOUT: 300,
  LONG_PRESS_TIMEOUT: 500,
  SWIPE_THRESHOLD: 50,
  DOUBLE_TAP_TIMEOUT: 300,
  PINCH_THRESHOLD: 20,
};

// Touch event interface
interface TouchPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

// Gesture state interface
interface GestureState {
  activeTouches: TouchPoint[];
  lastTap: TouchPoint | null;
  gestureStart: TouchPoint | null;
  gestureType: TouchEvent['type'] | null;
  isLongPressing: boolean;
  longPressTimer: NodeJS.Timeout | null;
}

/**
 * Main gesture recognition hook
 */
export const useGestures = (
  userContext: UserContext,
  onGestureDetected?: (gesture: GestureResult) => void
) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    activeTouches: [],
    lastTap: null,
    gestureStart: null,
    gestureType: null,
    isLongPressing: false,
    longPressTimer: null,
  });

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear long press timer
  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Trigger haptic feedback
  const triggerHaptic = useCallback((type: 'success' | 'error' | 'warning' | 'tap' | 'longPress') => {
    if (!userContext.prefersHaptic || !userContext.touchCapabilities.supportsHaptic) {
      return;
    }

    const patterns = {
      success: [50],
      error: [100, 50, 100],
      warning: [200],
      tap: [25],
      longPress: [100],
    };

    navigator.vibrate(patterns[type]);
  }, [userContext]);

  // Calculate distance between two points
  const calculateDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate swipe direction
  const calculateSwipeDirection = useCallback((start: TouchPoint, end: TouchPoint): 'up' | 'down' | 'left' | 'right' => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }, []);

  // Map gesture to action
  const mapGestureToAction = useCallback((gesture: TouchEvent['type'], direction?: 'up' | 'down' | 'left' | 'right'): ActionType | null => {
    const actionMap: Record<string, Record<string, ActionType>> = {
      tap: {
        default: 'GOAL',
      },
      longPress: {
        default: 'PENALTY',
      },
      swipe: {
        up: 'SAVE',
        down: 'UNDO',
        left: 'GOAL',
        right: 'PENALTY',
      },
    };

    if (gesture === 'swipe' && direction && actionMap.swipe) {
      return actionMap.swipe[direction] || null;
    }

    return actionMap[gesture]?.default || null;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: NativeTouchEvent) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    
    const newTouch: TouchPoint = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    setGestureState(prev => ({
      ...prev,
      activeTouches: [...prev.activeTouches, newTouch],
      gestureStart: newTouch,
      gestureType: null,
      isLongPressing: false,
    }));

    // Start long press timer
    if (userContext.touchCapabilities.supportsGestures) {
      longPressTimerRef.current = setTimeout(() => {
        setGestureState(prev => ({ ...prev, isLongPressing: true }));
        triggerHaptic('longPress');
        
        const action = mapGestureToAction('longPress');
        const gestureResult: GestureResult = {
          gesture: 'longPress',
          confidence: 0.9,
          ...(action && { action }),
        };
        
        onGestureDetected?.(gestureResult);
      }, GESTURE_CONFIG.LONG_PRESS_TIMEOUT);
    }
  }, [userContext, triggerHaptic, mapGestureToAction, onGestureDetected]);

  // Handle touch move
  const handleTouchMove = useCallback((event: NativeTouchEvent) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    
    const currentTouch: TouchPoint = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    setGestureState(prev => {
      const gestureStart = prev.gestureStart;
      if (!gestureStart) return prev;

      // Check if we've moved far enough to cancel long press
      const distance = calculateDistance(gestureStart, currentTouch);
      if (distance > GESTURE_CONFIG.SWIPE_THRESHOLD) {
        clearLongPressTimer();
        return { ...prev, isLongPressing: false };
      }

      return prev;
    });
  }, [calculateDistance, clearLongPressTimer]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: NativeTouchEvent) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    
    const endTouch: TouchPoint = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    setGestureState(prev => {
      const gestureStart = prev.gestureStart;
      const lastTap = prev.lastTap;
      
      if (!gestureStart) return prev;

      const duration = endTouch.timestamp - gestureStart.timestamp;
      const distance = calculateDistance(gestureStart, endTouch);

      // Clear long press timer
      clearLongPressTimer();

      // Determine gesture type
      let gestureType: TouchEvent['type'] | null = null;
      let gestureResult: GestureResult | null = null;

      if (duration < GESTURE_CONFIG.TAP_TIMEOUT && distance < GESTURE_CONFIG.SWIPE_THRESHOLD) {
        // Tap gesture
        gestureType = 'tap';
        
        // Check for double tap
        if (lastTap && (endTouch.timestamp - lastTap.timestamp) < GESTURE_CONFIG.DOUBLE_TAP_TIMEOUT) {
          gestureType = 'doubleTap';
        }
        
        triggerHaptic('tap');
        
        const action = mapGestureToAction(gestureType);
        gestureResult = {
          gesture: gestureType,
          confidence: 0.8,
          ...(action && { action }),
        };
      } else if (distance >= GESTURE_CONFIG.SWIPE_THRESHOLD) {
        // Swipe gesture
        gestureType = 'swipe';
        const direction = calculateSwipeDirection(gestureStart, endTouch);
        
        triggerHaptic('tap');
        
        const action = mapGestureToAction(gestureType, direction);
        gestureResult = {
          gesture: gestureType,
          confidence: 0.7,
          ...(action && { action }),
          parameters: { direction },
        };
      }

      // Update state
      const newState = {
        ...prev,
        activeTouches: prev.activeTouches.filter(t => t.id !== touch!.identifier),
        lastTap: gestureType === 'tap' ? endTouch : lastTap,
        gestureStart: null,
        gestureType: null,
        isLongPressing: false,
      };

      // Trigger gesture callback
      if (gestureResult && onGestureDetected) {
        onGestureDetected(gestureResult);
      }

      return newState;
    });
  }, [calculateDistance, calculateSwipeDirection, mapGestureToAction, triggerHaptic, clearLongPressTimer, onGestureDetected]);

  // Handle touch cancel
  const handleTouchCancel = useCallback(() => {
    clearLongPressTimer();
    setGestureState(prev => ({
      ...prev,
      activeTouches: [],
      gestureStart: null,
      gestureType: null,
      isLongPressing: false,
    }));
  }, [clearLongPressTimer]);

  // Setup event listeners
  useEffect(() => {
    if (!userContext.touchCapabilities.supportsGestures) {
      return;
    }

    const element = document.documentElement;
    
    element.addEventListener('touchstart', handleTouchStart as any, { passive: false });
    element.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    element.addEventListener('touchend', handleTouchEnd as any, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel as any, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart as any);
      element.removeEventListener('touchmove', handleTouchMove as any);
      element.removeEventListener('touchend', handleTouchEnd as any);
      element.removeEventListener('touchcancel', handleTouchCancel as any);
      clearLongPressTimer();
    };
  }, [userContext, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel, clearLongPressTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, [clearLongPressTimer]);

  return {
    gestureState,
    isGestureActive: gestureState.activeTouches.length > 0,
    currentGesture: gestureState.gestureType,
    clearLongPressTimer,
  };
};

/**
 * Hook for thumb zone optimization
 */
export const useThumbZone = () => {
  const [thumbZone, setThumbZone] = useState<'left' | 'right' | 'center'>('right');

  useEffect(() => {
    // Detect dominant hand based on touch patterns
    const detectDominantHand = () => {
      // This is a simplified implementation
      // In production, you'd track actual touch patterns
      const isLeftHanded = window.innerWidth < 400; // Simplified heuristic
      setThumbZone(isLeftHanded ? 'left' : 'right');
    };

    detectDominantHand();
    window.addEventListener('resize', detectDominantHand);
    
    return () => {
      window.removeEventListener('resize', detectDominantHand);
    };
  }, []);

  const getThumbZonePosition = useCallback((actionIndex: number) => {
    const basePosition = thumbZone === 'left' ? 20 : window.innerWidth - 80;
    const spacing = 60;
    const offset = actionIndex * spacing;
    
    return {
      x: thumbZone === 'left' ? basePosition + offset : basePosition - offset,
      y: window.innerHeight - 100 - (actionIndex * 20),
    };
  }, [thumbZone]);

  return {
    thumbZone,
    getThumbZonePosition,
  };
};

/**
 * Hook for progressive disclosure
 */
export const useProgressiveDisclosure = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'actions' | 'timeline' | 'settings' | null>(null);

  const expandSection = useCallback((section: 'actions' | 'timeline' | 'settings') => {
    setActiveSection(section);
    setIsExpanded(true);
  }, []);

  const collapseSection = useCallback(() => {
    setActiveSection(null);
    setIsExpanded(false);
  }, []);

  const toggleSection = useCallback((section: 'actions' | 'timeline' | 'settings') => {
    if (activeSection === section) {
      collapseSection();
    } else {
      expandSection(section);
    }
  }, [activeSection, expandSection, collapseSection]);

  return {
    isExpanded,
    activeSection,
    expandSection,
    collapseSection,
    toggleSection,
  };
};
