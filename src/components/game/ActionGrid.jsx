import React from 'react';
import { Target, Shield, AlertTriangle } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';

export const ActionGrid = ({ onAction }) => {
    return (
        <div className="action-grid">
            <button 
                onClick={() => onAction(EVENT_TYPES.GOAL, TEAMS.US)} 
                className="thumb-btn primary"
            >
                <Target size={32} strokeWidth={2.5} />
                <span className="text-sm font-bold">Goal Us</span>
            </button>

            <button 
                onClick={() => onAction(EVENT_TYPES.GOAL, TEAMS.THEM)} 
                className="thumb-btn danger"
            >
                <Shield size={32} strokeWidth={2.5} />
                <span className="text-sm font-bold">Goal Them</span>
            </button>

            <button 
                onClick={() => onAction(EVENT_TYPES.PENALTY, TEAMS.US)} 
                className="thumb-btn"
            >
                <AlertTriangle size={24} strokeWidth={2.5} className="text-[var(--color-warning)]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Penalty Us</span>
            </button>

            <button 
                onClick={() => onAction(EVENT_TYPES.PENALTY, TEAMS.THEM)} 
                className="thumb-btn"
            >
                <AlertTriangle size={24} strokeWidth={2.5} className="text-[var(--color-warning)]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Penalty Them</span>
            </button>
        </div>
    );
};
