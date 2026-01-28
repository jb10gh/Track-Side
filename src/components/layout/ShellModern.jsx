import React from 'react';
import '../../styles/design-tokens.css';

export const Shell = ({ children, title, headerAction }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header - Glassmorphism */}
            <header className="fixed top-0 left-0 right-0 z-50 border border-slate-700/50 backdrop-blur-xl bg-slate-900/80" style={{ boxShadow: 'var(--glass-shadow)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-black to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/25" style={{ backgroundImage: 'var(--team-our-gradient)' }}>
                                    <span className="text-white font-bold text-sm">TS</span>
                                </div>
                                <h1 className="text-xl font-bold text-white tracking-tight">
                                    {title}
                                </h1>
                            </div>
                        </div>
                        {headerAction}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
};
