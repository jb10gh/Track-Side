import React from 'react';
import { useTheme, useThemeLayout } from '../../theme/useTheme';

export const Shell = ({ children, title, headerAction }) => {
    const { createCardStyles } = useTheme();
    const { getSpacingValue } = useThemeLayout();

    return (
        <div 
            className="min-h-screen transition-colors duration-300"
            style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)',
            }}
        >
            {/* Header */}
            <header 
                className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: 'var(--border-primary)',
                    padding: `${getSpacingValue('md')} ${getSpacingValue('lg')}`,
                    height: 'auto',
                }}
            >
                <h1 
                    className="text-2xl font-bold tracking-tight"
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 'var(--font-bold)',
                        letterSpacing: '-0.025em',
                        textShadow: 'var(--glow-brand)',
                    }}
                >
                    {title || 'TrackSide'}
                </h1>
                {headerAction && (
                    <div 
                        className="flex items-center gap-3"
                        style={{ gap: getSpacingValue('md') }}
                    >
                        {headerAction}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main 
                className="max-w-4xl mx-auto"
                style={{
                    paddingTop: `calc(5rem + ${getSpacingValue('md')})`,
                    paddingBottom: `calc(2rem + var(--safe-area-bottom, 0px))`,
                    paddingLeft: getSpacingValue('md'),
                    paddingRight: getSpacingValue('md'),
                    maxWidth: '56rem',
                    margin: '0 auto',
                }}
            >
                {children}
            </main>
        </div>
    );
};
