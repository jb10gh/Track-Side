/**
 * ScoreBoard Evolved Component
 * 
 * Adaptive intelligence display with behavioral modes
 * Implements the "Athletic Intelligence" design system
 */

import React, { useMemo } from 'react';
import { Play, Pause, Clock, Settings, BarChart3 } from 'lucide-react';
import { useBehavioralMode, useUserContext } from '../../hooks/useBehavioralMode';
import { GameContext, UserContext, UIState, ActionType } from '../../types/design-system';

interface ScoreBoardEvolvedProps {
  gameState: GameContext;
  userContext: UserContext;
  onToggleTimer: () => void;
  onAction?: (action: ActionType) => void;
  className?: string;
}

/**
 * Score display component for different modes
 */
const ScoreDisplay = ({ 
  gameState, 
  uiState, 
  isCompact 
}: { 
  gameState: GameContext; 
  uiState: UIState; 
  isCompact: boolean; 
}) => {
  const scoreSize = isCompact ? 'text-3xl' : 'text-4xl sm:text-6xl lg:text-7xl';
  const labelSize = isCompact ? 'text-xs' : 'text-sm';
  
  return (
    <div className={`flex ${isCompact ? 'flex-col space-y-2' : 'flex-col sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-8'}`}>
      {/* Our Team Score */}
      <div className={`text-center ${isCompact ? '' : 'sm:text-left sm:flex-1'}`}>
        <div className={`mb-1 ${labelSize} font-semibold text-blue-400 uppercase tracking-wider`}>
          Our Team
        </div>
        <div className={`${scoreSize} font-black bg-gradient-to-br from-blue-500 to-cyan-600 bg-clip-text text-transparent transition-all duration-300`}>
          {gameState.myScore}
        </div>
      </div>

      {/* Opponent Score */}
      <div className={`text-center ${isCompact ? '' : 'sm:text-right sm:flex-1'}`}>
        <div className={`mb-1 ${labelSize} font-semibold text-orange-400 uppercase tracking-wider`}>
          {gameState.opponentName || 'Opponent'}
        </div>
        <div className={`${scoreSize} font-black bg-gradient-to-br from-orange-500 to-red-600 bg-clip-text text-transparent transition-all duration-300`}>
          {gameState.opponentScore}
        </div>
      </div>
    </div>
  );
};

/**
 * Timer controls component
 */
const TimerControls = ({ 
  gameState, 
  uiState, 
  onToggleTimer,
  isCompact 
}: { 
  gameState: GameContext; 
  uiState: UIState; 
  onToggleTimer: () => void;
  isCompact: boolean;
}) => {
  const buttonSize = isCompact ? 'w-12 h-12' : 'w-14 h-14 sm:w-16 sm:h-16';
  const iconSize = isCompact ? 20 : 24;
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={onToggleTimer}
        className={`${buttonSize} rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
          gameState.isRunning 
            ? 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25' 
            : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/25'
        }`}
      >
        {gameState.isRunning ? (
          <Pause size={iconSize} className="text-white" />
        ) : (
          <Play size={iconSize} className="text-white" />
        )}
      </button>
      
      {!isCompact && (
        <div className="text-center">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Timer
          </div>
          <div className="text-lg font-mono text-white">
            {gameState.timeInGame}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Contextual controls based on UI mode
 */
const ContextualControls = ({ 
  uiState, 
  onAction,
  isCompact 
}: { 
  uiState: UIState; 
  onAction?: (action: ActionType) => void;
  isCompact: boolean;
}) => {
  const buttonSize = isCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';
  
  switch (uiState.mode) {
    case 'SETUP':
      return (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={() => onAction?.('SAVE')}
            className={`${buttonSize} bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200`}
          >
            Start Game
          </button>
          <button
            onClick={() => onAction?.('UNDO')}
            className={`${buttonSize} bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200`}
          >
            Clear
          </button>
        </div>
      );
    
    case 'ANALYSIS':
      return (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={() => onAction?.('EXPORT')}
            className={`${buttonSize} bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2`}
          >
            <BarChart3 size={16} />
            Export
          </button>
          <button
            onClick={() => onAction?.('SHARE')}
            className={`${buttonSize} bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors duration-200`}
          >
            Share
          </button>
        </div>
      );
    
    default:
      return null;
  }
};

/**
 * Main ScoreBoard Evolved component
 */
export const ScoreBoardEvolved: React.FC<ScoreBoardEvolvedProps> = ({
  gameState,
  userContext,
  onToggleTimer,
  onAction,
  className = '',
}) => {
  const uiState = useBehavioralMode(gameState, userContext);
  const isCompact = uiState.layout.density === 'compact' || uiState.mode === 'INTENSIVE';
  
  // Calculate adaptive styling based on mode
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
      {/* Header with mode indicator */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <Clock size={20} className="text-gray-400" />
          <h2 className={`text-lg font-semibold ${
            uiState.mode === 'SETUP' ? 'text-blue-300' :
            uiState.mode === 'ANALYSIS' ? 'text-purple-300' :
            'text-white'
          }`}>
            {uiState.mode === 'SETUP' && 'Game Setup'}
            {uiState.mode === 'STANDARD' && 'Active Game'}
            {uiState.mode === 'INTENSIVE' && 'Intensive Mode'}
            {uiState.mode === 'ONE_HAND' && 'One-Handed'}
            {uiState.mode === 'ANALYSIS' && 'Game Analysis'}
          </h2>
        </div>
        
        {/* Mode-specific indicator */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          uiState.mode === 'SETUP' ? 'bg-blue-500/20 text-blue-300' :
          uiState.mode === 'ANALYSIS' ? 'bg-purple-500/20 text-purple-300' :
          'bg-slate-500/20 text-slate-300'
        }`}>
          {uiState.layout.type === 'compact' && '⚡'}
          {uiState.layout.type === 'thumb-optimized' && '👍'}
          {uiState.layout.type === 'spacious' && '📊'}
        </div>
      </div>

      {/* Main content area */}
      <div className="space-y-6">
        {/* Score Display */}
        <ScoreDisplay 
          gameState={gameState}
          uiState={uiState}
          isCompact={isCompact}
        />

        {/* Timer Controls */}
        <div className="flex justify-center">
          <TimerControls
            gameState={gameState}
            uiState={uiState}
            onToggleTimer={onToggleTimer}
            isCompact={isCompact}
          />
        </div>

        {/* Contextual Controls */}
        <ContextualControls
          uiState={uiState}
          onAction={onAction}
          isCompact={isCompact}
        />
      </div>

      {/* Performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="text-xs text-gray-500 font-mono">
            Mode: {uiState.mode} | Layout: {uiState.layout.type} | Density: {uiState.layout.density}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            FPS: {uiState.performance.maxFPS} | Battery Opt: {uiState.performance.batteryOptimization ? 'On' : 'Off'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoardEvolved;
