import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Download, FileText, Check, AlertCircle } from 'lucide-react';
import { nativeEmailService } from '../../services/nativeEmailService';

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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-black border-2 border-[#FF1493] rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: '0 0 40px rgba(255, 20, 147, 0.4)' }}
        >
          {/* TrackSide Branding */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#FF1493] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-[#FF1493] font-bold text-lg">Track Side</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              🏆 Match Complete!
            </h2>
            <p className="text-gray-300">
              Share your match results with your coach
            </p>
          </div>

          {/* Match Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-black mb-2">
                <span style={{ color: '#FF1493' }}>{matchData.myScore}</span>
                <span className="mx-2 text-gray-400">-</span>
                <span style={{ color: 'var(--team-their-primary, #00CED1)' }}>{matchData.opponentScore}</span>
              </div>
              <p className="font-semibold text-white">vs {matchData.opponentName || 'Opponent'}</p>
              <p className="text-sm text-gray-400">
                {matchData.events.length} events • {matchData.finalTime || '0:00'}
              </p>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <button
              onClick={handleEmailShare}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-[#FF1493] to-[#FF007F] hover:from-[#FF69B4] hover:to-[#FF1493] disabled:bg-gray-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              style={{ boxShadow: '0 4px 20px rgba(255, 20, 147, 0.4)' }}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 border border-gray-600 hover:border-[#FF1493]"
            >
              <Download size={20} />
              📊 Download CSV (Optional)
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
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
                  ? 'bg-green-900/20 text-green-400 border border-green-800'
                  : 'bg-red-900/20 text-red-400 border border-red-800'
              }`}
            >
              {shareResult.success ? (
                <Check size={20} />
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
            className="mt-4 w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>

          {/* TrackSide Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              🚀 Generated by TrackSide App
            </p>
            <p className="text-xs text-gray-600">
              track-side.vercel.app
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SimplifiedExport;
