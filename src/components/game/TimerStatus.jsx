import React from 'react';
import { Clock, Play, Pause } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

/**
 * Timer Status Component - UI/UX Pro Max Design
 * 
 * Features:
 * - Clear visual state indication with color coding
 * - Pulsing animation for inactive timer (attention-grabbing)
 * - Large touch targets for mobile usability
 * - Accessibility with proper ARIA labels
 * - Glassmorphism design for modern look
 */
export const TimerStatus = ({ className = '' }) => {
    const { 
        isRunning, 
        displayTime, 
        toggleTimer, 
        timerInvocation,
        startTimerWithConfirmation 
    } = useGameStore();

    // Dynamic styling based on timer state
    const getStatusStyles = () => {
        if (isRunning) {
            return {
                container: 'bg-green-500/10 border-green-500/30 text-green-600',
                icon: 'text-green-600',
                text: 'text-green-600 font-mono font-bold',
                button: 'bg-green-600 hover:bg-green-700 text-white'
            };
        } else {
            return {
                container: 'bg-red-500/10 border-red-500/30 text-red-600 animate-pulse',
                icon: 'text-red-600',
                text: 'text-red-600 font-mono font-bold',
                button: 'bg-red-600 hover:bg-red-700 text-white'
            };
        }
    };

    const styles = getStatusStyles();

    return (
        <div 
            className={`
                timer-status 
                flex items-center gap-3 
                px-4 py-2 
                rounded-xl 
                border 
                backdrop-blur-sm
                transition-all duration-300
                ${styles.container}
                ${className}
            `}
            role="timer"
            aria-label={`Game timer ${isRunning ? 'running' : 'stopped'}`}
        >
            {/* Timer Icon */}
            <div className={`timer-icon ${styles.icon}`}>
                {isRunning ? (
                    <Play size={20} className="animate-pulse" />
                ) : (
                    <Clock size={20} />
                )}
            </div>

            {/* Time Display */}
            <div className={`timer-display ${styles.text}`}>
                {displayTime}
            </div>

            {/* Action Button */}
            {!isRunning && (
                <button
                    onClick={startTimerWithConfirmation}
                    className={`
                        timer-start-button
                        px-3 py-1 
                        rounded-lg 
                        text-sm 
                        font-semibold
                        transition-colors
                        ${styles.button}
                    `}
                    aria-label="Start game timer"
                >
                    Start
                </button>
            )}

            {/* Visual Indicator */}
            {isRunning && (
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            )}
        </div>
    );
};
