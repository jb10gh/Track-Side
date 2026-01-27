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
                    console.warn(`[GameStore] Invalid event type: ${type}`);
                    return;
                }
                if (!Object.values(TEAMS).includes(team)) {
                    console.warn(`[GameStore] Invalid team: ${team}`);
                    return;
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
                    return { roster: [trimmedName, ...state.roster].slice(0, 20) }; // Keep last 20 names
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

            deleteMatch: (gameId) => {
                set((state) => ({
                    history: state.history.filter((g) => g.id !== gameId),
                }));
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
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            },
        }),
        {
            name: 'sideline-stats-utility-storage',
        }
    )
);

// Re-export constants for backward compatibility
export { EVENT_TYPES, TEAMS };
