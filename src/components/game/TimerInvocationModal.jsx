import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, X, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useTheme, useThemeLayout, useThemeComponents } from '../../theme/useTheme';

/**
 * Timer Invocation Modal - Unified Theme System
 * 
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Smooth animations and micro-interactions
 * - Clear visual hierarchy with proper spacing
 * - Mobile-optimized touch targets (44px minimum)
 * - Accessibility with proper ARIA labels
 * - Contextual messaging based on trigger
 * - Unified Track Side theme integration
 */
export const TimerInvocationModal = ({ 
    isOpen, 
    trigger = 'manual', 
    onStart, 
    onSkip,
    onDismiss 
}) => {
    const { timerInvocation } = useGameStore();
    const { createModalStyles } = useTheme();
    const { getSpacingValue } = useThemeLayout();
    const { createButtonStyles } = useThemeComponents();

    // Enhanced contextual messaging with Track Side branding
    const getTriggerMessage = () => {
        switch (trigger) {
            case 'match_start':
                return {
                    title: '⏰ Don\'t Forget to Start the Timer!',
                    message: 'Track Side needs accurate game time for better statistics and analysis',
                    urgency: 'high',
                    icon: '⏰'
                };
            case 'first_event':
                return {
                    title: '⚠️ Timer Not Started!',
                    message: 'You recorded an event but the timer isn\'t running. Start it now for accurate match data?',
                    urgency: 'critical',
                    icon: '⚠️'
                };
            case 'period_change':
                return {
                    title: '⏱️ Continue Timer?',
                    message: 'Keep tracking time for the next period of the game',
                    urgency: 'normal',
                    icon: '⏱️'
                };
            default:
                return {
                    title: '⏰ Start Game Timer?',
                    message: 'Track Side needs accurate game time for better statistics',
                    urgency: 'normal',
                    icon: '⏰'
                };
        }
    };

    const message = getTriggerMessage();

    if (!isOpen) return null;

    const modalStyles = createModalStyles();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 modal-overlay"
                    onClick={onDismiss}
                    style={{ background: 'var(--modal-overlay)' }}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative rounded-2xl p-6 max-w-md w-full"
                    style={{
                        ...modalStyles,
                        padding: getSpacingValue('lg'),
                        maxWidth: '28rem',
                    }}
                >
                    {/* Icon and Header */}
                    <div 
                        className="text-center mb-6"
                        style={{ marginBottom: getSpacingValue('xl') }}
                    >
                        <motion.div
                            animate={{
                                scale: message.urgency === 'high' ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                                duration: message.urgency === 'high' ? 1 : 0,
                                repeat: message.urgency === 'high' ? Infinity : 0,
                                repeatType: 'reverse'
                            }}
                            className="mx-auto mb-4"
                            style={{ marginBottom: getSpacingValue('md') }}
                        >
                            {message.urgency === 'high' ? (
                                <AlertTriangle 
                                    size={48} 
                                    style={{ color: 'var(--status-error)' }}
                                />
                            ) : (
                                <Clock 
                                    size={48} 
                                    style={{ color: 'var(--status-info)' }}
                                />
                            )}
                        </motion.div>
                        
                        <h3 
                            className="text-2xl font-bold mb-2"
                            style={{
                                color: 'var(--text-primary)',
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 'var(--font-bold)',
                                marginBottom: getSpacingValue('sm'),
                            }}
                        >
                            {message.icon} {message.title}
                        </h3>
                        
                        <p 
                            className="text-base"
                            style={{
                                color: 'var(--text-secondary)',
                                fontSize: 'var(--text-base)',
                            }}
                        >
                            {message.message}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3" style={{ gap: getSpacingValue('md') }}>
                        <button
                            onClick={onStart}
                            className="w-full flex items-center justify-center gap-3 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95"
                            style={{
                                ...createButtonStyles('primary'),
                                padding: `${getSpacingValue('md')} ${getSpacingValue('lg')}`,
                                gap: getSpacingValue('md'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                            aria-label="Start timer now"
                        >
                            <Play size={20} />
                            ⏰ Start Timer Now
                        </button>

                        <div className="flex gap-3" style={{ gap: getSpacingValue('md') }}>
                            <button
                                onClick={onSkip}
                                className="flex-1 rounded-lg font-medium transition-all"
                                style={{
                                    ...createButtonStyles('secondary'),
                                    padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`,
                                    flex: 1,
                                }}
                                aria-label="Skip timer start"
                            >
                                Skip
                            </button>

                            <button
                                onClick={onDismiss}
                                className="p-2 rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'transparent',
                                    borderRadius: 'var(--radius-lg)',
                                    transition: 'var(--transition-normal)',
                                    padding: getSpacingValue('sm'),
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--bg-secondary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                }}
                                aria-label="Close modal"
                            >
                                <X 
                                    size={20} 
                                    style={{ color: 'var(--text-secondary)' }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {timerInvocation.invocationCount > 2 && (
                        <div 
                            className="mt-4 p-3 rounded-lg"
                            style={{
                                marginTop: getSpacingValue('md'),
                                padding: getSpacingValue('sm'),
                                backgroundColor: 'var(--bg-warning)',
                                border: 'var(--border-warning)',
                                borderRadius: 'var(--radius-lg)',
                            }}
                        >
                            <p 
                                className="text-sm"
                                style={{
                                    color: 'var(--text-warning)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                💡 Pro tip: Starting the timer at the beginning ensures accurate game statistics
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
