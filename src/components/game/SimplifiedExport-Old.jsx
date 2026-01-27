import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Download, FileText, Check, AlertCircle } from 'lucide-react';
import { nativeEmailService } from '../../services/nativeEmailService';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

/**
 * Simplified Export Component - Native Email Flow
 * 
 * Features:
 * - Native email client integration
 * - Concise, impactful email content
 * - CSV download option
 * - Strong encouragement to share
 * - TrackSide branding throughout
 */
export const SimplifiedExport = ({ matchData, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const { createModalStyles, createButtonStyles, getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');

  const modalStyles = createModalStyles();
  const primaryButtonStyles = createButtonStyles('primary');
  const secondaryButtonStyles = createButtonStyles('secondary');

  const handleEmailShare = async () => {
    setIsGenerating(true);
    setShareResult(null);
    
    try {
      const emailContent = nativeEmailService.generateConciseEmailContent(matchData);
      await nativeEmailService.openEmailClient(emailContent);
      
      setShareResult({
        success: true,
        message: 'Email client opened successfully!',
        details: 'CSV file ready to attach'
      });
      
      // Auto-close after successful email open
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setShareResult({
        success: false,
        message: 'Failed to open email client',
        details: 'Please try again'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCSVDownload = () => {
    try {
      nativeEmailService.generateCSVDownload(matchData);
      setShareResult({
        success: true,
        message: 'CSV downloaded successfully!',
        details: 'File ready to email'
      });
    } catch (error) {
      setShareResult({
        success: false,
        message: 'Download failed',
        details: 'Please try again'
      });
    }
  };

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
          {/* TrackSide Branding */}
          <div className="text-center">
            <div 
              className="flex items-center justify-center gap-2 mb-4"
              style={{ marginBottom: getSpacingValue('lg') }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'var(--brand-primary)',
                  boxShadow: 'var(--glow-brand)',
                }}
              >
                <span 
                  className="text-white font-bold text-sm"
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: 'var(--font-bold)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  TS
                </span>
              </div>
              <span 
                className="font-bold text-lg"
                style={{
                  color: 'var(--brand-primary)',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-lg)',
                }}
              >
                Track Side
              </span>
            </div>
            
            <h2 
              className="text-2xl font-bold mb-2"
              style={{
                color: 'var(--text-primary)',
                fontWeight: 'var(--font-bold'),
                fontSize: 'var(--text-2xl)',
                marginBottom: getSpacingValue('sm'),
              }}
            >
              🏆 Match Complete!
            </h2>
            <p 
              style={{
                color: 'var(--text-muted)',
              }}
            >
              Share your match results with your coach
            </p>
          </div>

          {/* Match Preview */}
          <div 
            className="rounded-xl p-4 mb-6"
            style={{
              background: 'var(--bg-secondary)',
              border: 'var(--card-border)',
              marginBottom: getSpacingValue('xl'),
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
                  style={{ color: 'var(--text-muted)' }}
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
                  color: 'var(--text-muted)',
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
                opacity: isGenerating ? 0.7 : 1,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating ? (
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
                  📧 Email Coach (Recommended)
                </>
              )}
            </button>

            <button
              onClick={handleCSVDownload}
              className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
              style={{
                ...secondaryButtonStyles,
                padding: `${getSpacingValue('sm')} 0`,
                fontWeight: 'var(--font-semibold)',
              }}
            >
              <Download size={20} />
              📊 Download CSV (Optional)
            </button>
          </div>

          {/* Instructions */}
          <div 
            className="mt-6 p-4 rounded-lg"
            style={{
              marginTop: getSpacingValue('xl'),
              padding: getSpacingValue('md'),
              background: 'var(--bg-secondary)',
              border: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-[#FF1493] mt-1" />
              <div>
                <p className="text-sm text-gray-300 font-medium mb-1">
                  � Professional Email Sent
                </p>
                <p className="text-xs text-gray-400">
                  Professional match analysis will be sent to your coach. CSV file is available for download if needed.
                </p>
              </div>
            </div>
          </div>

          {/* Result Message */}
          {shareResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                shareResult.success 
            </p>
          </div>
        </div>
      ) : (
        <AlertCircle size={20} />
      )}
      <div>
        <div className="font-medium">{shareResult.message}</div>
        {shareResult.details && (
          <div className="text-sm opacity-80">{shareResult.details}</div>
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

  {/* TrackSide Footer */}
  <div 
    className="mt-4 text-center"
    style={{ marginTop: getSpacingValue('lg') }}
  >
    <p 
      className="text-xs"
      style={{
        color: 'var(--text-disabled)',
        fontSize: 'var(--text-xs)',
      }}
    >
      🚀 Generated by TrackSide App
    </p>
    <p 
      className="text-xs"
      style={{
        color: 'var(--text-disabled)',
        fontSize: 'var(--text-xs)',
      }}
    >
      track-side.vercel.app
    </p>
  </div>
</motion.div>
</div>
</AnimatePresence>
  );
};

export default SimplifiedExport;
