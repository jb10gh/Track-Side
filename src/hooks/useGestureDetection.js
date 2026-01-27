import { useGesture } from '@use-gesture/react';
import { useState, useCallback } from 'react';

// Haptic feedback utilities
export const hapticPatterns = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  },
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }
};

export const useGestureDetection = (onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, onLongPress, onDoubleTap) => {
  const [isGesturing, setIsGesturing] = useState(false);
  const [gestureDirection, setGestureDirection] = useState(null);

  const bind = useGesture({
    onDragStart: () => {
      setIsGesturing(true);
      hapticPatterns.light();
    },
    onDragEnd: () => {
      setIsGesturing(false);
      setGestureDirection(null);
    },
    onDrag: ({ 
      direction: [dx, dy], 
      velocity: [vx, vy], 
      distance: [distX, distY],
      cancel 
    }) => {
      // Minimum velocity and distance thresholds
      const minVelocity = 0.5;
      const minDistance = 50;

      if (Math.abs(vx) < minVelocity && Math.abs(vy) < minVelocity) return;
      if (Math.abs(distX) < minDistance && Math.abs(distY) < minDistance) return;

      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical swipe
        if (dy > 0 && distY > minDistance) {
          setGestureDirection('down');
          hapticPatterns.medium();
          onSwipeDown?.();
          cancel();
        } else if (dy < 0 && Math.abs(distY) > minDistance) {
          setGestureDirection('up');
          hapticPatterns.medium();
          onSwipeUp?.();
          cancel();
        }
      } else {
        // Horizontal swipe
        if (dx > 0 && distX > minDistance) {
          setGestureDirection('right');
          hapticPatterns.medium();
          onSwipeRight?.();
          cancel();
        } else if (dx < 0 && Math.abs(distX) > minDistance) {
          setGestureDirection('left');
          hapticPatterns.medium();
          onSwipeLeft?.();
          cancel();
        }
      }
    }
  }, {
    drag: {
      threshold: 10,
      filterTaps: true
    }
  });

  const handleLongPress = useCallback(() => {
    hapticPatterns.heavy();
    onLongPress?.();
  }, [onLongPress]);

  const handleDoubleTap = useCallback(() => {
    hapticPatterns.success();
    onDoubleTap?.();
  }, [onDoubleTap]);

  return {
    bind,
    isGesturing,
    gestureDirection,
    handleLongPress,
    handleDoubleTap,
    hapticPatterns
  };
};
