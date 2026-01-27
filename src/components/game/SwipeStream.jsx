import React, { useState, useRef, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, AlertTriangle, Undo2, Edit, X } from 'lucide-react';
import { useGameStoreClean, EVENT_TYPES, TEAMS } from '../../store/gameStoreClean';

// Memoized event icon component
const EventIcon = memo(({ type, team, size = 20 }) => {
  const iconProps = { size, strokeWidth: 2 };
  
  switch (type) {
    case EVENT_TYPES.goal:
      return team === TEAMS.us ? (
        <Target {...iconProps} className="text-green-400" />
      ) : (
        <Shield {...iconProps} className="text-red-400" />
      );
    case EVENT_TYPES.penalty:
      return <AlertTriangle {...iconProps} className="text-yellow-400" />;
    default:
      return <div {...iconProps} className="bg-gray-400 rounded-full" />;
  }
});

EventIcon.displayName = 'EventIcon';

// Memoized event item component
const EventItem = memo(({ 
  event, 
  onEdit, 
  onDelete, 
  isActive,
  formatTime 
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className={`
        relative group cursor-pointer
        ${isActive ? 'scale-105' : ''}
      `}
      onDoubleClick={() => onEdit(event)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`
        flex items-center gap-3 p-3 rounded-xl
        transition-all duration-200
        ${isActive ? 
          'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30' : 
          'bg-black/5 hover:bg-black/10 border border-transparent'
        }
        backdrop-blur-sm
      `}>
        {/* Event Icon */}
        <div className="flex-shrink-0">
          <EventIcon type={event.type} team={event.team} />
        </div>

        {/* Event Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`
              font-semibold text-sm
              ${event.team === TEAMS.us ? 'text-green-600' : 'text-red-600'}
            `}>
              {event.team === TEAMS.us ? 'US' : 'THEM'}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {event.type.replace('-', ' ')}
            </span>
          </div>
          
          {event.label && (
            <div className="text-sm text-gray-700 truncate">
              {event.label}
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-1">
            {formatTime(event.gameTime)}
          </div>
        </div>

        {/* Quick Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(event);
                }}
                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition-colors"
                aria-label="Edit event"
              >
                <Edit size={14} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event.id);
                }}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-colors"
                aria-label="Delete event"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeEvent"
          className="absolute inset-0 rounded-xl border-2 border-blue-400 pointer-events-none"
          style={{ zIndex: 10 }}
        />
      )}
    </motion.div>
  );
});

EventItem.displayName = 'EventItem';

export const SwipeStream = memo(({ 
  events, 
  onUndo, 
  onEdit, 
  formatTime,
  className = ""
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const streamRef = useRef(null);

  // Memoize sorted events
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => b.timestamp - a.timestamp);
  }, [events]);

  const handleUndo = useCallback(() => {
    onUndo();
    setActiveIndex(0);
  }, [onUndo]);

  const handleEdit = useCallback((event) => {
    onEdit(event);
  }, [onEdit]);

  const handleDelete = useCallback((eventId) => {
    const store = useGameStoreClean.getState();
    store.updateEvent(eventId, { deleted: true });
    setActiveIndex(0);
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const offset = e.clientX - dragStart;
    setDragOffset(offset);
    
    // Change active event based on drag distance
    const itemWidth = 300; // Approximate item width
    const indexChange = Math.floor(offset / itemWidth);
    const newIndex = Math.max(0, Math.min(sortedEvents.length - 1, indexChange));
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [isDragging, dragStart, activeIndex, sortedEvents.length]);

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart(touch.clientX);
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const offset = touch.clientX - touch.clientX;
    setDragOffset(offset);
    
    const itemWidth = 300;
    const indexChange = Math.floor(offset / itemWidth);
    const newIndex = Math.max(0, Math.min(sortedEvents.length - 1, indexChange));
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [isDragging, activeIndex, sortedEvents.length]);

  // Global event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove]);

  if (sortedEvents.length === 0) {
    return (
      <div className={className}>
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm mb-2">No events yet</div>
          <div className="text-gray-500 text-xs">Start recording game events</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Game Events</h3>
        
        <button
          onClick={handleUndo}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          aria-label="Undo last event"
        >
          <Undo2 size={16} />
          <span className="text-sm font-medium">Undo</span>
        </button>
      </div>

      {/* Swipe Stream */}
      <div
        ref={streamRef}
        className="relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <motion.div
          className="flex gap-3 pb-4"
          animate={{
            x: `${-activeIndex * 300 + dragOffset}px`
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        >
          <AnimatePresence mode="popLayout">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                className="flex-shrink-0 w-[300px]"
              >
                <EventItem
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isActive={index === activeIndex}
                  formatTime={formatTime}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Indicators */}
        <div className="flex justify-center gap-1 mt-2">
          {sortedEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-200
                ${index === activeIndex ? 
                  'bg-blue-500 w-6' : 
                  'bg-gray-300 hover:bg-gray-400'
                }
              `}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          Swipe or drag to navigate • Double-tap to edit
        </p>
      </div>
    </div>
  );
});

SwipeStream.displayName = 'SwipeStream';
