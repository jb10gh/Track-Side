import React, { useState, useEffect, useRef } from 'react';
import { Target, AlertTriangle, Check, User, Hash } from 'lucide-react';
import { useGameStore, EVENT_TYPES, TEAMS } from '../../store/gameStore';
import '../../styles/design-tokens.css';

export const GameModal = ({ isOpen, type, team, initialLabel = '', initialIsPK = false, onConfirm, onCancel }) => {
    const { roster } = useGameStore();
    const [label, setLabel] = useState(initialLabel);
    const [isPK, setIsPK] = useState(initialIsPK);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setLabel(initialLabel);
            setIsPK(initialIsPK);
            // Autofocus with a slight delay to ensure modal is rendered
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, initialLabel, initialIsPK]);

    if (!isOpen) return null;

    const isGoal = type === EVENT_TYPES.GOAL;
    const teamLabel = team === TEAMS.US ? 'Our Team' : 'Opponent';
    const teamColor = team === TEAMS.US ? 'pink' : 'blue';

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(label, isGoal ? { isPK } : {});
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50" style={{ boxShadow: 'var(--glass-shadow)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {teamLabel} • {type}
                        </span>
                        <h2 className="text-2xl font-bold text-white">
                            {isGoal ? 'Who scored?' : 'Who committed the foul?'}
                        </h2>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isGoal 
                            ? 'bg-gradient-to-br from-pink-500 to-rose-600' 
                            : 'bg-gradient-to-br from-amber-500 to-orange-600'
                    }`}>
                        {isGoal ? <Target size={24} className="text-white" /> : <AlertTriangle size={24} className="text-white" />}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Player Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Player Name or Jersey Number
                            </label>
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="e.g., John Smith or #23"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-800/70 transition-all duration-200"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <User size={20} className="text-slate-500" />
                                </div>
                            </div>

                            {/* Roster Suggestions */}
                            {roster.length > 0 && !label && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-slate-400">Quick select from roster:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {roster.slice(0, 6).map((name, index) => (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => setLabel(name)}
                                                className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 hover:border-pink-500/50 hover:bg-slate-700/50 rounded-lg text-sm font-medium text-white transition-all duration-200"
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Matching Suggestions */}
                            {label && roster.filter(n => n.toLowerCase().includes(label.toLowerCase()) && n !== label).length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-slate-400">Matching players:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {roster
                                            .filter(n => n.toLowerCase().includes(label.toLowerCase()) && n !== label)
                                            .slice(0, 3)
                                            .map((name, index) => (
                                                <button
                                                    key={name}
                                                    type="button"
                                                    onClick={() => setLabel(name)}
                                                    className="px-3 py-2 bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-pink-500/30 hover:border-pink-500/50 hover:from-pink-500/30 hover:to-rose-600/30 rounded-lg text-sm font-medium text-white transition-all duration-200"
                                                >
                                                    {name}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Penalty Kick Option */}
                        {isGoal && (
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-600/50">
                                <span className="font-semibold text-white">Penalty Kick?</span>
                                <button
                                    type="button"
                                    onClick={() => setIsPK(!isPK)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                        isPK 
                                            ? 'bg-gradient-to-br from-pink-500 to-rose-600' 
                                            : 'bg-slate-700/50 hover:bg-slate-600/50'
                                    }`}
                                >
                                    {isPK && <Check size={20} className="text-white" />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-[1.02] shadow-lg ${
                                isGoal 
                                    ? 'bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700' 
                                    : 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                            }`}
                        >
                            <span className="text-lg">
                                {isGoal ? (isPK ? 'PK Goal' : 'Goal') : 'Penalty'}
                            </span>
                            <span className="text-xs opacity-75 block">
                                {teamLabel}
                            </span>
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => onConfirm('', isGoal ? { isPK } : {})}
                            className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-all duration-200"
                        >
                            Skip Name
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
