import { useState, useCallback, useRef, useEffect } from 'react';
import { useGesture } from '@use-gesture/react';

// Advanced gesture patterns for complex actions
const GESTURE_PATTERNS = {
  SWIPE_UP: 'swipe-up',
  SWIPE_DOWN: 'swipe-down',
  SWIPE_LEFT: 'swipe-left',
  SWIPE_RIGHT: 'swipe-right',
  TAP: 'tap',
  DOUBLE_TAP: 'double-tap',
  LONG_PRESS: 'long-press',
  PINCH_IN: 'pinch-in',
  PINCH_OUT: 'pinch-out',
  CIRCLE_CLOCKWISE: 'circle-clockwise',
  CIRCLE_COUNTER_CLOCKWISE: 'circle-counter-clockwise',
  ZIGZAG: 'zigzag',
  FORCE_TOUCH: 'force-touch'
};

// Haptic feedback patterns
const HAPTIC_PATTERNS = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

export const useAdvancedGestures = (onGesture, options = {}) => {
  const [gestureState, setGestureState] = useState({
    isGesturing: false,
    currentGesture: null,
    gestureHistory: [],
    confidence: 0
  });
  
  const gesturePath = useRef([]);
  const lastTapTime = useRef(0);
  const longPressTimer = useRef(null);
  const forceThreshold = options.forceThreshold || 0.5;

  // Haptic feedback function
  const triggerHaptic = useCallback((pattern) => {
    if ('vibrate' in navigator) {
      switch (pattern) {
        case HAPTIC_PATTERNS.LIGHT:
          navigator.vibrate(10);
          break;
        case HAPTIC_PATTERNS.MEDIUM:
          navigator.vibrate(25);
          break;
        case HAPTIC_PATTERNS.HEAVY:
          navigator.vibrate(50);
          break;
        case HAPTIC_PATTERNS.SUCCESS:
          navigator.vibrate([10, 50, 10]);
          break;
        case HAPTIC_PATTERNS.ERROR:
          navigator.vibrate([100, 50, 100]);
          break;
        case HAPTIC_PATTERNS.WARNING:
          navigator.vibrate([50, 30, 50]);
          break;
      }
    }
  }, []);

  // Analyze gesture path for complex patterns
  const analyzeGesturePath = useCallback((path) => {
    if (path.length < 3) return null;
    
    const startPoint = path[0];
    const endPoint = path[path.length - 1];
    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Detect basic swipes
    if (distance > 50) {
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      
      if (angle > -45 && angle <= 45) return GESTURE_PATTERNS.SWIPE_RIGHT;
      if (angle > 45 && angle <= 135) return GESTURE_PATTERNS.SWIPE_DOWN;
      if (angle > 135 || angle <= -135) return GESTURE_PATTERNS.SWIPE_LEFT;
      if (angle > -135 && angle <= -45) return GESTURE_PATTERNS.SWIPE_UP;
    }
    
    // Detect circular patterns
    if (path.length > 10) {
      const isCircular = detectCircularPattern(path);
      if (isCircular.clockwise) return GESTURE_PATTERNS.CIRCLE_CLOCKWISE;
      if (isCircular.counterClockwise) return GESTURE_PATTERNS.CIRCLE_COUNTER_CLOCKWISE;
    }
    
    // Detect zigzag patterns
    if (detectZigzagPattern(path)) {
      return GESTURE_PATTERNS.ZIGZAG;
    }
    
    return null;
  }, []);

  // Detect circular gesture pattern
  const detectCircularPattern = (path) => {
    if (path.length < 8) return { clockwise: false, counterClockwise: false };
    
    let totalAngle = 0;
    const center = calculatePathCenter(path);
    
    for (let i = 1; i < path.length; i++) {
      const prevAngle = Math.atan2(
        path[i - 1].y - center.y,
        path[i - 1].x - center.x
      );
      const currAngle = Math.atan2(
        path[i].y - center.y,
        path[i].x - center.x
      );
      
      let angleDiff = currAngle - prevAngle;
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
      
      totalAngle += angleDiff;
    }
    
    return {
      clockwise: totalAngle > Math.PI,
      counterClockwise: totalAngle < -Math.PI
    };
  };

  // Detect zigzag pattern
  const detectZigzagPattern = (path) => {
    if (path.length < 6) return false;
    
    let directionChanges = 0;
    let lastDirection = null;
    
    for (let i = 1; i < path.length; i++) {
      const deltaX = path[i].x - path[i - 1].x;
      const currentDirection = deltaX > 0 ? 'right' : 'left';
      
      if (lastDirection && currentDirection !== lastDirection) {
        directionChanges++;
      }
      lastDirection = currentDirection;
    }
    
    return directionChanges >= 2;
  };

  // Calculate path center
  const calculatePathCenter = (path) => {
    const sum = path.reduce((acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y
    }), { x: 0, y: 0 });
    
    return {
      x: sum.x / path.length,
      y: sum.y / path.length
    };
  };

  // Handle gesture events
  const bind = useGesture({
    onDragStart: ({ event, ...state }) => {
      setGestureState(prev => ({ ...prev, isGesturing: true }));
      gesturePath.current = [{ x: state.xy[0], y: state.xy[1], time: Date.now() }];
      
      // Start long press timer
      if (options.enableLongPress) {
        longPressTimer.current = setTimeout(() => {
          triggerHaptic(HAPTIC_PATTERNS.HEAVY);
          onGesture?.(GESTURE_PATTERNS.LONG_PRESS, state);
        }, 500);
      }
    },
    
    onDrag: ({ event, ...state }) => {
      // Clear long press timer on movement
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      gesturePath.current.push({ 
        x: state.xy[0], 
        y: state.xy[1], 
        time: Date.now(),
        force: state.force || 0
      });
      
      // Detect force touch
      if (state.force > forceThreshold) {
        triggerHaptic(HAPTIC_PATTERNS.MEDIUM);
        onGesture?.(GESTURE_PATTERNS.FORCE_TOUCH, state);
      }
    },
    
    onDragEnd: ({ event, ...state }) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      const gesture = analyzeGesturePath(gesturePath.current);
      
      if (gesture) {
        const confidence = calculateGestureConfidence(gesture, gesturePath.current);
        triggerHaptic(HAPTIC_PATTERNS.LIGHT);
        
        setGestureState(prev => ({
          ...prev,
          currentGesture: gesture,
          confidence,
          gestureHistory: [...prev.gestureHistory.slice(-9), { gesture, timestamp: Date.now() }]
        }));
        
        onGesture?.(gesture, state, confidence);
      }
      
      setGestureState(prev => ({ ...prev, isGesturing: false }));
      gesturePath.current = [];
    },
    
    onTap: ({ event, ...state }) => {
      const now = Date.now();
      const timeSinceLastTap = now - lastTapTime.current;
      
      if (timeSinceLastTap < 300) {
        // Double tap detected
        triggerHaptic(HAPTIC_PATTERNS.SUCCESS);
        onGesture?.(GESTURE_PATTERNS.DOUBLE_TAP, state);
      } else {
        // Single tap
        triggerHaptic(HAPTIC_PATTERNS.LIGHT);
        onGesture?.(GESTURE_PATTERNS.TAP, state);
      }
      
      lastTapTime.current = now;
    },
    
    onPinch: ({ event, ...state }) => {
      if (state.delta[0] < 0) {
        triggerHaptic(HAPTIC_PATTERNS.LIGHT);
        onGesture?.(GESTURE_PATTERNS.PINCH_IN, state);
      } else {
        triggerHaptic(HAPTIC_PATTERNS.LIGHT);
        onGesture?.(GESTURE_PATTERNS.PINCH_OUT, state);
      }
    }
  }, {
    drag: { 
      filterTaps: true,
      threshold: 10
    },
    pinch: {
      scaleBounds: { min: 0.5, max: 2 }
    }
  });

  // Calculate gesture confidence
  const calculateGestureConfidence = (gesture, path) => {
    if (path.length < 3) return 0;
    
    const startPoint = path[0];
    const endPoint = path[path.length - 1];
    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Higher confidence for longer, clearer gestures
    const distanceScore = Math.min(distance / 200, 1);
    const pathScore = Math.min(path.length / 20, 1);
    
    return (distanceScore + pathScore) / 2;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return {
    bind,
    gestureState,
    triggerHaptic,
    GESTURE_PATTERNS,
    HAPTIC_PATTERNS
  };
};
