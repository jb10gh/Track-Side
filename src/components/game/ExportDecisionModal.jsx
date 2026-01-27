import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, FileDown, AlertTriangle, X } from 'lucide-react';

export const ExportDecisionModal = ({ 
  isOpen, 
  gameData, 
  onCopy, 
  onDownload, 
  onSkip,
  defaultAction = 'copy' 
}) => {
  const [selectedAction, setSelectedAction] = useState(defaultAction);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    setIsProcessing(true);
    setSelectedAction(action);
    
    try {
      switch (action) {
        case 'copy':
          await onCopy();
          break;
        case 'download':
          await onDownload();
          break;
        case 'skip':
          await onSkip();
          break;
      }
    } catch (error) {
      console.error('Export action failed:', error);
      setIsProcessing(false);
      return;
    }
    
    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Save Your Match Data</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose how to preserve your match statistics
              </p>
            </div>

            {/* Match Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-black mb-2">
                  <span className="text-green-600 dark:text-green-400">{gameData.myScore}</span>
                  <span className="mx-2 text-gray-400">-</span>
                  <span className="text-red-600 dark:text-red-400">{gameData.opponentScore}</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">vs {gameData.opponentName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{gameData.events.length} events recorded</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleAction('copy')}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedAction === 'copy' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardCheck size={20} className="text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">Copy Summary</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Quick copy to clipboard</div>
                  </div>
                </div>
                {selectedAction === 'copy' && (
                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                )}
              </button>

              <button
                onClick={() => handleAction('download')}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedAction === 'download' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <FileDown size={20} className="text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">Download CSV</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Save to device</div>
                  </div>
                </div>
                {selectedAction === 'download' && (
                  <div className="w-4 h-4 rounded-full bg-green-600" />
                )}
              </button>

              <button
                onClick={() => handleAction('skip')}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedAction === 'skip' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">Skip Export</div>
                    <div className="text-sm text-red-500 dark:text-red-400">Data may be lost</div>
                  </div>
                </div>
                {selectedAction === 'skip' && (
                  <div className="w-4 h-4 rounded-full bg-red-600" />
                )}
              </button>
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Processing...
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
