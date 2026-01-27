import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand, Zap, Circle } from 'lucide-react';
import { useAdvancedGestures, GESTURE_PATTERNS } from '../../hooks/useAdvancedGestures';

const GESTURE_TUTORIALS = [
  {
    id: 'swipe-up',
    pattern: GESTURE_PATTERNS.SWIPE_UP,
    title: 'Swipe Up',
    description: 'Quick action panel',
    icon: ArrowUp,
    instruction: 'Swipe up from bottom of screen',
    practiceArea: 'bottom'
  },
  {
    id: 'swipe-down',
    pattern: GESTURE_PATTERNS.SWIPE_DOWN,
    title: 'Swipe Down',
    description: 'Game summary',
    icon: ArrowDown,
    instruction: 'Swipe down from top of screen',
    practiceArea: 'top'
  },
  {
    id: 'swipe-left',
    pattern: GESTURE_PATTERNS.SWIPE_LEFT,
    title: 'Swipe Left',
    description: 'Previous event',
    icon: ArrowLeft,
    instruction: 'Swipe left on timeline',
    practiceArea: 'center'
  },
  {
    id: 'swipe-right',
    pattern: GESTURE_PATTERNS.SWIPE_RIGHT,
    title: 'Swipe Right',
    description: 'Next event',
    icon: ArrowRight,
    instruction: 'Swipe right on timeline',
    practiceArea: 'center'
  },
  {
    id: 'double-tap',
    pattern: GESTURE_PATTERNS.DOUBLE_TAP,
    title: 'Double Tap',
    description: 'Undo last action',
    icon: Zap,
    instruction: 'Tap twice quickly anywhere',
    practiceArea: 'center'
  },
  {
    id: 'long-press',
    pattern: GESTURE_PATTERNS.LONG_PRESS,
    title: 'Long Press',
    description: 'Edit mode',
    icon: Hand,
    instruction: 'Press and hold for 1 second',
    practiceArea: 'center'
  },
  {
    id: 'circle',
    pattern: GESTURE_PATTERNS.CIRCLE_CLOCKWISE,
    title: 'Circle Gesture',
    description: 'Advanced menu',
    icon: Circle,
    instruction: 'Draw a circle with your finger',
    practiceArea: 'center'
  }
];

export const GestureTutorial = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedGestures, setCompletedGestures] = useState(new Set());
  const [isPracticing, setIsPracticing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [practiceAttempts, setPracticeAttempts] = useState(0);

  const currentTutorial = GESTURE_TUTORIALS[currentStep];

  const handleGesture = (gesture, state, confidence) => {
    if (!isPracticing) return;
    
    if (gesture === currentTutorial.pattern && confidence > 0.7) {
      // Gesture completed successfully
      setCompletedGestures(prev => new Set([...prev, currentTutorial.id]));
      
      setTimeout(() => {
        if (currentStep < GESTURE_TUTORIALS.length - 1) {
          setCurrentStep(prev => prev + 1);
          setPracticeAttempts(0);
          setShowHint(false);
        } else {
          // Tutorial completed
          onComplete?.();
        }
      }, 1000);
    } else {
      setPracticeAttempts(prev => prev + 1);
      if (practiceAttempts > 2) {
        setShowHint(true);
      }
    }
  };

  const { bind, gestureState, triggerHaptic } = useAdvancedGestures(handleGesture, {
    enableLongPress: true
  });

  const getPracticeAreaStyles = () => {
    switch (currentTutorial.practiceArea) {
      case 'top':
        return 'top-0 left-0 right-0 h-1/3';
      case 'bottom':
        return 'bottom-0 left-0 right-0 h-1/3';
      default:
        return 'top-1/3 left-0 right-0 h-1/3';
    }
  };

  const skipTutorial = () => {
    onComplete?.();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 text-white">
          <h1 className="text-2xl font-bold">Gesture Tutorial</h1>
          <div className="flex gap-3">
            <button
              onClick={skipTutorial}
              className="px-4 py-2 text-sm border border-white rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              Skip
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 mb-6">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Step {currentStep + 1} of {GESTURE_TUTORIALS.length}</span>
            <span>{completedGestures.size} completed</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / GESTURE_TUTORIALS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-white text-center">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md"
          >
            <div className="mb-6">
              <currentTutorial.icon className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h2 className="text-3xl font-bold mb-2">{currentTutorial.title}</h2>
              <p className="text-xl text-gray-300 mb-2">{currentTutorial.description}</p>
              <p className="text-gray-400">{currentTutorial.instruction}</p>
            </div>

            {!isPracticing ? (
              <button
                onClick={() => {
                  setIsPracticing(true);
                  triggerHaptic('light');
                }}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Start Practice
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-lg">
                  {gestureState.isGesturing ? (
                    <span className="text-green-400">Gesture detected...</span>
                  ) : showHint ? (
                    <span className="text-yellow-400">Hint: {currentTutorial.instruction}</span>
                  ) : (
                    <span>Try the gesture in the highlighted area</span>
                  )}
                </div>
                
                {completedGestures.has(currentTutorial.id) && (
                  <div className="text-green-400 text-lg font-medium">
                    ✓ Perfect! Moving to next step...
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Practice Area Overlay */}
        <AnimatePresence>
          {isPracticing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute ${getPracticeAreaStyles()} border-2 border-blue-500 border-dashed rounded-lg pointer-events-none`}
            >
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gesture Practice Area */}
        {isPracticing && (
          <div
            {...bind()}
            className="absolute inset-0 z-10"
            style={{ touchAction: 'none' }}
          />
        )}

        {/* Gesture History */}
        <div className="p-6 text-white">
          <div className="text-sm text-gray-400 mb-2">Recent Gestures:</div>
          <div className="flex gap-2 flex-wrap">
            {gestureState.gestureHistory.slice(-5).map((gesture, index) => (
              <div
                key={index}
                className="px-2 py-1 bg-white bg-opacity-10 rounded text-xs"
              >
                {gesture.gesture}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Gesture hint overlay for in-app assistance
export const GestureHintOverlay = ({ gesture, visible, onDismiss }) => {
  if (!visible || !gesture) return null;

  const tutorial = GESTURE_TUTORIALS.find(t => t.pattern === gesture);
  if (!tutorial) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white p-4 rounded-lg z-40 max-w-sm"
      >
        <div className="flex items-center gap-3">
          <tutorial.icon className="w-6 h-6 text-blue-400" />
          <div>
            <div className="font-medium">{tutorial.title}</div>
            <div className="text-sm text-gray-300">{tutorial.description}</div>
          </div>
          <button
            onClick={onDismiss}
            className="ml-auto p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
