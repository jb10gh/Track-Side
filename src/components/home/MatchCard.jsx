import React, { useState } from 'react';
import { Trash2, X, Eye, ArrowRight } from 'lucide-react';
import { MatchDetailView } from '../match/MatchDetailView';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

/**
 * Clean Code: MatchCard component.
 * Represents a single match entry in the archive with unified theme system.
 */
export const MatchCard = ({ game, isConfirmingDelete, onConfirmDelete, onCancelDelete, onDelete }) => {
    const [showDetailView, setShowDetailView] = useState(false);
    const { createCardStyles, createButtonStyles, getSpacingValue } = useTheme();
    const ourTeam = useTeamTheme('our');
    const theirTeam = useTeamTheme('their');

    const cardStyles = createCardStyles();

    const handleViewDetails = () => {
        setShowDetailView(true);
    };

    const handleCloseDetails = () => {
        setShowDetailView(false);
    };

    if (showDetailView) {
        return <MatchDetailView matchId={game.id} onClose={handleCloseDetails} />;
    }

    return (
        <div 
            className="flex items-center justify-between group transition-all duration-300"
            style={{
                ...cardStyles,
                padding: getSpacingValue('md'),
                marginBottom: getSpacingValue('md'),
                transition: 'var(--transition-normal)',
            }}
            onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--text-secondary)';
                e.target.style.boxShadow = 'var(--shadow-card)';
            }}
            onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.boxShadow = 'var(--shadow-card)';
            }}
        >
            <div className="space-y-1" style={{ gap: getSpacingValue('xs') }}>
                <p 
                    className="font-bold uppercase tracking-widest font-mono"
                    style={{
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-bold)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.2em',
                    }}
                >
                    {new Date(game.timestamp).toLocaleDateString()}
                </p>
                <h3 
                    className="font-black uppercase italic tracking-tighter flex items-center gap-2"
                    style={{
                        color: 'var(--text-primary)',
                        fontWeight: 'var(--font-black)',
                        fontSize: 'var(--text-xl)',
                        fontStyle: 'italic',
                        letterSpacing: '-0.05em',
                        gap: getSpacingValue('sm'),
                    }}
                >
                    vs {game.opponentName}
                </h3>
            </div>
            
            <div className="flex items-center gap-6" style={{ gap: getSpacingValue('lg') }}>
                <div className="text-right">
                    <div 
                        className="font-mono tracking-tighter"
                        style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 'var(--font-black)',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '-0.05em',
                        }}
                    >
                        <span 
                            style={{ 
                                color: ourTeam.colors.primary, 
                                textShadow: ourTeam.colors.shadow 
                            }}
                        >
                            {game.myScore}
                        </span>
                        <span 
                            className="mx-1"
                            style={{ 
                                color: 'var(--text-secondary)', 
                                opacity: 0.2 
                            }}
                        >
                            -
                        </span>
                        <span 
                            style={{ 
                                color: theirTeam.colors.primary, 
                                textShadow: theirTeam.colors.shadow 
                            }}
                        >
                            {game.opponentScore}
                        </span>
                    </div>
                    <div 
                        className="text-xs mt-1"
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--text-xs)',
                            marginTop: getSpacingValue('xs'),
                        }}
                    >
                        {game.events.length} events
                    </div>
                </div>

                <div className="flex items-center gap-1" style={{ gap: getSpacingValue('xs') }}>
                    <button
                        onClick={handleViewDetails}
                        className="p-2 rounded-lg transition-all"
                        style={{
                            color: 'var(--text-secondary)',
                            backgroundColor: 'transparent',
                            borderRadius: 'var(--radius-md)',
                            transition: 'var(--transition-normal)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = 'var(--brand-primary)';
                            e.target.style.backgroundColor = 'var(--bg-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = 'var(--text-secondary)';
                            e.target.style.backgroundColor = 'transparent';
                        }}
                        title="View match details"
                    >
                        <Eye size={18} />
                    </button>
                    
                    {isConfirmingDelete ? (
                        <>
                            <button
                                onClick={onCancelDelete}
                                className="p-2 rounded-lg transition-colors"
                                style={{
                                    color: 'var(--text-secondary)',
                                    backgroundColor: 'transparent',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'var(--transition-normal)',
                                }}
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-2 rounded-xl transition-all"
                                style={{
                                    backgroundColor: 'var(--status-error)',
                                    color: 'var(--text-primary)',
                                    borderRadius: 'var(--radius-xl)',
                                    transition: 'var(--transition-normal)',
                                }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onConfirmDelete}
                            className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            style={{
                                color: 'var(--text-secondary)',
                                backgroundColor: 'transparent',
                                borderRadius: 'var(--radius-md)',
                                transition: 'var(--transition-normal)',
                                opacity: 0,
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = '1';
                                e.target.style.color = 'var(--status-error)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = '0';
                                e.target.style.color = 'var(--text-secondary)';
                            }}
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
