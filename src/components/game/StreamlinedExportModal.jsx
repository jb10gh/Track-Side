import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Download, Copy, Check, AlertCircle, X } from 'lucide-react';
import { nativeEmailService } from '../../services/nativeEmailService';
import { copyEnhancedSummary } from '../../utils/export';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

/**
 * Streamlined Export Modal Component
 * 
 * Replaces the complex ExportDecisionModal with a clean, intuitive interface
 * Features:
 * - Beautiful formatting integration
 * - Clear email vs CSV choice
 * - Mobile-optimized design
 * - TrackSide branding
 */
export const StreamlinedExportModal = ({ 
  isOpen, 
  matchData, 
  onClose,
  formatTime,
  formatTimeForExport
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  const { createModalStyles, createButtonStyles, getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');

  const modalStyles = createModalStyles();
  const primaryButtonStyles = createButtonStyles('primary');
  const secondaryButtonStyles = createButtonStyles('secondary');

  const handleEmailShare = async () => {
    setIsGenerating(true);
    setSelectedMethod('email');
    setShareResult(null);
    
    try {
      const emailContent = nativeEmailService.generateConciseEmailContent(matchData);
      await nativeEmailService.openEmailClient(emailContent);
      
      setShareResult({
        success: true,
        message: 'Email opened successfully!',
        details: 'Beautiful match summary ready to send'
      });
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setShareResult({
        success: false,
        message: 'Failed to open email client',
        details: 'Please try again or use copy option'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySummary = async () => {
    setIsGenerating(true);
    setSelectedMethod('copy');
    setShareResult(null);
    
    try {
      await copyEnhancedSummary(matchData, formatTime, formatTimeForExport);
      
      setShareResult({
        success: true,
        message: 'Copied to clipboard!',
        details: 'Beautiful summary ready to paste'
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setShareResult({
        success: false,
        message: 'Failed to copy',
        details: 'Please try again'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCSVDownload = () => {
    setIsGenerating(true);
    setSelectedMethod('csv');
    setShareResult(null);
    
    try {
      // Use existing CSV download functionality
      const { downloadCSV } = require('../../utils/export');
      downloadCSV(matchData);
      
      setShareResult({
        success: true,
        message: 'CSV downloaded!',
        details: 'Data file saved to your device'
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setShareResult({
        success: false,
        message: 'Download failed',
        details: 'Please try again'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
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
          <div className="text-center mb-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'var(--brand-primary)',
                boxShadow: 'var(--glow-brand)',
              }}
            >
              <span 
                className="text-white font-bold text-lg"
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: 'var(--font-bold)',
                }}
              >
                TS
              </span>
            </div>
            
            <h2 
              className="text-2xl font-bold mb-2"
              style={{
                color: 'var(--text-primary)',
                fontWeight: 'var(--font-bold)',
                fontSize: 'var(--text-2xl)',
              }}
            >
              🏆 Match Complete!
            </h2>
            <p 
              style={{ color: 'var(--text-secondary)' }}
            >
              Share your beautiful match results
            </p>
          </div>

          {/* Match Preview */}
          <div 
            className="rounded-xl p-4 mb-6"
            style={{
              background: 'var(--bg-secondary)',
              border: 'var(--card-border)',
            }}
          >
            <div className="text-center">
              <div 
                className="text-3xl font-black mb-2"
                style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-black)',
                }}
              >
                <span style={{ color: ourTeam.colors.primary, textShadow: ourTeam.colors.shadow }}>
                  {matchData.myScore}
                </span>
                <span 
                  className="mx-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  -
                </span>
                <span style={{ color: theirTeam.colors.primary, textShadow: theirTeam.colors.shadow }}>
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
                vs {matchData.opponentName || 'Opponent'}
              </p>
              <p 
                className="text-sm"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {matchData.events.length} events • {matchData.finalTime || '0:00'}
              </p>
            </div>
          </div>

          {/* Export Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: getSpacingValue('md') }}>
            <button
              onClick={handleEmailShare}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{
                ...primaryButtonStyles,
                padding: `${getSpacingValue('md')} 0`,
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-bold)',
                opacity: isGenerating && selectedMethod === 'email' ? 0.7 : 1,
                cursor: isGenerating && selectedMethod === 'email' ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating && selectedMethod === 'email' ? (
                <>
                  <div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" 
                    style={{ borderColor: 'var(--text-primary)' }}
                  />
                  Opening Email...
                </>
              ) : (
                <>
                  <Mail size={24} />
                  📧 Email to Coach
                </>
              )}
            </button>

            <button
              onClick={handleCopySummary}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
              style={{
                ...secondaryButtonStyles,
                padding: `${getSpacingValue('sm')} 0`,
                fontWeight: 'var(--font-semibold)',
                opacity: isGenerating && selectedMethod === 'copy' ? 0.7 : 1,
                cursor: isGenerating && selectedMethod === 'copy' ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating && selectedMethod === 'copy' ? (
                <>
                  <div 
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" 
                  />
                  Copying...
                </>
              ) : (
                <>
                  <Copy size={20} />
                  📋 Copy Summary
                </>
              )}
            </button>

            <button
              onClick={handleCSVDownload}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
              style={{
                ...secondaryButtonStyles,
                padding: `${getSpacingValue('sm')} 0`,
                fontWeight: 'var(--font-semibold)',
                opacity: isGenerating && selectedMethod === 'csv' ? 0.7 : 1,
                cursor: isGenerating && selectedMethod === 'csv' ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating && selectedMethod === 'csv' ? (
                <>
                  <div 
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" 
                  />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={20} />
                  📊 Download CSV
                </>
              )}
            </button>
          </div>

          {/* Result Message */}
          {shareResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg flex items-center gap-2`}
              style={{
                marginTop: getSpacingValue('lg'),
                padding: getSpacingValue('sm'),
                borderRadius: 'var(--radius-md)',
                background: shareResult.success 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${shareResult.success ? 'var(--status-success)' : 'var(--status-error)'}`,
              }}
            >
              {shareResult.success ? <Check size={20} /> : <AlertCircle size={20} />}
              <div>
                <div 
                  className="font-medium"
                  style={{ color: shareResult.success ? 'var(--status-success)' : 'var(--status-error)' }}
                >
                  {shareResult.message}
                </div>
                {shareResult.details && (
                  <div 
                    className="text-sm opacity-80"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {shareResult.details}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 rounded-lg transition-colors"
            style={{
              marginTop: getSpacingValue('lg'),
              padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`,
              background: 'var(--btn-secondary-bg)',
              color: 'var(--btn-secondary-text)',
              border: 'var(--btn-secondary-border)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition-normal)',
            }}
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StreamlinedExportModal;
