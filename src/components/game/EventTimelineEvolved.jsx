/**
 * EventTimeline Evolved Component
 * 
 * Interactive story surface with momentum visualization
 * Implements the "Athletic Intelligence" design system
 */

import React, { useMemo, useCallback } from 'react';
import { Clock, BarChart3, TrendingUp, Activity, Share2, Download } from 'lucide-react';
import { useBehavioralMode, useUserContext } from '../../hooks/useBehavioralKey';
import { GameContext, UserContext, UIState, ActionType, GameEvent } from '../../types/design-system';

interface EventTimelineEvolvedProps {
  gameState: GameContext;
  userContext: UserContext;
  onAction?: (action: ActionType) => void;
  onUndoLastEvent?: () => void;
  onExport?: () => void;
  className?: string;
}

/**
 * Momentum visualization component
 */
const MomentumChart = ({ events }: { events: GameEvent[] }) => {
  const momentumData = useMemo(() => {
    if (events.length === 0) return [];
    
    return events.map((event, index) => {
      const scoreImpact = event.type === 'GOAL' ? 1 : event.type === 'PENALTY' ? -1 : 0;
      return {
        index,
        time: event.gameTime,
        momentum: scoreImpact,
        cumulative: 0, // Will be calculated below
      };
    }).map((item, index) => ({
      ...item,
      cumulative: item.momentum + (events[index - 1]?.cumulative || 0),
    }));
  }, [events]);

  const maxMomentum = Math.max(
    ...momentumData.map(d => Math.abs(d.cumulative)),
    ...momentumData.map(d => Math.abs(d.cumulative))
  );

  return (
    <div className="h-20 mb-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-red-500/20 rounded-lg opacity-50" />
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {momentumData.map((point, index) => {
          const x = (point.time / Math.max(...events.map(e => e.gameTime)) * 100;
          const y = 50 - (point.cumulative / maxMomentum) * 40;
          const height = Math.abs(point.cumulative / maxMomentum) * 40;
          
          return (
            <rect
              key={index}
              x={x}
              y={y - height / 2}
              width={2}
              height={height}
              className={point.momentum > 0 ? 'fill-green-500/50' : 'fill-red-500/50'}
              rx="1"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <BarChart3 size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

/**
 * Timeline scrubber component
 */
const TimelineScrubber = ({
  events,
  currentTime,
  onScrub,
}: {
  events: GameEvent[];
  currentTime: number;
  onScrub: (time: number) => void;
}) => {
  const maxTime = Math.max(...events.map(e => e.gameTime));
  const progress = currentTime / maxTime;
  
  return (
    <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full w-1 bg-blue-500/30 rounded-full cursor-pointer"
        style={{ width: `${progress * 100}%` }}
        onClick={() => onScrub(currentTime)}
        role="slider"
        aria-label="Game timeline scrubber"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress * 100}
      />
      <div className="absolute top-1/2 left-0 w-2 h-4 bg-white rounded-full shadow-lg transform -translate-x-1/2" />
    </div>
  );
};

/**
 * Key moments highlights component
 */
const KeyMoments = ({ events }: { events: GameEvent[] }) => {
  const keyMoments = useMemo(() => {
    return events.filter(event => 
      event.type === 'GOAL' || event.type === 'PENALTY'
    ).slice(-3); // Last 3 key moments
  }, [events]);

  if (keyMoments.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Key Moments</h3>
      {keyMoments.map((event, index) => (
        <div
          key={event.id}
          className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg border border-slate-600/50"
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              event.type === 'GOAL' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-white font-medium">
              {event.type}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {event.gameTime}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Event item component
 */
const EventItem = ({
  event,
  onEdit,
  onDelete,
  isCompact,
}: {
  event: GameEvent;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  isCompact?: boolean;
}) => {
  const eventIcons = {
    GOAL: <Target size={16} className="text-green-400" />,
    PENALTY: <Shield size={16} className="text-red-400" />,
    TIMEOUT: <Clock size={16} className="text-yellow-400" />,
    SUBSTITUTION: <TrendingUp size={16} className="text-blue-400" />,
    FOUL: <AlertTriangle size={16} className="text-orange-400" />,
    ASSIST: <Activity size={16} className="text-purple-400" />,
    SAVE: <Download size={16} className="text-gray-400" />,
    UNDO: <Clock size={16} className="text-gray-400" />,
  };

  return (
    <div
      className={`flex items-center justify-between p-3 ${
        isCompact ? 'bg-slate-700/30 rounded-lg' : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl'
      } transition-all duration-200 hover:bg-slate-700/70`}
    >
      <div className="flex items-center space-x-3">
        {eventIcons[event.type]}
        <div className="flex-1">
          <div className="text-sm font-medium text-white">
            {event.type}
          </div>
          {event.label && (
            <div className="text-xs text-gray-400">
              {event.label}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {!isCompact && (
          <button
            onClick={() => onEdit?.( event.id)}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
            aria-label={`Edit ${event.type} event`}
          >
            <Clock size={16} />
          </button>
        )}
        <button
          onClick={() => onDelete?.( event.id)}
          className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
          aria-label={`Delete ${event.type} event`}
        >
          <Clock size={16} />
        </button>
      </div>
      
      <div className="text-xs text-gray-400">
        {event.gameTime}
      </div>
    </div>
  );
};

/**
 * Main EventTimeline Evolved component
 */
export const EventTimelineEvolved: React.FC<EventTimelineEvolvedProps> = ({
  gameState,
  userContext,
  onAction,
  onUndoLastEvent,
  onExport,
  className = '',
}) => {
  const uiState = useBehavioralMode(gameState, userContext);
  const isCompact = uiState.layout.density === 'compact' || uiState.mode === 'INTENSIVE';
  const currentTime = gameState.timeInGame;

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

  // Sort events by time
  const sortedEvents = useMemo(() => 
    [...gameState.events].sort((a, b) => a.gameTime - b.gameTime), 
    [gameState.events]
  );

  return (
    <div className={`${adaptiveStyles} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <Clock size={20} className="text-gray-400" />
          <h2 className={`text-lg font-semibold ${
            uiState.mode === 'SETUP' ? 'text-blue-300' :
            uiState.mode === 'ANALYSIS' ? 'text-purple-300' :
            'text-white'
          }`}>
            Game Timeline
          </h2>
        </div>
        
        {/* Event count */}
        <div className="px-3 py-1 rounded-lg bg-slate-600 text-white text-sm font-medium">
          {sortedEvents.length} Events
        </div>
      </div>

      {/* Timeline Content */}
      <div className="space-y-4">
        {/* Momentum Chart */}
        {sortedEvents.length > 0 && <MomentumChart events={sortedEvents} />}

        {/* Timeline Scrubber */}
        {sortedEvents.length > 0 && (
          <TimelineScrubber
            events={sortedEvents}
            currentTime={currentTime}
            onScrub={(time) => {
              // Convert percentage back to actual time
              const actualTime = (time / 100) * Math.max(...sortedEvents.map(e => e.gameTime));
              console.log('Timeline scrubbed to:', actualTime);
            }}
          />
        )}

        {/* Key Moments */}
        {sortedEvents.length > 0 && <KeyMoments events={sortedEvents} />}

        {/* Event List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onEdit={onUndoLastEvent ? undefined : (id) => onAction?.('UNDO')}
              onDelete={onDelete}
              isCompact={isCompact}
            />
          ))}
        </div>

        {/* Empty State */}
        {sortedEvents.length === 0 && (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-sm">
              No events yet. Start tracking to see the timeline here.
            </p>
          </div>
        )}
      </div>

      {/* Export Controls */}
      {uiState.mode === 'ANALYSIS' && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onExport}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Share2 size={16} />
            Export
          </button>
        </div>
      )}

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="text-xs text-gray-500 font-mono">
            Events: {sortedEvents.length}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            Current Time: {currentTime}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            Mode: {uiState.mode} | Compact: {isCompact ? 'Yes' : 'No'}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTimelineEvolved;
