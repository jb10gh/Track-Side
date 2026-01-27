import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, X, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

/**
 * Timer Invocation Modal - UI/UX Pro Max Design
 * 
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Smooth animations and micro-interactions
 * - Clear visual hierarchy with proper spacing
 * - Mobile-optimized touch targets (44px minimum)
 * - Accessibility with proper ARIA labels
 * - Contextual messaging based on trigger
 */
export const TimerInvocationModal = ({ 
    isOpen, 
    trigger = 'manual', 
    onStart, 
    onSkip,
    onDismiss 
}) => {
    const { timerInvocation } = useGameStore();

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

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onDismiss}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20"
                >
                    {/* Icon and Header */}
                    <div className="text-center mb-6">
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
                        >
                            {message.urgency === 'high' ? (
                                <AlertTriangle size={48} className="text-red-600" />
                            ) : (
                                <Clock size={48} className="text-blue-600" />
                            )}
                        </motion.div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {message.icon} {message.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400">
                            {message.message}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={onStart}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#FF1493] to-[#FF007F] hover:from-[#FF69B4] hover:to-[#FF1493] text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                            style={{ boxShadow: '0 4px 20px rgba(255, 20, 147, 0.4)' }}
                            aria-label="Start timer now"
                        >
                            <Play size={20} />
                            ⏰ Start Timer Now
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={onSkip}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                                aria-label="Skip timer start"
                            >
                                Skip
                            </button>

                            <button
                                onClick={onDismiss}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {timerInvocation.invocationCount > 2 && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                💡 Pro tip: Starting the timer at the beginning ensures accurate game statistics
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
