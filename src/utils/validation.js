/**
 * Validation utilities for game data
 */

export const validateOpponentName = (name) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Opponent name is required and must be a string');
    }
    
    if (name.trim().length === 0) {
        throw new Error('Opponent name is required and must be a string');
    }
    
    if (name.length > 50) {
        throw new Error('Opponent name must be 50 characters or less');
    }
    
    return name.trim();
};

export const validateEventLabel = (label) => {
    if (!label || typeof label !== 'string') {
        throw new Error('Event label is required and must be a string');
    }
    
    if (label.trim().length === 0) {
        throw new Error('Event label is required and must be a string');
    }
    
    if (label.length > 100) {
        throw new Error('Event label must be 100 characters or less');
    }
    
    return label.trim();
};

export const validateGameTime = (time) => {
    if (typeof time !== 'number' || time < 0) {
        throw new Error('Game time must be a non-negative number');
    }
    
    return time;
};
