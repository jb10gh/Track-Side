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
import '../../styles/design-tokens.css';

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
            {/* Tabs - Glassmorphism */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-2" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`px-4 py-2 font-bold transition-all duration-200 rounded-lg ${
                            activeTab === 'live'
                                ? 'bg-pink-500 text-white border border-pink-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        Live Game
                    </button>
                    <button
                        onClick={() => setActiveTab('season')}
                        className={`px-4 py-2 font-bold transition-all duration-200 rounded-lg ${
                            activeTab === 'season'
                                ? 'bg-pink-500 text-white border border-pink-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        Season
                    </button>
                    <button
                        onClick={() => setActiveTab('players')}
                        className={`px-4 py-2 font-bold transition-all duration-200 rounded-lg ${
                            activeTab === 'players'
                                ? 'bg-pink-500 text-white border border-pink-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        Players
                    </button>
                </div>
            </div>

            {/* Live Game Tab */}
            {activeTab === 'live' && gameStats && (
                <div className="space-y-6">
                    {/* Key Metrics - Glassmorphism */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Target className="w-5 h-5 text-pink-500" />
                                <span className="text-2xl font-bold text-white">{gameStats.basic.score.my}</span>
                            </div>
                            <p className="text-sm text-slate-400">Our Goals</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Target className="w-5 h-5 text-blue-400" />
                                <span className="text-2xl font-bold text-white">{gameStats.basic.score.their}</span>
                            </div>
                            <p className="text-sm text-slate-400">Their Goals</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Activity className="w-5 h-5 text-emerald-400" />
                                <span className="text-2xl font-bold text-white">{gameStats.momentum.differential > 0 ? '+' : ''}{gameStats.momentum.differential.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-slate-400">Momentum</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <PieChart className="w-5 h-5 text-purple-400" />
                                <span className="text-2xl font-bold text-white">{formatPercentage(gameStats.possession.my)}</span>
                            </div>
                            <p className="text-sm text-slate-400">Possession</p>
                        </motion.div>
                    </div>

                    {/* Momentum Bar - Glassmorphism */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                        <h3 className="font-bold text-white mb-3">Momentum Balance</h3>
                        <div className="relative h-8 bg-slate-700/50 rounded-full overflow-hidden">
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
                                        className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
                                    >
                                        {getInsightIcon(insight.type)}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white">{insight.title}</h4>
                                            <p className="text-sm text-slate-400">{insight.description}</p>
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
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <BarChart3 className="w-5 h-5 text-blue-400" />
                                    <span className="text-2xl font-bold text-white">{seasonStats.totalGames}</span>
                                </div>
                                <p className="text-sm text-slate-400">Total Games</p>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    <span className="text-2xl font-bold text-white">{seasonStats.wins}</span>
                                </div>
                                <p className="text-sm text-slate-400">Wins</p>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <Target className="w-5 h-5 text-purple-400" />
                                    <span className="text-2xl font-bold text-white">{seasonStats.averageGoalsPerGame}</span>
                                </div>
                                <p className="text-sm text-slate-400">Avg Goals/Game</p>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <Users className="w-5 h-5 text-orange-400" />
                                    <span className="text-2xl font-bold text-white">{Object.keys(seasonStats.playerStats).length}</span>
                                </div>
                                <p className="text-sm text-slate-400">Active Players</p>
                            </div>
                        </div>

                        {/* Top Performers - Glassmorphism */}
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                            <h3 className="font-bold text-white mb-3">Top Performers</h3>
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
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <BarChart3 className="w-5 h-5 text-blue-400" />
                                        <span className="text-2xl font-bold text-white">{seasonStats.totalGames}</span>
                                    </div>
                                    <p className="text-sm text-slate-400">Total Games</p>
                                </div>

                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        <span className="text-2xl font-bold text-white">{seasonStats.wins}</span>
                                    </div>
                                    <p className="text-sm text-slate-400">Wins</p>
                                </div>

                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <Target className="w-5 h-5 text-purple-400" />
                                        <span className="text-2xl font-bold text-white">{seasonStats.averageGoalsPerGame}</span>
                                    </div>
                                    <p className="text-sm text-slate-400">Avg Goals/Game</p>
                                </div>

                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <Users className="w-5 h-5 text-orange-400" />
                                        <span className="text-2xl font-bold text-white">{Object.keys(seasonStats.playerStats).length}</span>
                                    </div>
                                    <p className="text-sm text-slate-400">Active Players</p>
                                </div>
                            </div>

                            {/* Top Performers - Glassmorphism */}
                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                                <h3 className="font-bold text-white mb-3">Top Performers</h3>
                                <div className="space-y-2">
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
                                            <tr key={name} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                                                <td className="py-2 px-2 font-medium text-white">{name}</td>
                                                <td className="text-center py-2 px-2 text-white">{stats.goals}</td>
                                                <td className="text-center py-2 px-2 text-white">{stats.penalties}</td>
                                                <td className="text-center py-2 px-2 text-white">{stats.cards}</td>
                                                <td className="text-center py-2 px-2 text-white">{stats.games}</td>
                                                <td className="text-center py-2 px-2 text-white">{(stats.goals / stats.games).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                    </div>
                </div>
            )}
    );
};
