import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Game event types - centralized for type safety
export const EVENT_TYPES = {
    goal: 'goal',
    penalty: 'penalty',
    substitution: 'substitution',
    'yellow-card': 'yellow-card',
    'red-card': 'red-card',
} as const;

export type EventType = keyof typeof EVENT_TYPES;

// Team identifiers - centralized for consistency
export const TEAMS = {
    us: 'us',
    them: 'them',
} as const;

export type Team = keyof typeof TEAMS;

// Game event interface
export interface GameEvent {
    id: string;
    type: EventType;
    team: Team;
    label: string;
    meta: Record<string, unknown>;
    gameTime: number;
    timestamp: number;
}

// Completed game interface
export interface CompletedGame {
    id: string;
    opponentName: string;
    myScore: number;
    opponentScore: number;
    events: GameEvent[];
    finalTime: number;
    timestamp: number;
}

// Game state interface
interface GameState {
    activeGameId: string | null;
    opponentName: string;
    myScore: number;
    opponentScore: number;
    events: GameEvent[];
    roster: string[];
    isRunning: boolean;
    startTime: number | null;
    accumulatedTime: number;
    history: CompletedGame[];
}

// Store interface with all methods
interface GameStore extends GameState {
    // Game management
    startGame: (opponentName: string) => void;
    finishGame: () => void;
    
    // Event management
    addEvent: (type: EventType, team: Team, label?: string, meta?: Record<string, unknown>) => void;
    updateEvent: (eventId: string, updates: Partial<GameEvent>) => void;
    undoLastEvent: () => void;
    
    // Roster management
    addToRoster: (name: string) => void;
    clearRoster: () => void;
    
    // History management
    deleteMatch: (gameId: string) => void;
    
    // Timer management
    toggleTimer: () => void;
    resetTimer: () => void;
    getElapsedTime: () => number;
    formatTime: (ms: number) => string;
}

// Initial game state - single source of truth
const INITIAL_GAME_STATE: Omit<GameState, 'history'> = {
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

export const useGameStoreClean = create<GameStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_GAME_STATE,
            history: [],

            startGame: (opponentName: string): void => {
                set({
                    ...INITIAL_GAME_STATE,
                    activeGameId: crypto.randomUUID(),
                    opponentName: opponentName.trim(),
                });
            },

            finishGame: (): void => {
                const state = get();
                if (!state.activeGameId) return;

                const completedGame: CompletedGame = {
                    id: state.activeGameId,
                    opponentName: state.opponentName,
                    myScore: state.myScore,
                    opponentScore: state.opponentScore,
                    events: state.events,
                    finalTime: get().getElapsedTime(),
                    timestamp: Date.now(),
                };

                set({
                    ...INITIAL_GAME_STATE,
                    history: [completedGame, ...state.history],
                });
            },

            addEvent: (type: EventType, team: Team, label = '', meta = {}): void => {
                // Validation
                if (!Object.values(EVENT_TYPES).includes(type)) {
                    console.warn(`[GameStore] Invalid event type: ${type}`);
                    return;
                }
                if (!Object.values(TEAMS).includes(team)) {
                    console.warn(`[GameStore] Invalid team: ${team}`);
                    return;
                }

                const newEvent: GameEvent = {
                    id: crypto.randomUUID(),
                    type,
                    team,
                    label: label.trim(),
                    meta,
                    gameTime: get().getElapsedTime(),
                    timestamp: Date.now(),
                };

                // Add to roster if label is provided
                if (newEvent.label) {
                    get().addToRoster(newEvent.label);
                }

                set((state) => {
                    const newState: Partial<GameStore> = {
                        events: [newEvent, ...state.events],
                    };

                    if (type === EVENT_TYPES.goal) {
                        if (team === TEAMS.us) {
                            newState.myScore = state.myScore + 1;
                        } else {
                            newState.opponentScore = state.opponentScore + 1;
                        }
                    }

                    return newState;
                });
            },

            addToRoster: (name: string): void => {
                const trimmedName = name.trim();
                if (!trimmedName) return;

                set((state) => {
                    if (state.roster.includes(trimmedName)) return state;
                    return { roster: [trimmedName, ...state.roster].slice(0, 20) };
                });
            },

            clearRoster: (): void => set({ roster: [] }),

            updateEvent: (eventId: string, updates: Partial<GameEvent>): void => {
                set((state) => ({
                    events: state.events.map((e) =>
                        e.id === eventId ? { ...e, ...updates } : e
                    ),
                }));
            },

            undoLastEvent: (): void => {
                set((state) => {
                    if (state.events.length === 0) return state;
                    const [lastEvent, ...remainingEvents] = state.events;

                    const newState: Partial<GameStore> = { events: remainingEvents };

                    if (lastEvent.type === EVENT_TYPES.goal) {
                        if (lastEvent.team === TEAMS.us) {
                            newState.myScore = Math.max(0, state.myScore - 1);
                        } else {
                            newState.opponentScore = Math.max(0, state.opponentScore - 1);
                        }
                    }

                    return newState;
                });
            },

            deleteMatch: (gameId: string): void => {
                set((state) => ({
                    history: state.history.filter((g) => g.id !== gameId),
                }));
            },

            // Timer Actions
            toggleTimer: (): void => {
                const state = get();
                if (state.isRunning) {
                    // Pause
                    const now = Date.now();
                    set({
                        isRunning: false,
                        accumulatedTime: state.accumulatedTime + (now - (state.startTime || 0)),
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

            resetTimer: (): void => {
                set({
                    startTime: get().isRunning ? Date.now() : null,
                    accumulatedTime: 0,
                });
            },

            getElapsedTime: (): number => {
                const state = get();
                if (!state.startTime) return state.accumulatedTime;
                return state.accumulatedTime + (Date.now() - state.startTime);
            },

            formatTime: (ms: number): string => {
                const totalSeconds = Math.floor(ms / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            },
        }),
        {
            name: 'track-side-clean-storage',
        }
    )
);
