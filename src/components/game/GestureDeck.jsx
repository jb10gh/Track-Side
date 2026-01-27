import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, AlertTriangle, ChevronUp } from 'lucide-react';
import { useGestureDetection, hapticPatterns } from '../../hooks/useGestureDetection';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';

const actionCards = [
  {
    id: 'goal-us',
    type: EVENT_TYPES.GOAL,
    team: TEAMS.US,
    icon: Target,
    label: 'Goal Us',
    color: 'var(--color-brand)',
    bgColor: 'var(--color-brand-soft)',
    borderColor: 'var(--color-brand)'
  },
  {
    id: 'goal-them',
    type: EVENT_TYPES.GOAL,
    team: TEAMS.THEM,
    icon: Shield,
    label: 'Goal Them',
    color: 'var(--text-primary)',
    bgColor: 'var(--bg-secondary)',
    borderColor: 'var(--color-border)'
  },
  {
    id: 'penalty-us',
    type: EVENT_TYPES.PENALTY,
    team: TEAMS.US,
    icon: AlertTriangle,
    label: 'Penalty Us',
    color: 'var(--text-secondary)',
    bgColor: 'var(--bg-secondary)',
    borderColor: 'var(--color-border)'
  },
  {
    id: 'penalty-them',
    type: EVENT_TYPES.PENALTY,
    team: TEAMS.THEM,
    icon: AlertTriangle,
    label: 'Penalty Them',
    color: 'var(--text-secondary)',
    bgColor: 'var(--bg-secondary)',
    borderColor: 'var(--color-border)'
  }
];

export const GestureDeck = ({ onAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const deckRef = useRef(null);

  const currentCard = actionCards[currentIndex];

  const handleSwipeUp = () => {
    if (currentCard) {
      hapticPatterns.success();
      onAction(currentCard.type, currentCard.team);
      setSwipeDirection('up');
      setTimeout(() => setSwipeDirection(null), 300);
    }
  };

  const handleSwipeLeft = () => {
    setSwipeDirection('left');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % actionCards.length);
      setSwipeDirection(null);
    }, 200);
  };

  const handleSwipeRight = () => {
    setSwipeDirection('right');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + actionCards.length) % actionCards.length);
      setSwipeDirection(null);
    }, 200);
  };

  const { bind, isGesturing, gestureDirection } = useGestureDetection(
    handleSwipeUp,
    null,
    handleSwipeLeft,
    handleSwipeRight
  );

  const cardVariants = {
    center: {
      x: 0,
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    left: {
      x: -100,
      scale: 0.8,
      rotate: -10,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    right: {
      x: 100,
      scale: 0.8,
      rotate: 10,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    swipeUp: {
      y: -200,
      scale: 0.5,
      opacity: 0,
      transition: { type: 'spring', stiffness: 400, damping: 40 }
    }
  };

  const indicatorVariants = {
    active: { scale: 1.2, backgroundColor: 'var(--color-brand)' },
    inactive: { scale: 1, backgroundColor: 'var(--color-border)' }
  };

  return (
    <div className="relative h-64 flex flex-col items-center justify-center">
      {/* Gesture Instructions */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-8 text-center"
          >
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              Swipe up to record • Swipe left/right to change
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Deck */}
      <div className="relative w-full max-w-sm h-48" ref={deckRef}>
        {/* Background Cards */}
        {actionCards.map((card, index) => {
          const position = index === currentIndex ? 'center' :
                          index === (currentIndex - 1 + actionCards.length) % actionCards.length ? 'left' :
                          index === (currentIndex + 1) % actionCards.length ? 'right' : 'hidden';

          if (position === 'hidden') return null;

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0"
              variants={cardVariants}
              animate={swipeDirection === 'up' && index === currentIndex ? 'swipeUp' : position}
              style={{ zIndex: position === 'center' ? 10 : 5 - Math.abs(index - currentIndex) }}
            >
              <div
                className={`
                  h-full rounded-2xl border-2 p-6 flex flex-col items-center justify-center
                  gap-3 shadow-lg backdrop-blur-sm
                  ${position === 'center' ? 
                    `${card.bgColor} ${card.borderColor} border-2` : 
                    'bg-[var(--bg-secondary)] border-[var(--color-border)] opacity-60'
                  }
                `}
              >
                <card.icon 
                  size={position === 'center' ? 48 : 32} 
                  strokeWidth={3}
                  className={position === 'center' ? 
                    `text-[${card.color}]` : 
                    'text-[var(--text-secondary)]'
                  }
                />
                <span className={`
                  font-black uppercase tracking-tighter text-center
                  ${position === 'center' ? 
                    `text-[${card.color}] text-xl italic` : 
                    'text-[var(--text-secondary)] text-sm'
                  }
                `}>
                  {card.label}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Swipe Up Indicator */}
        <AnimatePresence>
          {isGesturing && gestureDirection === 'up' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2"
            >
              <ChevronUp size={32} className="text-[var(--color-brand)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Indicators */}
      <div className="flex gap-2 mt-4">
        {actionCards.map((_, index) => (
          <motion.div
            key={index}
            variants={indicatorVariants}
            animate={index === currentIndex ? 'active' : 'inactive'}
            className="w-2 h-2 rounded-full bg-[var(--color-border)]"
          />
        ))}
      </div>

      {/* Gesture Overlay */}
      <div
        {...bind()}
        className="absolute inset-0 z-20"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
