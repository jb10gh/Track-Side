import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    TrendingDown, 
    Target, 
    Clock, 
    Users, 
    BarChart3, 
    PieChart,
    Activity,
    AlertTriangle,
    CheckCircle,
    Info
} from 'lucide-react';
import { analyticsEngine } from '../../utils/analyticsEngine';

export const AnalyticsDashboard = ({ game, games = [] }) => {
    const [activeTab, setActiveTab] = useState('live');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const gameStats = useMemo(() => {
        return game ? analyticsEngine.calculateGameStats(game) : null;
    }, [game]);

    const seasonStats = useMemo(() => {
        return games.length > 0 ? analyticsEngine.analyzeSeason(games) : null;
    }, [games]);

    const insights = useMemo(() => {
        return gameStats ? analyticsEngine.generateInsights(gameStats) : [];
    }, [gameStats]);

    const getInsightIcon = (type) => {
        switch (type) {
            case 'positive': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'info': return <Info className="w-4 h-4 text-blue-500" />;
            default: return <Info className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatPercentage = (value) => {
        return `${Math.round(value)}%`;
    };

    if (!gameStats && !seasonStats) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No data available for analytics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('live')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'live'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Live Game
                </button>
                <button
                    onClick={() => setActiveTab('season')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'season'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Season
                </button>
                <button
                    onClick={() => setActiveTab('players')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'players'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Players
                </button>
            </div>

            {/* Live Game Tab */}
            {activeTab === 'live' && gameStats && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Target className="w-5 h-5 text-blue-500" />
                                <span className="text-2xl font-bold">{gameStats.basic.score.my}</span>
                            </div>
                            <p className="text-sm text-gray-600">Our Goals</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Target className="w-5 h-5 text-red-500" />
                                <span className="text-2xl font-bold">{gameStats.basic.score.their}</span>
                            </div>
                            <p className="text-sm text-gray-600">Their Goals</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Activity className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold">{gameStats.momentum.differential > 0 ? '+' : ''}{gameStats.momentum.differential.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-gray-600">Momentum</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <PieChart className="w-5 h-5 text-purple-500" />
                                <span className="text-2xl font-bold">{formatPercentage(gameStats.possession.my)}</span>
                            </div>
                            <p className="text-sm text-gray-600">Possession</p>
                        </motion.div>
                    </div>

                    {/* Momentum Bar */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Momentum Balance</h3>
                        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="absolute left-0 top-0 h-full bg-blue-500"
                                initial={{ width: '50%' }}
                                animate={{ width: `${50 + (gameStats.momentum.differential * 10)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-medium text-white mix-blend-difference">
                                    {gameStats.momentum.leader === 'us' ? 'Us' : gameStats.momentum.leader === 'them' ? 'Them' : 'Balanced'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Game Timeline</h3>
                        <div className="space-y-2">
                            {gameStats.timeline.slice(-6).map((segment, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600 w-16">{segment.time}</span>
                                    <div className="flex-1 flex gap-2">
                                        <div 
                                            className={`h-6 rounded flex-1 flex items-center justify-center text-xs font-medium ${
                                                segment.myGoals > 0 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {segment.myGoals}
                                        </div>
                                        <div 
                                            className={`h-6 rounded flex-1 flex items-center justify-center text-xs font-medium ${
                                                segment.theirGoals > 0 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {segment.theirGoals}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Insights */}
                    {insights.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="font-medium text-gray-900 mb-3">Game Insights</h3>
                            <div className="space-y-3">
                                {insights.map((insight, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                        {getInsightIcon(insight.type)}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{insight.title}</h4>
                                            <p className="text-sm text-gray-600">{insight.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Season Tab */}
            {activeTab === 'season' && seasonStats && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <BarChart3 className="w-5 h-5 text-blue-500" />
                                <span className="text-2xl font-bold">{seasonStats.totalGames}</span>
                            </div>
                            <p className="text-sm text-gray-600">Total Games</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold">{seasonStats.wins}</span>
                            </div>
                            <p className="text-sm text-gray-600">Wins</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <Target className="w-5 h-5 text-purple-500" />
                                <span className="text-2xl font-bold">{seasonStats.averageGoalsPerGame}</span>
                            </div>
                            <p className="text-sm text-gray-600">Avg Goals/Game</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-5 h-5 text-orange-500" />
                                <span className="text-2xl font-bold">{Object.keys(seasonStats.playerStats).length}</span>
                            </div>
                            <p className="text-sm text-gray-600">Active Players</p>
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Top Performers</h3>
                        <div className="space-y-2">
                            {Object.entries(seasonStats.playerStats)
                                .sort(([,a], [,b]) => b.goals - a.goals)
                                .slice(0, 5)
                                .map(([name, stats]) => (
                                    <div key={name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                        <span className="font-medium">{name}</span>
                                        <div className="flex gap-4 text-sm text-gray-600">
                                            <span>{stats.goals} goals</span>
                                            <span>{stats.games} games</span>
                                            <span>{(stats.goals / stats.games).toFixed(2)} avg</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Players Tab */}
            {activeTab === 'players' && seasonStats && (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Player Statistics</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Player</th>
                                        <th className="text-center py-2 px-2 text-sm font-medium text-gray-700">Goals</th>
                                        <th className="text-center py-2 px-2 text-sm font-medium text-gray-700">Penalties</th>
                                        <th className="text-center py-2 px-2 text-sm font-medium text-gray-700">Cards</th>
                                        <th className="text-center py-2 px-2 text-sm font-medium text-gray-700">Games</th>
                                        <th className="text-center py-2 px-2 text-sm font-medium text-gray-700">Avg/Game</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(seasonStats.playerStats)
                                        .sort(([,a], [,b]) => b.goals - a.goals)
                                        .map(([name, stats]) => (
                                            <tr key={name} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-2 px-2 font-medium">{name}</td>
                                                <td className="text-center py-2 px-2">{stats.goals}</td>
                                                <td className="text-center py-2 px-2">{stats.penalties}</td>
                                                <td className="text-center py-2 px-2">{stats.cards}</td>
                                                <td className="text-center py-2 px-2">{stats.games}</td>
                                                <td className="text-center py-2 px-2">
                                                    {stats.games > 0 ? (stats.goals / stats.games).toFixed(2) : '0.00'}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
