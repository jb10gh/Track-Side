import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SPORTS, getSportConfig, calculateSportScore } from '../constants/sports';

// Multi-sport game store
export const useSportStore = create(
    persist(
        (set, get) => ({
            currentSport: SPORTS.SOCCER,
            sportSettings: {},
            
            // Sport management
            setCurrentSport: (sportType) => {
                const config = getSportConfig(sportType);
                set({
                    currentSport: sportType,
                    sportSettings: {
                        ...config,
                        customRules: get().sportSettings.customRules || {}
                    }
                });
            },
            
            updateSportSettings: (updates) => {
                set((state) => ({
                    sportSettings: {
                        ...state.sportSettings,
                        ...updates
                    }
                }));
            },
            
            // Custom sport creation
            createCustomSport: (sportData) => {
                const customSport = {
                    id: `custom-${Date.now()}`,
                    name: sportData.name,
                    icon: sportData.icon || '🏆',
                    duration: sportData.duration || 60 * 60 * 1000,
                    periods: sportData.periods || [{ name: 'Game', duration: sportData.duration || 60 * 60 * 1000 }],
                    scoreLabels: sportData.scoreLabels || { home: 'Points', away: 'Points' },
                    teamSize: sportData.teamSize || 5,
                    eventTypes: sportData.eventTypes || {},
                    positions: sportData.positions || [],
                    scoringEvents: sportData.scoringEvents || [],
                    cardEvents: sportData.cardEvents || [],
                    isCustom: true
                };
                
                set((state) => ({
                    sportSettings: {
                        ...state.sportSettings,
                        customSports: {
                            ...state.sportSettings.customSports,
                            [customSport.id]: customSport
                        }
                    }
                }));
                
                return customSport;
            },
            
            // Sport-specific game creation
            createSportGame: (opponentName, sportType = null) => {
                const sport = sportType || get().currentSport;
                const config = getSportConfig(sport);
                
                const game = {
                    id: crypto.randomUUID(),
                    sportType: sport,
                    opponentName: opponentName.trim(),
                    myScore: 0,
                    opponentScore: 0,
                    events: [],
                    roster: [],
                    isRunning: false,
                    startTime: null,
                    accumulatedTime: 0,
                    currentPeriod: 0,
                    periodScores: {
                        my: config.periods.map(() => 0),
                        opponent: config.periods.map(() => 0)
                    },
                    timestamp: Date.now(),
                    sportConfig: config
                };
                
                return game;
            },
            
            // Sport-specific event handling
            addSportEvent: (game, eventType, team, label = '', meta = {}) => {
                const config = getSportConfig(game.sportType);
                const eventConfig = config.eventTypes[eventType];
                
                if (!eventConfig) {
                    console.warn(`Event type ${eventType} not valid for ${game.sportType}`);
                    return;
                }
                
                const newEvent = {
                    id: crypto.randomUUID(),
                    type: eventType,
                    team,
                    label,
                    meta: { ...eventConfig.meta, ...meta },
                    gameTime: get().getGameTime(game),
                    timestamp: Date.now(),
                    period: game.currentPeriod,
                    points: eventConfig.points || 0
                };
                
                // Update scores for scoring events
                const updatedGame = { ...game };
                updatedGame.events = [newEvent, ...game.events];
                
                if (config.scoringEvents.includes(eventType)) {
                    if (team === 'us') {
                        updatedGame.myScore += eventConfig.points || 0;
                        // Update period score
                        if (updatedGame.periodScores) {
                            updatedGame.periodScores.my[game.currentPeriod] += eventConfig.points || 0;
                        }
                    } else {
                        updatedGame.opponentScore += eventConfig.points || 0;
                        // Update period score
                        if (updatedGame.periodScores) {
                            updatedGame.periodScores.opponent[game.currentPeriod] += eventConfig.points || 0;
                        }
                    }
                }
                
                return updatedGame;
            },
            
            // Sport-specific timer management
            getGameTime: (game) => {
                if (!game.startTime) return game.accumulatedTime;
                return game.accumulatedTime + (Date.now() - game.startTime);
            },
            
            formatGameTime: (game, sportType = null) => {
                const sport = sportType || game?.sportType || SPORTS.SOCCER;
                const config = getSportConfig(sport);
                const gameTime = get().getGameTime(game || {});
                
                // Special formatting for different sports
                if (sport === SPORTS.BASKETBALL) {
                    const totalSeconds = Math.floor(gameTime / 1000);
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    const tenths = Math.floor((gameTime % 1000) / 100);
                    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
                }
                
                if (sport === SPORTS.TENNIS) {
                    // Tennis scoring is complex, simplified here
                    const points = ['0', '15', '30', '40'];
                    const totalPoints = Math.floor(gameTime / 10000) % 4;
                    return points[totalPoints];
                }
                
                // Default formatting (soccer, hockey, football, etc.)
                const totalSeconds = Math.floor(gameTime / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            },
            
            // Period management
            advancePeriod: (game) => {
                const config = getSportConfig(game.sportType);
                if (game.currentPeriod < config.periods.length - 1) {
                    return {
                        ...game,
                        currentPeriod: game.currentPeriod + 1,
                        accumulatedTime: 0,
                        startTime: Date.now()
                    };
                }
                return game;
            },
            
            getCurrentPeriodInfo: (game) => {
                const config = getSportConfig(game.sportType);
                const currentPeriodConfig = config.periods[game.currentPeriod];
                return {
                    name: currentPeriodConfig.name,
                    duration: currentPeriodConfig.duration,
                    targetScore: currentPeriodConfig.targetScore,
                    isFinal: game.currentPeriod === config.periods.length - 1
                };
            },
            
            // Sport-specific analytics
            getSportStats: (game) => {
                const config = getSportConfig(game.sportType);
                const events = game.events || [];
                
                const stats = {
                    basic: {
                        score: { my: game.myScore, opponent: game.opponentScore },
                        totalEvents: events.length,
                        periodScores: game.periodScores
                    },
                    events: {},
                    efficiency: {},
                    timeline: []
                };
                
                // Analyze events by type
                Object.keys(config.eventTypes).forEach(eventType => {
                    const myEvents = events.filter(e => e.type === eventType && e.team === 'us');
                    const theirEvents = events.filter(e => e.type === eventType && e.team === 'them');
                    
                    stats.events[eventType] = {
                        my: myEvents.length,
                        their: theirEvents.length,
                        total: myEvents.length + theirEvents.length
                    };
                });
                
                // Calculate efficiency for scoring events
                config.scoringEvents.forEach(eventType => {
                    const eventConfig = config.eventTypes[eventType];
                    const myEvents = events.filter(e => e.type === eventType && e.team === 'us');
                    const theirEvents = events.filter(e => e.type === eventType && e.team === 'them');
                    
                    stats.efficiency[eventType] = {
                        my: {
                            attempts: myEvents.length,
                            points: myEvents.reduce((sum, e) => sum + (e.points || 0), 0),
                            average: myEvents.length > 0 ? (myEvents.reduce((sum, e) => sum + (e.points || 0), 0) / myEvents.length).toFixed(2) : 0
                        },
                        their: {
                            attempts: theirEvents.length,
                            points: theirEvents.reduce((sum, e) => sum + (e.points || 0), 0),
                            average: theirEvents.length > 0 ? (theirEvents.reduce((sum, e) => sum + (e.points || 0), 0) / theirEvents.length).toFixed(2) : 0
                        }
                    };
                });
                
                return stats;
            },
            
            // Sport validation
            validateSportEvent: (event, sportType) => {
                const config = getSportConfig(sportType);
                const eventConfig = config.eventTypes[event.type];
                
                if (!eventConfig) {
                    return { valid: false, error: `Event type ${event.type} not valid for ${sportType}` };
                }
                
                // Check required fields
                if (config.scoringEvents.includes(event.type) && !event.team) {
                    return { valid: false, error: 'Scoring events must specify team' };
                }
                
                // Sport-specific validations
                if (sportType === SPORTS.BASKETBALL && event.type === 'FREE_THROW') {
                    if (event.meta?.made === undefined) {
                        return { valid: false, error: 'Free throw must specify if made or missed' };
                    }
                }
                
                return { valid: true };
            },
            
            // Export sport-specific data
            exportSportGame: (game, format = 'json') => {
                const config = getSportConfig(game.sportType);
                const exportData = {
                    gameInfo: {
                        sport: game.sportType,
                        sportName: config.name,
                        opponentName: game.opponentName,
                        finalScore: {
                            my: game.myScore,
                            opponent: game.opponentScore
                        },
                        duration: get().getGameTime(game),
                        timestamp: game.timestamp
                    },
                    periods: game.periodScores || {},
                    events: game.events.map(event => ({
                        ...event,
                        eventName: config.eventTypes[event.type]?.name || event.type,
                        points: config.eventTypes[event.type]?.points || 0
                    })),
                    stats: get().getSportStats(game)
                };
                
                if (format === 'csv') {
                    // Convert to CSV format
                    const headers = ['Timestamp', 'Period', 'Event', 'Team', 'Player', 'Points'];
                    const rows = exportData.events.map(event => [
                        new Date(event.timestamp).toLocaleString(),
                        event.period + 1,
                        event.eventName,
                        event.team,
                        event.label || event.meta?.player || '',
                        event.points
                    ]);
                    
                    return [headers, ...rows].map(row => row.join(',')).join('\n');
                }
                
                return JSON.stringify(exportData, null, 2);
            }
        }),
        {
            name: 'track-side-sport-storage',
            version: 1
        }
    )
);
