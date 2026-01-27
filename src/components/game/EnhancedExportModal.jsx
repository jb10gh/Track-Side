import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, FileDown, Copy, Check, AlertCircle, Users, Settings, Share2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useCoachStore } from '../../store/coachStore';
import { EmailService } from '../../services/emailService';
import { autoEmailExportService } from '../../services/autoEmailExportService';
import { copyEnhancedSummary, downloadEnhancedCSV } from '../../utils/export';
import { SharePanel } from './SharePanel';
import { useTheme, createButtonStyles, getSpacingValue } from '../../theme/useTheme';

/**
 * Enhanced Export Modal - Unified Theme System
 * 
 * Features:
 * - Primary email submission action
 * - Coach selection and management
 * - Attachment instructions
 * - Professional email composition
 * - Mobile-optimized interface
 * - Unified Track Side theme integration
 */
export const EnhancedExportModal = ({ matchData, onClose }) => {
    const [emailMode, setEmailMode] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [showSharePanel, setShowSharePanel] = useState(false);
    
    const { formatTime, formatTimeForExport } = useGameStore();
    const { coaches, getDefaultCoach, addCoach } = useCoachStore();
    const { createModalStyles } = useTheme();

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
                    onClick={onClose}
                    style={{ background: 'var(--modal-overlay)' }}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                    style={{
                        ...modalStyles,
                        padding: getSpacingValue('lg'),
                        maxWidth: '28rem',
                        maxHeight: '90vh',
                    }}
                >
                    {/* Header */}
                    <div 
                        className="text-center mb-6"
                        style={{ marginBottom: getSpacingValue('xl') }}
                    >
                        <h2 
                            className="text-2xl font-bold mb-2"
                            style={{
                                color: 'var(--text-primary)',
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 'var(--font-bold)',
                                marginBottom: getSpacingValue('sm'),
                            }}
                        >
                            Submit Match Report
                        </h2>
                        <p 
                            className="text-base"
                            style={{
                                color: 'var(--text-secondary)',
                                fontSize: 'var(--text-base)',
                            }}
                        >
                            Send complete match statistics to your coach
                        </p>
                    </div>

                    {/* Match Preview */}
                    <div 
                        className="rounded-xl p-4 mb-6"
                        style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-xl)',
                            padding: getSpacingValue('md'),
                            marginBottom: getSpacingValue('xl'),
                        }}
                    >
                        <div className="text-center">
                            <div 
                                className="text-3xl font-black mb-2"
                                style={{
                                    fontSize: 'var(--text-3xl)',
                                    fontWeight: 'var(--font-black)',
                                    marginBottom: getSpacingValue('sm'),
                                }}
                            >
                                <span 
                                    style={{ 
                                        color: 'var(--team-our-primary)', 
                                        textShadow: 'var(--team-our-shadow)' 
                                    }}
                                >
                                    {matchData.myScore}
                                </span>
                                <span 
                                    className="mx-2"
                                    style={{ 
                                        color: 'var(--text-secondary)',
                                        margin: `0 ${getSpacingValue('sm')}`,
                                    }}
                                >
                                    -
                                </span>
                                <span 
                                    style={{ 
                                        color: 'var(--team-their-primary)', 
                                        textShadow: 'var(--team-their-shadow)' 
                                    }}
                                >
                                    {matchData.opponentScore}
                                </span>
                            </div>
                            <p 
                                className="font-semibold"
                                style={{
                                    color: 'var(--text-primary)',
                                    fontWeight: 'var(--font-semibold)',
                                }}
                            >
                                vs {matchData.opponentName}
                            </p>
                            <p 
                                className="text-sm"
                                style={{
                                    color: 'var(--text-muted)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                {matchData.events.length} events • {formatTime(matchData.finalTime)}
                            </p>
                        </div>
                    </div>

                    {/* Coach Selection */}
                    {coaches.length > 0 && (
                        <div className="mb-6" style={{ marginBottom: getSpacingValue('xl') }}>
                            <label 
                                className="block text-sm font-medium mb-2"
                                style={{
                                    color: 'var(--text-primary)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    marginBottom: getSpacingValue('sm'),
                                    display: 'block',
                                }}
                            >
                                Send to Coach:
                            </label>
                            <select
                                value={selectedCoach?.id || ''}
                                onChange={(e) => {
                                    const coach = coaches.find(c => c.id === e.target.value);
                                    setSelectedCoach(coach);
                                }}
                                className="w-full rounded-lg px-3 py-2"
                                style={{
                                    border: 'var(--border-primary)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`,
                                    backgroundColor: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    width: '100%',
                                }}
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
                    <div 
                        className="rounded-xl p-4 mb-4"
                        style={{
                            backgroundColor: 'var(--bg-info)',
                            border: 'var(--border-info)',
                            borderRadius: 'var(--radius-xl)',
                            padding: getSpacingValue('md'),
                            marginBottom: getSpacingValue('lg'),
                        }}
                    >
                        <div 
                            className="flex items-center gap-3 mb-3"
                            style={{ 
                                gap: getSpacingValue('md'),
                                marginBottom: getSpacingValue('md'),
                            }}
                        >
                            <Mail 
                                size={24} 
                                style={{ color: 'var(--status-info)' }}
                            />
                            <div>
                                <h3 
                                    className="font-semibold"
                                    style={{
                                        color: 'var(--text-info)',
                                        fontWeight: 'var(--font-semibold)',
                                    }}
                                >
                                    Email to Coach
                                </h3>
                                <p 
                                    className="text-sm"
                                    style={{
                                        color: 'var(--text-info-secondary)',
                                        fontSize: 'var(--text-sm)',
                                    }}
                                >
                                    Send complete match report directly
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleEmailSubmission}
                            disabled={isProcessing || !selectedCoach}
                            className="w-full py-3 rounded-xl font-semibold transition-colors transform active:scale-95"
                            style={{
                                ...createButtonStyles('primary'),
                                padding: getSpacingValue('md'),
                                width: '100%',
                                cursor: isProcessing || !selectedCoach ? 'not-allowed' : 'pointer',
                                opacity: isProcessing || !selectedCoach ? 0.6 : 1,
                            }}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2" style={{ gap: getSpacingValue('sm') }}>
                                    <div 
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        style={{
                                            width: '1rem',
                                            height: '1rem',
                                            border: '2px solid white',
                                            borderTopColor: 'transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                        }}
                                    />
                                    Opening Email...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2" style={{ gap: getSpacingValue('sm') }}>
                                    <Mail size={20} />
                                    Email Coach (Recommended)
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Alternative Options */}
                    <div className="space-y-3" style={{ gap: getSpacingValue('md') }}>
                        <button
                            onClick={handleDownloadCSV}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                            style={{
                                ...createButtonStyles('secondary'),
                                padding: `${getSpacingValue('md')} ${getSpacingValue('lg')}`,
                                gap: getSpacingValue('md'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <FileDown size={20} />
                            Download CSV Only
                        </button>

                        <button
                            onClick={handleCopySummary}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                            style={{
                                ...createButtonStyles('secondary'),
                                padding: `${getSpacingValue('md')} ${getSpacingValue('lg')}`,
                                gap: getSpacingValue('md'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <Copy size={20} />
                            Copy Summary
                        </button>

                        <button
                            onClick={() => setShowSharePanel(true)}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                            style={{
                                ...createButtonStyles('secondary'),
                                padding: `${getSpacingValue('md')} ${getSpacingValue('lg')}`,
                                gap: getSpacingValue('md'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <Share2 size={20} />
                            Share Options
                        </button>
                    </div>

                    {/* Result Message */}
                    {submissionResult && (
                        <div 
                            className="mt-4 p-3 rounded-lg flex items-center gap-2"
                            style={{
                                marginTop: getSpacingValue('md'),
                                padding: getSpacingValue('sm'),
                                borderRadius: 'var(--radius-lg)',
                                gap: getSpacingValue('sm'),
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: submissionResult.success 
                                    ? 'var(--bg-success)' 
                                    : 'var(--bg-error)',
                                border: submissionResult.success 
                                    ? 'var(--border-success)' 
                                    : 'var(--border-error)',
                                color: submissionResult.success 
                                    ? 'var(--text-success)' 
                                    : 'var(--text-error)',
                            }}
                        >
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
                        className="mt-4 w-full px-4 py-2 rounded-lg transition-all"
                        style={{
                            ...createButtonStyles('secondary'),
                            marginTop: getSpacingValue('md'),
                            padding: `${getSpacingValue('sm')} ${getSpacingValue('lg')}`,
                            width: '100%',
                        }}
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
 * Attachment Instructions Component - Unified Theme System
 */
const AttachmentInstructions = ({ onClose, attachment }) => {
    const { createModalStyles } = useTheme();
    
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 modal-overlay"
                    onClick={onClose}
                    style={{ background: 'var(--modal-overlay)' }}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative rounded-2xl p-6 max-w-md w-full"
                    style={{
                        ...createModalStyles(),
                        padding: getSpacingValue('lg'),
                        maxWidth: '28rem',
                    }}
                >
                    {/* Success Header */}
                    <div 
                        className="text-center mb-6"
                        style={{ marginBottom: getSpacingValue('xl') }}
                    >
                        <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{
                                width: '4rem',
                                height: '4rem',
                                backgroundColor: 'var(--bg-success)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: `0 auto ${getSpacingValue('md')}`,
                            }}
                        >
                            <Mail 
                                size={32} 
                                style={{ color: 'var(--status-success)' }}
                            />
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
