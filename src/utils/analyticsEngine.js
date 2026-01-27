// Analytics engine for game statistics and insights

export class AnalyticsEngine {
    constructor() {
        this.cache = new Map();
    }

    // Calculate real-time game statistics
    calculateGameStats(game) {
        const cacheKey = `game-stats-${game.id || 'current'}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const stats = {
            basic: this.calculateBasicStats(game),
            momentum: this.calculateMomentum(game),
            efficiency: this.calculateEfficiency(game),
            possession: this.calculatePossession(game),
            timeline: this.calculateTimelineStats(game)
        };

        this.cache.set(cacheKey, stats);
        return stats;
    }

    calculateBasicStats(game) {
        const events = game.events || [];
        const myGoals = events.filter(e => e.type === 'goal' && e.team === 'us').length;
        const theirGoals = events.filter(e => e.type === 'goal' && e.team === 'them').length;
        const myPenalties = events.filter(e => e.type === 'penalty' && e.team === 'us').length;
        const theirPenalties = events.filter(e => e.type === 'penalty' && e.team === 'them').length;
        const myCards = events.filter(e => e.type.includes('card') && e.team === 'us').length;
        const theirCards = events.filter(e => e.type.includes('card') && e.team === 'them').length;

        return {
            score: { my: myGoals, their: theirGoals },
            penalties: { my: myPenalties, their: theirPenalties },
            cards: { my: myCards, their: theirCards },
            totalEvents: events.length,
            eventsPerMinute: events.length > 0 ? (events.length / (game.finalTime / 60000)).toFixed(2) : 0
        };
    }

    calculateMomentum(game) {
        const events = game.events || [];
        const momentumWindow = 5 * 60 * 1000; // 5 minutes
        const now = game.finalTime || Date.now();
        
        let myMomentum = 0;
        let theirMomentum = 0;

        events.forEach(event => {
            const eventAge = now - event.timestamp;
            if (eventAge <= momentumWindow) {
                const weight = 1 - (eventAge / momentumWindow);
                
                if (event.team === 'us') {
                    if (event.type === 'goal') myMomentum += 3 * weight;
                    if (event.type === 'penalty') myMomentum += 1 * weight;
                    if (event.type.includes('card')) myMomentum -= 2 * weight;
                } else {
                    if (event.type === 'goal') theirMomentum += 3 * weight;
                    if (event.type === 'penalty') theirMomentum += 1 * weight;
                    if (event.type.includes('card')) theirMomentum -= 2 * weight;
                }
            }
        });

        return {
            my: myMomentum,
            their: theirMomentum,
            leader: myMomentum > theirMomentum ? 'us' : theirMomentum > myMomentum ? 'them' : 'neutral',
            differential: myMomentum - theirMomentum
        };
    }

    calculateEfficiency(game) {
        const events = game.events || [];
        const myGoals = events.filter(e => e.type === 'goal' && e.team === 'us');
        const theirGoals = events.filter(e => e.type === 'goal' && e.team === 'them');
        const myPenalties = events.filter(e => e.type === 'penalty' && e.team === 'us');
        const theirPenalties = events.filter(e => e.type === 'penalty' && e.team === 'them');

        const myPenaltyGoals = myGoals.filter(g => g.meta?.isPK).length;
        const theirPenaltyGoals = theirGoals.filter(g => g.meta?.isPK).length;

        return {
            my: {
                penaltyConversionRate: myPenalties.length > 0 ? (myPenaltyGoals / myPenalties.length * 100).toFixed(1) : 0,
                goalsPerPenalty: myPenalties.length > 0 ? (myGoals.length / myPenalties.length).toFixed(2) : 0
            },
            their: {
                penaltyConversionRate: theirPenalties.length > 0 ? (theirPenaltyGoals / theirPenalties.length * 100).toFixed(1) : 0,
                goalsPerPenalty: theirPenalties.length > 0 ? (theirGoals.length / theirPenalties.length).toFixed(2) : 0
            }
        };
    }

    calculatePossession(game) {
        // Estimate possession based on event frequency and types
        const events = game.events || [];
        const myEvents = events.filter(e => e.team === 'us').length;
        const theirEvents = events.filter(e => e.team === 'them').length;
        const totalEvents = myEvents + theirEvents;

        if (totalEvents === 0) return { my: 50, their: 50 };

        // Weight goals and penalties more heavily
        const myWeighted = myEvents + (events.filter(e => e.type === 'goal' && e.team === 'us').length * 2);
        const theirWeighted = theirEvents + (events.filter(e => e.type === 'goal' && e.team === 'them').length * 2);
        const totalWeighted = myWeighted + theirWeighted;

        return {
            my: Math.round((myWeighted / totalWeighted) * 100),
            their: Math.round((theirWeighted / totalWeighted) * 100)
        };
    }

    calculateTimelineStats(game) {
        const events = game.events || [];
        const timeline = [];
        
        // Create timeline segments (every 5 minutes)
        const segmentDuration = 5 * 60 * 1000; // 5 minutes
        const totalDuration = game.finalTime || 0;
        const segments = Math.ceil(totalDuration / segmentDuration);

        for (let i = 0; i < segments; i++) {
            const segmentStart = i * segmentDuration;
            const segmentEnd = Math.min((i + 1) * segmentDuration, totalDuration);
            
            const segmentEvents = events.filter(e => 
                e.gameTime >= segmentStart && e.gameTime < segmentEnd
            );

            const myGoals = segmentEvents.filter(e => e.type === 'goal' && e.team === 'us').length;
            const theirGoals = segmentEvents.filter(e => e.type === 'goal' && e.team === 'them').length;
            
            timeline.push({
                segment: i + 1,
                time: `${i * 5}-${(i + 1) * 5}min`,
                myGoals,
                theirGoals,
                totalEvents: segmentEvents.length,
                momentum: myGoals > theirGoals ? 'us' : theirGoals > myGoals ? 'them' : 'neutral'
            });
        }

        return timeline;
    }

    // Player performance analysis
    analyzePlayerPerformance(games, playerName) {
        const playerGames = games.filter(game => 
            game.events.some(event => event.meta?.player === playerName || event.label === playerName)
        );

        if (playerGames.length === 0) return null;

        const stats = {
            gamesPlayed: playerGames.length,
            goals: 0,
            penalties: 0,
            cards: 0,
            penaltyGoals: 0,
            averageGoalsPerGame: 0,
            efficiency: 0
        };

        playerGames.forEach(game => {
            const playerEvents = game.events.filter(event => 
                event.meta?.player === playerName || event.label === playerName
            );

            playerEvents.forEach(event => {
                if (event.type === 'goal') {
                    stats.goals++;
                    if (event.meta?.isPK) {
                        stats.penalties++;
                        stats.penaltyGoals++;
                    }
                }
                if (event.type === 'penalty') {
                    stats.penalties++;
                }
                if (event.type.includes('card')) {
                    stats.cards++;
                }
            });
        });

        stats.averageGoalsPerGame = (stats.goals / playerGames.length).toFixed(2);
        stats.efficiency = stats.penalties > 0 ? ((stats.penaltyGoals / stats.penalties) * 100).toFixed(1) : 0;

        return stats;
    }

    // Season-wide analysis
    analyzeSeason(games) {
        const seasonStats = {
            totalGames: games.length,
            wins: 0,
            losses: 0,
            draws: 0,
            totalGoals: 0,
            totalConceded: 0,
            cleanSheets: 0,
            averageGoalsPerGame: 0,
            bestPerformance: null,
            worstPerformance: null,
            playerStats: {},
            trends: this.calculateTrends(games)
        };

        games.forEach(game => {
            const myGoals = game.myScore || 0;
            const theirGoals = game.opponentScore || 0;

            seasonStats.totalGoals += myGoals;
            seasonStats.totalConceded += theirGoals;

            if (myGoals > theirGoals) seasonStats.wins++;
            else if (myGoals < theirGoals) seasonStats.losses++;
            else seasonStats.draws++;

            if (theirGoals === 0) seasonStats.cleanSheets++;

            // Track best/worst performances
            const goalDifference = myGoals - theirGoals;
            if (!seasonStats.bestPerformance || goalDifference > seasonStats.bestPerformance.goalDifference) {
                seasonStats.bestPerformance = { ...game, goalDifference };
            }
            if (!seasonStats.worstPerformance || goalDifference < seasonStats.worstPerformance.goalDifference) {
                seasonStats.worstPerformance = { ...game, goalDifference };
            }

            // Aggregate player stats
            game.events.forEach(event => {
                const playerName = event.meta?.player || event.label;
                if (playerName) {
                    if (!seasonStats.playerStats[playerName]) {
                        seasonStats.playerStats[playerName] = {
                            goals: 0,
                            penalties: 0,
                            cards: 0,
                            games: 0
                        };
                    }
                    
                    if (event.type === 'goal') seasonStats.playerStats[playerName].goals++;
                    if (event.type === 'penalty') seasonStats.playerStats[playerName].penalties++;
                    if (event.type.includes('card')) seasonStats.playerStats[playerName].cards++;
                }
            });
        });

        // Count games per player
        games.forEach(game => {
            const gamePlayers = new Set();
            game.events.forEach(event => {
                const playerName = event.meta?.player || event.label;
                if (playerName) gamePlayers.add(playerName);
            });
            gamePlayers.forEach(player => {
                if (seasonStats.playerStats[player]) {
                    seasonStats.playerStats[player].games++;
                }
            });
        });

        seasonStats.averageGoalsPerGame = (seasonStats.totalGoals / games.length).toFixed(2);
        seasonStats.winRate = ((seasonStats.wins / games.length) * 100).toFixed(1);

        return seasonStats;
    }

    calculateTrends(games) {
        if (games.length < 2) return null;

        const recentGames = games.slice(-5);
        const olderGames = games.slice(-10, -5);

        const recentStats = this.calculatePeriodStats(recentGames);
        const olderStats = this.calculatePeriodStats(olderGames);

        return {
            goalsTrend: recentStats.averageGoals - olderStats.averageGoals,
            winRateTrend: recentStats.winRate - olderStats.winRate,
            cleanSheetTrend: recentStats.cleanSheetRate - olderStats.cleanSheetRate
        };
    }

    calculatePeriodStats(games) {
        if (games.length === 0) return { averageGoals: 0, winRate: 0, cleanSheetRate: 0 };

        const totalGoals = games.reduce((sum, game) => sum + (game.myScore || 0), 0);
        const wins = games.filter(game => (game.myScore || 0) > (game.opponentScore || 0)).length;
        const cleanSheets = games.filter(game => (game.opponentScore || 0) === 0).length;

        return {
            averageGoals: totalGoals / games.length,
            winRate: (wins / games.length) * 100,
            cleanSheetRate: (cleanSheets / games.length) * 100
        };
    }

    // Generate insights and recommendations
    generateInsights(gameStats) {
        const insights = [];
        const { basic, momentum, efficiency, possession } = gameStats;

        // Score insights
        if (basic.score.my > basic.score.their) {
            insights.push({
                type: 'positive',
                title: 'Leading the Game',
                description: `You're up ${basic.score.my}-${basic.score.their}. Maintain this momentum!`
            });
        } else if (basic.score.my < basic.score.their) {
            insights.push({
                type: 'warning',
                title: 'Behind in Score',
                description: `Down ${basic.score.my}-${basic.score.their}. Time to increase pressure.`
            });
        }

        // Momentum insights
        if (momentum.differential > 2) {
            insights.push({
                type: 'positive',
                title: 'Strong Momentum',
                description: 'Your team has strong momentum. Keep pushing forward!'
            });
        } else if (momentum.differential < -2) {
            insights.push({
                type: 'warning',
                title: 'Losing Momentum',
                description: 'Opponent has momentum. Consider strategic changes.'
            });
        }

        // Efficiency insights
        if (efficiency.my.penaltyConversionRate < 50 && efficiency.my.penalties > 0) {
            insights.push({
                type: 'info',
                title: 'Penalty Efficiency',
                description: `Penalty conversion rate is ${efficiency.my.penaltyConversionRate}%. Consider practice.`
            });
        }

        // Possession insights
        if (possession.my > 60) {
            insights.push({
                type: 'positive',
                title: 'Dominating Possession',
                description: `${possession.my}% possession. Good control of the game.`
            });
        } else if (possession.my < 40) {
            insights.push({
                type: 'warning',
                title: 'Low Possession',
                description: `Only ${possession.my}% possession. Need to control the ball more.`
            });
        }

        return insights;
    }

    clearCache() {
        this.cache.clear();
    }
}

export const analyticsEngine = new AnalyticsEngine();
