import React from 'react';

export const Shell = ({ children, title, headerAction }) => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-black/90 backdrop-blur-md border-b border-gray-800 p-4">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    {title}
                </h1>
                {headerAction}
            </header>

            {/* Main Content */}
            <main className="pt-20">
                {children}
            </main>
        </div>
    );
};
