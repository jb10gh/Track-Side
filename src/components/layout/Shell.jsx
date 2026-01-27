import React from 'react';

export const Shell = ({ children, title, headerAction }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/90 backdrop-blur-lg border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    {title || 'Sideline Stats'}
                </h1>
                {headerAction && (
                    <div className="flex items-center gap-3">
                        {headerAction}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-[calc(2rem+var(--safe-area-bottom))] px-4 max-w-4xl mx-auto">
                {children}
            </main>
        </div>
    );
};
