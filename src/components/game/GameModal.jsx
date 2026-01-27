import React, { useState, useEffect, useRef } from 'react';
import { Target, AlertTriangle, Check } from 'lucide-react';
import { useGameStore, EVENT_TYPES, TEAMS } from '../../store/gameStore';

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
    const teamLabel = team === TEAMS.US ? 'Us' : 'Them';

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(label, isGoal ? { isPK } : {});
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                                {teamLabel} • {type}
                            </span>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Who?</h2>
                        </div>
                        <div className={`p-3 rounded-2xl ${isGoal ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)]' : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'}`}>
                            {isGoal ? <Target size={32} strokeWidth={3} /> : <AlertTriangle size={32} strokeWidth={3} />}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="Name or Jersey #"
                                    className="input-field font-mono"
                                />

                                {/* Roster Suggestions */}
                                {roster.length > 0 && !label && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {roster.slice(0, 6).map(name => (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => setLabel(name)}
                                                className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[10px] font-bold uppercase tracking-tight font-mono hover:border-[var(--color-brand)] transition-colors"
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {label && roster.filter(n => n.toLowerCase().includes(label.toLowerCase()) && n !== label).length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {roster
                                            .filter(n => n.toLowerCase().includes(label.toLowerCase()) && n !== label)
                                            .slice(0, 3)
                                            .map(name => (
                                                <button
                                                    key={name}
                                                    type="button"
                                                    onClick={() => setLabel(name)}
                                                    className="px-3 py-1.5 rounded-xl bg-[var(--color-brand-soft)] border border-[var(--color-brand)] text-[10px] font-bold uppercase tracking-tight font-mono text-[var(--color-brand)]"
                                                >
                                                    {name}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {isGoal && (
                                <div
                                    onClick={() => setIsPK(!isPK)}
                                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${isPK ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)]' : 'border-[var(--color-border)] opacity-60'}`}
                                >
                                    <span className="font-bold text-sm uppercase tracking-widest">Penalty Kick?</span>
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isPK ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--bg-secondary)]'}`}>
                                        {isPK && <Check size={16} strokeWidth={4} />}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                className="btn-primary w-full shadow-lg font-black uppercase tracking-tighter italic"
                                style={{ backgroundColor: isGoal ? 'var(--color-brand)' : 'var(--text-primary)' }}
                            >
                                Record {isGoal ? (isPK ? 'PK Goal' : 'Goal') : 'Penalty'}
                            </button>
                            <button
                                type="button"
                                onClick={() => onConfirm('', isGoal ? { isPK } : {})}
                                className="btn-ghost w-full font-bold uppercase text-[10px] tracking-widest"
                            >
                                Skip Name
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
