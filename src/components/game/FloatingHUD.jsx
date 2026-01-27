import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Minimize2, Maximize2, Timer } from 'lucide-react';
import { useGameStoreClean } from '../../store/gameStoreClean';

// Memoized timer display component
const TimerDisplay = memo(({ time, isRunning, onToggle, onReset, isExpanded, onToggleExpand }) => {
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        relative rounded-2xl backdrop-blur-xl border shadow-2xl
        transition-all duration-300 ease-out
        ${isExpanded ? 
          'bg-black/20 border-white/20 p-6 min-w-[280px]' : 
          'bg-black/10 border-white/10 p-4 min-w-[200px]'
        }
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
      }}
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer size={isExpanded ? 20 : 16} className="text-white/80" />
          <span className="text-white/90 font-semibold text-sm">
            Game Timer
          </span>
        </div>
        
        <button
          onClick={onToggleExpand}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={isExpanded ? 'Minimize' : 'Expand'}
        >
          {isExpanded ? (
            <Minimize2 size={16} className="text-white/70" />
          ) : (
            <Maximize2 size={16} className="text-white/70" />
          )}
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative mb-4">
        <motion.div
          key={time}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            font-mono font-bold text-center
            ${isExpanded ? 'text-4xl' : 'text-2xl'}
            text-white/95 tracking-wider
          `}
        >
          {formatTime(time)}
        </motion.div>
        
        {/* Pulsing indicator when running */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              exit={{ scale: 0 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="relative flex items-center justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={`
            p-3 rounded-full transition-all duration-200
            ${isRunning ? 
              'bg-red-500/20 hover:bg-red-500/30 border border-red-400/30' : 
              'bg-green-500/20 hover:bg-green-500/30 border border-green-400/30'
            }
          `}
          aria-label={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? (
            <Pause size={isExpanded ? 24 : 20} className="text-white/90" />
          ) : (
            <Play size={isExpanded ? 24 : 20} className="text-white/90 ml-1" />
          )}
        </motion.button>

        {isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
            aria-label="Reset"
          >
            <RotateCcw size={16} className="text-white/70" />
          </motion.button>
        )}
      </div>

      {/* Subtle gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-50 pointer-events-none" />
    </motion.div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';

export const FloatingHUD = memo(({ 
  myScore, 
  opponentScore, 
  displayTime, 
  isRunning, 
  onToggleTimer,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef(null);
  const containerRef = useRef(null);

  const handleResetTimer = () => {
    const store = useGameStoreClean.getState();
    store.resetTimer();
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    const startX = touch.clientX - position.x;
    const startY = touch.clientY - position.y;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - startX,
        y: touch.clientY - startY
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Keep within viewport bounds
  useEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width - 20;
      const maxY = window.innerHeight - rect.height - 20;
      
      setPosition(prev => ({
        x: Math.max(20, Math.min(prev.x, maxX)),
        y: Math.max(20, Math.min(prev.y, maxY))
      }));
    };

    window.addEventListener('resize', updateBounds);
    updateBounds();
    
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
        fixed z-50 select-none
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${className}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none'
      }}
    >
      {/* Score Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-4 rounded-2xl bg-black/10 backdrop-blur-xl border border-white/10 p-4 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="text-center">
            <div className="text-white/70 text-xs font-medium mb-1">US</div>
            <motion.div
              key={myScore}
              initial={{ scale: 1.2, rotate: 5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-3xl font-bold text-white/95"
            >
              {myScore}
            </motion.div>
          </div>
          
          <div className="text-white/50 text-lg font-light">:</div>
          
          <div className="text-center">
            <div className="text-white/70 text-xs font-medium mb-1">THEM</div>
            <motion.div
              key={opponentScore}
              initial={{ scale: 1.2, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-3xl font-bold text-white/95"
            >
              {opponentScore}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Timer Component */}
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="cursor-grab active:cursor-grabbing"
      >
        <TimerDisplay
          time={displayTime}
          isRunning={isRunning}
          onToggle={onToggleTimer}
          onReset={handleResetTimer}
          isExpanded={isExpanded}
          onToggleExpand={handleToggleExpand}
        />
      </div>
    </div>
  );
});

FloatingHUD.displayName = 'FloatingHUD';
