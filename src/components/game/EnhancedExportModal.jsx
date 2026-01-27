import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, FileDown, Copy, Check, AlertCircle, Users, Settings, Share2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useCoachStore } from '../../store/coachStore';
import { EmailService } from '../../services/emailService';
import { autoEmailExportService } from '../../services/autoEmailExportService';
import { copyEnhancedSummary, downloadEnhancedCSV } from '../../utils/export';
import { SharePanel } from './SharePanel';

/**
 * Enhanced Export Modal - UI/UX Pro Max Design
 * 
 * Features:
 * - Primary email submission action
 * - Coach selection and management
 * - Attachment instructions
 * - Professional email composition
 * - Mobile-optimized interface
 */
export const EnhancedExportModal = ({ matchData, onClose }) => {
    const [emailMode, setEmailMode] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [showSharePanel, setShowSharePanel] = useState(false);
    
    const { formatTime, formatTimeForExport } = useGameStore();
    const { coaches, getDefaultCoach, addCoach } = useCoachStore();

    // Get default coach
    const defaultCoach = getDefaultCoach();

    // Initialize selected coach
    React.useEffect(() => {
        if (defaultCoach && !selectedCoach) {
            setSelectedCoach(defaultCoach);
        }
    }, [defaultCoach, selectedCoach]);

    // Handle email submission with auto export
    const handleEmailSubmission = async () => {
        setIsProcessing(true);
        
        try {
            // Use auto email export service
            const emailConfig = await autoEmailExportService.createAutoEmail(matchData);
            
            // Override recipient if coach is selected
            if (selectedCoach && selectedCoach.email) {
                emailConfig.recipient = selectedCoach.email;
            }
            
            const result = await autoEmailExportService.triggerEmailClient(emailConfig);
            
            if (result) {
                setSubmissionResult({
                    success: true,
                    message: 'Email client opened successfully!',
                    details: 'Check your email client to send the message'
                });
                
                // Save to history
                autoEmailExportService.saveToHistory(emailConfig);
                
                // Auto close after delay
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            setSubmissionResult({
                success: false,
                message: 'Failed to open email client',
                details: error.message
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle CSV download
    const handleDownloadCSV = async () => {
        try {
            await downloadEnhancedCSV(matchData);
            setSubmissionResult({
                success: true,
                message: 'CSV downloaded successfully!'
            });
        } catch (error) {
            setSubmissionResult({
                success: false,
                message: `Download failed: ${error.message}`
            });
        }
    };

    // Handle copy summary
    const handleCopySummary = async () => {
        try {
            await copyEnhancedSummary(matchData, formatTime, formatTimeForExport);
            setSubmissionResult({
                success: true,
                message: 'Summary copied to clipboard!'
            });
        } catch (error) {
            setSubmissionResult({
                success: false,
                message: `Copy failed: ${error.message}`
            });
        }
    };

    // Reset submission result
    const resetResult = () => {
        setSubmissionResult(null);
    };

    if (emailMode && submissionResult?.success) {
        return <AttachmentInstructions onClose={onClose} attachment={submissionResult.attachment} />;
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Submit Match Report
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Send complete match statistics to your coach
                        </p>
                    </div>

                    {/* Match Preview */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                        <div className="text-center">
                            <div className="text-3xl font-black mb-2">
                                <span style={{ color: 'var(--score-our-color)' }}>{matchData.myScore}</span>
                                <span className="mx-2 text-gray-400">-</span>
                                <span style={{ color: 'var(--score-their-color)' }}>{matchData.opponentScore}</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">vs {matchData.opponentName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {matchData.events.length} events • {formatTime(matchData.finalTime)}
                            </p>
                        </div>
                    </div>

                    {/* Coach Selection */}
                    {coaches.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Send to Coach:
                            </label>
                            <select
                                value={selectedCoach?.id || ''}
                                onChange={(e) => {
                                    const coach = coaches.find(c => c.id === e.target.value);
                                    setSelectedCoach(coach);
                                }}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {coaches.map(coach => (
                                    <option key={coach.id} value={coach.id}>
                                        {coach.name} ({coach.role}) - {coach.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Primary Email Action */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Email to Coach</h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Send complete match report directly
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleEmailSubmission}
                            disabled={isProcessing || !selectedCoach}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-colors transform active:scale-95 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Opening Email...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Mail size={20} />
                                    Email Coach (Recommended)
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Alternative Options */}
                    <div className="space-y-3">
                        <button
                            onClick={handleDownloadCSV}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                        >
                            <FileDown size={20} />
                            Download CSV Only
                        </button>

                        <button
                            onClick={handleCopySummary}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                        >
                            <Copy size={20} />
                            Copy Summary
                        </button>

                        <button
                            onClick={() => setShowSharePanel(true)}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-700 dark:hover:bg-purple-600 text-purple-700 dark:text-purple-300 rounded-xl font-medium transition-colors"
                        >
                            <Share2 size={20} />
                            Share Options
                        </button>
                    </div>

                    {/* Result Message */}
                    {submissionResult && (
                        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                            submissionResult.success 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                        }`}>
                            {submissionResult.success ? (
                                <Check size={20} />
                            ) : (
                                <AlertCircle size={20} />
                            )}
                            <span className="text-sm">{submissionResult.message}</span>
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="mt-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
                
                {/* Share Panel */}
                {showSharePanel && (
                    <SharePanel
                        matchData={matchData}
                        onClose={() => setShowSharePanel(false)}
                    />
                )}
            </div>
        </AnimatePresence>
    );
};

/**
 * Attachment Instructions Component
 */
const AttachmentInstructions = ({ onClose, attachment }) => {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                >
                    {/* Success Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-green-600 dark:text-green-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            📧 Email Opened!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your email client has opened with the match report
                        </p>
                    </div>

                    {/* Attachment Instructions */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                            📎 Attach CSV File:
                        </h4>
                        <ol className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                            <li>1. Click "Attach File" in your email client</li>
                            <li>2. Select the downloaded file: <strong>{attachment?.filename}</strong></li>
                            <li>3. The file is in your Downloads folder</li>
                            <li>4. Send the email to your coach</li>
                        </ol>
                    </div>

                    {/* File Info */}
                    {attachment && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">File:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{attachment.filename}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                                <span className="text-gray-600 dark:text-gray-400">Size:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {(attachment.size / 1024).toFixed(1)} KB
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
                    >
                        Done
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
