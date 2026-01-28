import React, { useState } from 'react';
import { Button } from '../ui';

/**
 * Simplified End Game Confirmation
 * Single confirmation with optional export options
 */

const EndGameConfirmation = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  gameData, 
  onExport 
}) => {
  const [selectedExport, setSelectedExport] = useState('none');
  
  const handleConfirm = () => {
    // Handle export if selected
    if (selectedExport !== 'none') {
      onExport(selectedExport);
    }
    
    // End game
    onConfirm();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-xl p-6 max-w-md w-full" style={{
        boxShadow: 'var(--shadow-modal)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div className="modal-content">
          <div className="modal-header mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              End Game?
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Confirm the final score and choose export options
            </p>
          </div>
          
          <div className="game-summary bg-[var(--bg-secondary)] rounded-lg p-4 mb-6">
            <div className="score-display flex items-center justify-center gap-4 mb-4">
              <div className="team-score text-center">
                <span className="team-label text-sm font-medium text-[var(--text-secondary)] block mb-1">
                  Our Team
                </span>
                <span className="score text-2xl font-bold text-[var(--team-our-primary)]">
                  {gameData.myScore}
                </span>
              </div>
              
              <div className="score-divider text-xl font-bold text-[var(--text-secondary)]">
                :
              </div>
              
              <div className="team-score text-center">
                <span className="team-label text-sm font-medium text-[var(--text-secondary)] block mb-1">
                  {gameData.opponentName}
                </span>
                <span className="score text-2xl font-bold text-[var(--team-opponent-primary)]">
                  {gameData.opponentScore}
                </span>
              </div>
            </div>
            
            <div className="game-stats flex justify-center gap-6 text-sm">
              <div className="stat text-center">
                <span className="stat-label text-[var(--text-secondary)] block">
                  Duration:
                </span>
                <span className="stat-value text-[var(--text-primary)] font-medium">
                  {gameData.duration}
                </span>
              </div>
              <div className="stat text-center">
                <span className="stat-label text-[var(--text-secondary)] block">
                  Events:
                </span>
                <span className="stat-value text-[var(--text-primary)] font-medium">
                  {gameData.events.length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="export-options mb-6">
            <h3 className="options-title text-sm font-medium text-[var(--text-primary)] mb-3">
              Export Options (Optional)
            </h3>
            <div className="export-choices space-y-2">
              <label className="export-option flex items-center gap-3 p-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="export"
                  value="none"
                  checked={selectedExport === 'none'}
                  onChange={(e) => setSelectedExport(e.target.value)}
                  className="text-[var(--color-brand)]"
                />
                <span className="option-label text-sm text-[var(--text-primary)]">
                  No Export
                </span>
              </label>
              
              <label className="export-option flex items-center gap-3 p-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="export"
                  value="copy"
                  checked={selectedExport === 'copy'}
                  onChange={(e) => setSelectedExport(e.target.value)}
                  className="text-[var(--color-brand)]"
                />
                <span className="option-label text-sm text-[var(--text-primary)]">
                  Copy to Clipboard
                </span>
              </label>
              
              <label className="export-option flex items-center gap-3 p-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="export"
                  value="csv"
                  checked={selectedExport === 'csv'}
                  onChange={(e) => setSelectedExport(e.target.value)}
                  className="text-[var(--color-brand)]"
                />
                <span className="option-label text-sm text-[var(--text-primary)]">
                  Download CSV
                </span>
              </label>
            </div>
          </div>
          
          <div className="modal-actions flex gap-3 justify-end">
            <Button 
              variant="ghost" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleConfirm}
            >
              End Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EndGameConfirmation };
