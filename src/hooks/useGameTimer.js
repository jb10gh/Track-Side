import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Custom hook to handle game timer display updates.
 * Follows React Patterns and Clean Code.
 */
export const useGameTimer = () => {
    const { isRunning, getElapsedTime, formatTime, activeGameId } = useGameStore();
    const [displayTime, setDisplayTime] = useState('0:00');

    useEffect(() => {
        if (!activeGameId) return;

        // Initial update
        setDisplayTime(formatTime(getElapsedTime()));

        const interval = setInterval(() => {
            setDisplayTime(formatTime(getElapsedTime()));
        }, 1000);

        return () => clearInterval(interval);
    }, [activeGameId, isRunning, getElapsedTime, formatTime]);

    return displayTime;
};
