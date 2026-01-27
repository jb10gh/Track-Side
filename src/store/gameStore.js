import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EVENT_TYPES, TEAMS } from '../constants/events.js';

// Initial game state - single source of truth
const INITIAL_GAME_STATE = {
    activeGameId: null,
    opponentName: '',
    myScore: 0,
    opponentScore: 0,
    events: [],
    roster: [],
    isRunning: false,
    startTime: null,
    accumulatedTime: 0,
};

export const useGameStore = create(
    persist(
        (set, get) => ({
            ...INITIAL_GAME_STATE,
            history: [],

            startGame: (opponentName) => {
                set({
                    ...INITIAL_GAME_STATE,
                    activeGameId: crypto.randomUUID(),
                    opponentName: opponentName.trim(),
                });
            },

            finishGame: () => {
                const state = get();
                if (!state.activeGameId) return;

                const completedGame = {
                    id: state.activeGameId,
                    opponentName: state.opponentName,
                    myScore: state.myScore,
                    opponentScore: state.opponentScore,
                    events: state.events,
                    finalTime: get().getElapsedTime(),
                    timestamp: Date.now(),
                };

                set((state) => ({
                    ...INITIAL_GAME_STATE,
                    history: [completedGame, ...state.history],
                }));
            },

            addEvent: (type, team, label = '', meta = {}) => {
                // Validation - Fail fast if invalid inputs
                if (!Object.values(EVENT_TYPES).includes(type)) {
                    return; // Silent fail for invalid types
                }
                if (!Object.values(TEAMS).includes(team)) {
                    return; // Silent fail for invalid teams
                }

                const timestamp = Date.now();
                const gameTime = get().getElapsedTime();
                const eventId = crypto.randomUUID();

                const newEvent = {
                    id: eventId,
                    type,
                    team,
                    label,
                    meta,
                    gameTime,
                    timestamp,
                };

                // Add to roster if label is provided
                if (label.trim()) {
                    get().addToRoster(label);
                }

                set((state) => {
                    const newState = {
                        events: [newEvent, ...state.events],
                    };

                    if (type === EVENT_TYPES.GOAL) {
                        if (team === TEAMS.US) newState.myScore = state.myScore + 1;
                        else newState.opponentScore = state.opponentScore + 1;
                    }

                    return newState;
                });
            },

            addToRoster: (name) => {
                const trimmedName = name.trim();
                if (!trimmedName) return;

                set((state) => {
                    if (state.roster.includes(trimmedName)) return state;
                    // Optimize roster size and remove old entries
                    const optimizedRoster = [trimmedName, ...state.roster]
                        .filter((name, index, arr) => arr.indexOf(name) === index) // Remove duplicates
                        .slice(0, 20); // Keep last 20 names
                    return { roster: optimizedRoster };
                });
            },

            clearRoster: () => set({ roster: [] }),

            updateEvent: (eventId, updates) => {
                set((state) => ({
                    events: state.events.map((e) =>
                        e.id === eventId ? { ...e, ...updates } : e
                    ),
                }));
            },

            undoLastEvent: () => {
                set((state) => {
                    if (state.events.length === 0) return state;
                    const [lastEvent, ...remainingEvents] = state.events;

                    const newState = { events: remainingEvents };

                    if (lastEvent.type === EVENT_TYPES.GOAL) {
                        if (lastEvent.team === TEAMS.US) newState.myScore = Math.max(0, state.myScore - 1);
                        else newState.opponentScore = Math.max(0, state.opponentScore - 1);
                    }

                    return newState;
                });
            },

            deleteEvent: (eventId) => {
                set((state) => {
                    const eventToDelete = state.events.find(e => e.id === eventId);
                    if (!eventToDelete) return state;
                    
                    const newState = {
                        events: state.events.filter(e => e.id !== eventId)
                    };
                    
                    // Adjust scores if deleting a goal
                    if (eventToDelete.type === EVENT_TYPES.GOAL) {
                        if (eventToDelete.team === TEAMS.US) {
                            newState.myScore = Math.max(0, state.myScore - 1);
                        } else {
                            newState.opponentScore = Math.max(0, state.opponentScore - 1);
                        }
                    }
                    
                    return newState;
                });
            },

            // Timer Actions
            toggleTimer: () => {
                const state = get();
                if (state.isRunning) {
                    // Pause
                    const now = Date.now();
                    set({
                        isRunning: false,
                        accumulatedTime: state.accumulatedTime + (now - state.startTime),
                        startTime: null,
                    });
                } else {
                    // Start/Resume
                    set({
                        isRunning: true,
                        startTime: Date.now(),
                    });
                }
            },

            resetTimer: () => {
                set({
                    startTime: get().isRunning ? Date.now() : null,
                    accumulatedTime: 0,
                });
            },

            getElapsedTime: () => {
                const state = get();
                if (!state.startTime) return state.accumulatedTime;
                return state.accumulatedTime + (Date.now() - state.startTime);
            },

            formatTime: (ms) => {
                const totalSeconds = Math.floor(ms / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                // Smart duration formatting
                if (hours === 0) {
                    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                } else if (hours === 1) {
                    return `1h ${minutes}m`;
                } else {
                    return `${hours}h ${minutes}m`;
                }
            },

            // Separate function for exports that always uses HH:MM:SS
            formatTimeForExport: (ms) => {
                const totalSeconds = Math.floor(ms / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            },

            // Timer invocation state management
            timerInvocation: {
                isActive: false,
                isPaused: false,
                invocationCount: 0,
                lastInvocationTrigger: null,
                shouldShowReminder: false,
                reminderDismissed: false
            },

            // Enhanced timer actions with invocation logic
            invokeTimer: (trigger = 'manual') => {
                const state = get();
                set((store) => ({
                    timerInvocation: {
                        ...store.timerInvocation,
                        invocationCount: store.timerInvocation.invocationCount + 1,
                        lastInvocationTrigger: trigger,
                        shouldShowReminder: true
                    }
                }));
            },

            startTimerWithConfirmation: () => {
                const state = get();
                if (!state.isRunning) {
                    toggleTimer();
                    set((store) => ({
                        timerInvocation: {
                            ...store.timerInvocation,
                            isActive: true,
                            shouldShowReminder: false
                        }
                    }));
                }
            },

            dismissTimerReminder: () => {
                set((store) => ({
                    timerInvocation: {
                        ...store.timerInvocation,
                        shouldShowReminder: false,
                        reminderDismissed: true
                    }
                }));
            },

            checkTimerState: () => {
                const state = get();
                if (!state.isRunning && state.events.length === 0 && !state.timerInvocation.reminderDismissed) {
                    get().invokeTimer('match_start');
                }
            },

            deleteMatch: (gameId) => {
                set((state) => ({
                    history: state.history.filter((g) => g.id !== gameId),
                }));
            },

            // New actions for historical match editing
            updateHistoricalEvent: (matchId, eventId, updates) => {
                set((state) => ({
                    history: state.history.map(match => {
                        if (match.id !== matchId) return match;
                        
                        const updatedEvents = match.events.map(event =>
                            event.id === eventId ? { ...event, ...updates } : event
                        );
                        
                        // Recalculate scores based on updated events
                        const ourGoals = updatedEvents.filter(e => 
                            e.type === EVENT_TYPES.GOAL && e.team === TEAMS.US
                        ).length;
                        const theirGoals = updatedEvents.filter(e => 
                            e.type === EVENT_TYPES.GOAL && e.team === TEAMS.THEM
                        ).length;
                        
                        return {
                            ...match,
                            events: updatedEvents,
                            myScore: ourGoals,
                            opponentScore: theirGoals,
                            lastEdited: Date.now()
                        };
                    })
                }));
            },
            
            deleteHistoricalEvent: (matchId, eventId) => {
                set((state) => ({
                    history: state.history.map(match => {
                        if (match.id !== matchId) return match;
                        
                        const eventToDelete = match.events.find(e => e.id === eventId);
                        if (!eventToDelete) return match;
                        
                        const updatedEvents = match.events.filter(e => e.id !== eventId);
                        
                        // Recalculate scores
                        let ourGoals = match.myScore;
                        let theirGoals = match.opponentScore;
                        
                        if (eventToDelete.type === EVENT_TYPES.GOAL) {
                            if (eventToDelete.team === TEAMS.US) {
                                ourGoals = Math.max(0, ourGoals - 1);
                            } else {
                                theirGoals = Math.max(0, theirGoals - 1);
                            }
                        }
                        
                        return {
                            ...match,
                            events: updatedEvents,
                            myScore: ourGoals,
                            opponentScore: theirGoals,
                            lastEdited: Date.now()
                        };
                    })
                }));
            },
            
            updateMatchMetadata: (matchId, metadata) => {
                set((state) => ({
                    history: state.history.map(match =>
                        match.id === matchId 
                            ? { ...match, ...metadata, lastEdited: Date.now() }
                            : match
                    )
                }));
            },
            
            addHistoricalEvent: (matchId, eventData) => {
                set((state) => ({
                    history: state.history.map(match => {
                        if (match.id !== matchId) return match;
                        
                        const newEvent = {
                            id: crypto.randomUUID(),
                            timestamp: Date.now(),
                            ...eventData
                        };
                        
                        const updatedEvents = [newEvent, ...match.events];
                        
                        // Recalculate scores
                        let ourGoals = match.myScore;
                        let theirGoals = match.opponentScore;
                        
                        if (newEvent.type === EVENT_TYPES.GOAL) {
                            if (newEvent.team === TEAMS.US) {
                                ourGoals++;
                            } else {
                                theirGoals++;
                            }
                        }
                        
                        return {
                            ...match,
                            events: updatedEvents,
                            myScore: ourGoals,
                            opponentScore: theirGoals,
                            lastEdited: Date.now()
                        };
                    })
                }));
            },
        }),
        {
            name: 'sideline-stats-utility-storage',
        }
    )
);

// Re-export constants for backward compatibility
export { EVENT_TYPES, TEAMS };
