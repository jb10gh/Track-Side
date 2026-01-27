import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Global roster store for player management across games
export const useGlobalRosterStore = create(
    persist(
        (set, get) => ({
            players: [],
            
            addPlayer: (playerData) => {
                const { name, number, position, notes = '' } = playerData;
                const newPlayer = {
                    id: crypto.randomUUID(),
                    name: name.trim(),
                    number: number?.trim() || '',
                    position: position?.trim() || '',
                    notes: notes.trim(),
                    createdAt: Date.now(),
                    lastUsed: Date.now(),
                    gameCount: 0
                };
                
                set((state) => {
                    // Check for duplicates by name
                    const existingPlayer = state.players.find(p => 
                        p.name.toLowerCase() === newPlayer.name.toLowerCase()
                    );
                    
                    if (existingPlayer) {
                        // Update existing player
                        return {
                            players: state.players.map(p => 
                                p.id === existingPlayer.id 
                                    ? { ...p, ...newPlayer, id: existingPlayer.id, lastUsed: Date.now() }
                                    : p
                            )
                        };
                    }
                    
                    return {
                        players: [newPlayer, ...state.players].slice(0, 50) // Limit to 50 players
                    };
                });
            },
            
            updatePlayer: (playerId, updates) => {
                set((state) => ({
                    players: state.players.map(p => 
                        p.id === playerId ? { ...p, ...updates, lastUsed: Date.now() } : p
                    )
                }));
            },
            
            deletePlayer: (playerId) => {
                set((state) => ({
                    players: state.players.filter(p => p.id !== playerId)
                }));
            },
            
            incrementGameCount: (playerId) => {
                set((state) => ({
                    players: state.players.map(p => 
                        p.id === playerId ? { ...p, gameCount: p.gameCount + 1, lastUsed: Date.now() } : p
                    )
                }));
            },
            
            searchPlayers: (query) => {
                const state = get();
                if (!query.trim()) return state.players;
                
                const lowercaseQuery = query.toLowerCase();
                return state.players.filter(player => 
                    player.name.toLowerCase().includes(lowercaseQuery) ||
                    player.number.toLowerCase().includes(lowercaseQuery) ||
                    player.position.toLowerCase().includes(lowercaseQuery)
                );
            },
            
            getRecentPlayers: (limit = 10) => {
                const state = get();
                return state.players
                    .sort((a, b) => b.lastUsed - a.lastUsed)
                    .slice(0, limit);
            },
            
            getFrequentPlayers: (limit = 10) => {
                const state = get();
                return state.players
                    .sort((a, b) => b.gameCount - a.gameCount)
                    .slice(0, limit);
            },
            
            clearRoster: () => {
                set({ players: [] });
            },
            
            importRoster: (rosterData) => {
                try {
                    const players = Array.isArray(rosterData) ? rosterData : [rosterData];
                    players.forEach(player => get().addPlayer(player));
                    return true;
                } catch (error) {
                    console.error('Failed to import roster:', error);
                    return false;
                }
            },
            
            exportRoster: () => {
                const state = get();
                return JSON.stringify(state.players, null, 2);
            }
        }),
        {
            name: 'track-side-global-roster',
            version: 1
        }
    )
);
