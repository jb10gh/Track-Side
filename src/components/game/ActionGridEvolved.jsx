/**
 * ActionGrid Evolved Component
 * 
 * Smart action prediction with thumb-zone optimization
 * Implements the "Athletic Intelligence" design system
 */

import React, { useMemo, useCallback } from 'react';
import { Target, Shield, AlertTriangle, Clock, Lock, Zap, TrendingUp } from 'lucide-react';
import { useBehavioralMode, useUserContext, useGestures, useThumbZone, useProgressiveDisclosure } from '../../hooks';
import { GameContext, UserContext, UIState, ActionType } from '../../types/design-system';

interface ActionGridEvolvedProps {
  gameState: GameContext;
  userContext: UserContext;
  onAction: (action: ActionType, team: 'OUR' | 'OPPONENT') => void;
  className?: string;
}

/**
 * Smart action prediction based on game context
 */
const predictNextActions = (gameContext: GameContext): ActionType[] => {
  const { recentEvents, scoreDifference, timeInGame } = gameContext;
  
  // If close game, suggest strategic actions
  if (Math.abs(scoreDifference) <= 1) {
    return ['GOAL', 'PENALTY', 'TIMEOUT'];
  }
  
  // If blowout, suggest basic actions
  if (Math.abs(scoreDifference) >= 3) {
    return ['GOAL', 'SUBSTITUTION'];
  }
  
  // Default actions
  return ['GOAL', 'PENALTY'];
};

/**
 * Action button component with thumb-zone positioning
 */
const ActionButton = ({
  action,
  team,
  position,
  isPrimary,
  isDisabled,
  onClick,
  size = 'medium',
}: {
  action: ActionType;
  team: 'OUR' | 'OPPONENT';
  position: { x: number; y: number };
  isPrimary: boolean;
  isDisabled: boolean;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}) => {
  const buttonStyles = useMemo(() => {
    const baseStyles = 'rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center';
    
    const sizeStyles = {
      small: 'w-12 h-12 text-sm',
      medium: 'w-16 h-16 text-base',
      large: 'w-20 h-20 text-lg',
    };
    
    const teamStyles = team === 'OUR' 
      ? 'bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-pink-500/25'
      : 'bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-blue-500/25';
    
    const disabledStyles = isDisabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'cursor-pointer';
    
    return `${baseStyles} ${sizeStyles[size]} ${teamStyles} ${disabledStyles}`;
  }, [action, team, isDisabled, size]);

  const iconStyles = 'text-white';
  
  const actionIcons = {
    GOAL: <Target size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    PENALTY: <Shield size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    TIMEOUT: <Clock size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    SUBSTITUTION: <TrendingUp size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    FOUL: <AlertTriangle size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    ASSIST: <Zap size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    SAVE: <Clock size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    UNDO: <Clock size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    EXPORT: <TrendingUp size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
    SHARE: <Zap size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className={iconStyles} />,
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={buttonStyles}
      style={isPrimary ? { position: 'fixed', zIndex: 50 } : {}}
      aria-label={`${action} for ${team}`}
    >
      {actionIcons[action]}
    </button>
  );
};

/**
 * Primary action zone with thumb-optimized buttons
 */
const PrimaryActionZone = ({
  primaryActions,
  gameState,
  userContext,
  onAction,
  isTimerRunning,
}: {
  primaryActions: ActionType[];
  gameState: GameContext;
  userContext: UserContext;
  onAction: (action: ActionType, team: 'OUR' | 'OPPONENT') => void;
  isTimerRunning: boolean;
}) => {
  const { getThumbZonePosition } = useThumbZone();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {primaryActions.map((action, index) => (
        <ActionButton
          key={action}
          action={action}
          team="OUR"
          position={getThumbZonePosition(index)}
          isPrimary={true}
          isDisabled={!isTimerRunning}
          onClick={() => onAction(action, 'OUR')}
          size="large"
        />
      ))}
    </div>
  );
};

/**
 * Secondary action zone for expanded view
 */
const SecondaryActionZone = ({
  secondaryActions,
  gameState,
  userContext,
  onAction,
  isTimerRunning,
}: {
  secondaryActions: ActionType[];
  gameState: GameContext;
  userContext: UserContext;
  onAction: (action: ActionType, team: 'OUR' | 'OPPONENT') => void;
  isTimerRunning: boolean;
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
      {secondaryActions.map((action) => (
        <ActionButton
          key={action}
          action={action}
          team="OUR"
          position={{ x: 0, y: 0 }}
          isPrimary={false}
          isDisabled={!isTimerRunning}
          onClick={() => onAction(action, 'OUR')}
          size="medium"
        />
      ))}
    </div>
  );
};

/**
 * Timer guard notice component
 */
const TimerGuardNotice = () => (
  <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-6 mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center justify-center sm:justify-start">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
          <Clock size={24} className="text-white" />
        </div>
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-white mb-1">
          Start Timer First
        </h3>
        <p className="text-sm text-amber-200">
          Add events after the game timer is running to ensure accurate game timing and event tracking
        </p>
      </div>
      <div className="flex items-center justify-center sm:justify-end space-x-2">
        <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
          <Lock size={16} className="text-slate-400" />
        </div>
        <span className="text-xs font-medium text-amber-300 uppercase tracking-wider hidden sm:block">
          Actions Locked
        </span>
      </div>
    </div>
  </div>
);

/**
 * Main ActionGrid Evolved component
 */
export const ActionGridEvolved: React.FC<ActionGridEvolvedProps> = ({
  gameState,
  userContext,
  onAction,
  className = '',
}) => {
  const uiState = useBehavioralMode(gameState, userContext);
  const { isExpanded, activeSection, toggleSection } = useProgressiveDisclosure();
  const { isGestureActive } = useGestures(userContext, (gesture) => {
    if (gesture.action) {
      onAction(gesture.action, 'OUR');
    }
  });

  // Predict next actions based on game context
  const primaryActions = useMemo(() => 
    predictNextActions(gameState), 
    [gameState]
  );
  
  // Get all available actions
  const allActions = useMemo(() => [
    'GOAL', 'PENALTY', 'TIMEOUT', 'SUBSTITUTION', 'FOUL', 'ASSIST', 'SAVE', 'UNDO', 'EXPORT', 'SHARE'
  ] as ActionType[], []);

  // Filter actions based on mode
  const secondaryActions = useMemo(() => {
    return allActions.filter(action => !primaryActions.includes(action));
  }, [allActions, primaryActions]);

  // Check if timer is running
  const isTimerRunning = gameState.isRunning;

  // Calculate adaptive styling
  const adaptiveStyles = useMemo(() => {
    const baseStyles = 'max-w-4xl mx-auto px-4 py-6 transition-all duration-300';
    
    switch (uiState.mode) {
      case 'SETUP':
        return `${baseStyles} bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-blue-700/50 rounded-2xl`;
      case 'STANDARD':
        return `${baseStyles} bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl`;
      case 'INTENSIVE':
        return `${baseStyles} bg-slate-900/70 backdrop-blur-sm border border-slate-600/50 rounded-2xl`;
      case 'ONE_HAND':
        return `${baseStyles} bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl`;
      case 'ANALYSIS':
        return `${baseStyles} bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-2xl`;
      default:
        return baseStyles;
    }
  }, [uiState.mode]);

  return (
    <div className={`${adaptiveStyles} ${className}`}>
      {/* Timer Guard Notice */}
      {!isTimerRunning && <TimerGuardNotice />}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <Target size={20} className="text-gray-400" />
          <h2 className={`text-lg font-semibold ${
            uiState.mode === 'SETUP' ? 'text-blue-300' :
            uiState.mode === 'ANALYSIS' ? 'text-purple-300' :
            'text-white'
          }`}>
            Actions
          </h2>
        </div>
        
        {/* Expansion toggle */}
        <button
          onClick={() => toggleSection('actions')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isExpanded 
              ? 'bg-slate-600 text-white' 
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Action Content */}
      {isExpanded ? (
        <SecondaryActionZone
          secondaryActions={secondaryActions}
          gameState={gameState}
          userContext={userContext}
          onAction={onAction}
          isTimerRunning={isTimerRunning}
        />
      ) : (
        <div className="text-center text-gray-400 py-8">
          <Target size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">
            Tap "Expand" to see all actions
          </p>
        </div>
      )}

      {/* Primary Action Zone (Thumb Optimized) */}
      <PrimaryActionZone
        primaryActions={primaryActions}
        gameState={gameState}
        userContext={userContext}
        onAction={onAction}
        isTimerRunning={isTimerRunning}
      />

      {/* Gesture Status */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="text-xs text-gray-500 font-mono">
            Gesture Active: {isGestureActive ? 'Yes' : 'No'} | Expanded: {isExpanded ? 'Yes' : 'No'}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            Primary Actions: {primaryActions.join(', ')}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            Timer Running: {isTimerRunning ? 'Yes' : 'No'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionGridEvolved;
