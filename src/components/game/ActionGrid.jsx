import React from 'react';
import { Target, Shield, AlertTriangle } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

export const ActionGrid = ({ onAction }) => {
    const { getSpacingValue } = useTheme();
    const ourTeam = useTeamTheme('our');
    const theirTeam = useTeamTheme('their');

    return (
        <div 
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: getSpacingValue('md'),
                padding: getSpacingValue('md'),
            }}
        >
            <button 
                onClick={() => onAction(EVENT_TYPES.GOAL, TEAMS.US)} 
                className="rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
                style={{
                    backgroundColor: ourTeam.colors.background,
                    border: `2px solid ${ourTeam.colors.border}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: getSpacingValue('md'),
                    transition: 'var(--transition-normal)',
                    boxShadow: ourTeam.colors.shadow,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = ourTeam.colors.shadow;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = ourTeam.colors.shadow;
                }}
            >
                <Target 
                    size={32} 
                    strokeWidth={2.5} 
                    style={{ color: ourTeam.colors.primary }} 
                />
                <span 
                    className="text-sm font-bold"
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-bold)',
                    }}
                >
                    Goal Us
                </span>
            </button>

            <button 
                onClick={() => onAction(EVENT_TYPES.GOAL, TEAMS.THEM)} 
                className="rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
                style={{
                    backgroundColor: theirTeam.colors.background,
                    border: `2px solid ${theirTeam.colors.border}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: getSpacingValue('md'),
                    transition: 'var(--transition-normal)',
                    boxShadow: theirTeam.colors.shadow,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = theirTeam.colors.shadow;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = theirTeam.colors.shadow;
                }}
            >
                <Shield 
                    size={32} 
                    strokeWidth={2.5} 
                    style={{ color: theirTeam.colors.primary }} 
                />
                <span 
                    className="text-sm font-bold"
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-bold)',
                    }}
                >
                    Goal Them
                </span>
            </button>

            <button 
                onClick={() => onAction(EVENT_TYPES.PENALTY, TEAMS.US)} 
                className="rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
                style={{
                    backgroundColor: ourTeam.colors.background,
                    border: `2px solid ${ourTeam.colors.border}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: getSpacingValue('md'),
                    transition: 'var(--transition-normal)',
                    boxShadow: ourTeam.colors.shadow,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = ourTeam.colors.shadow;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = ourTeam.colors.shadow;
                }}
            >
                <AlertTriangle 
                    size={24} 
                    strokeWidth={2.5} 
                    style={{ color: 'var(--status-warning)' }} 
                />
                <span 
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-semibold)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}
                >
                    Penalty Us
                </span>
            </button>

            <button 
                onClick={() => onAction(EVENT_TYPES.PENALTY, TEAMS.THEM)} 
                className="rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
                style={{
                    backgroundColor: theirTeam.colors.background,
                    border: `2px solid ${theirTeam.colors.border}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: getSpacingValue('md'),
                    transition: 'var(--transition-normal)',
                    boxShadow: theirTeam.colors.shadow,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = theirTeam.colors.shadow;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = theirTeam.colors.shadow;
                }}
            >
                <AlertTriangle 
                    size={24} 
                    strokeWidth={2.5} 
                    style={{ color: 'var(--status-warning)' }} 
                />
                <span 
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-semibold)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}
                >
                    Penalty Them
                </span>
            </button>
        </div>
    );
};
