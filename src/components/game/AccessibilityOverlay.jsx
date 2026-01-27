import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Keyboard, Eye, Hand, Settings, X } from 'lucide-react';

// Voice command recognition
const VOICE_COMMANDS = {
  GOAL_US: 'goal us',
  GOAL_THEM: 'goal them',
  PENALTY_US: 'penalty us',
  PENALTY_THEM: 'penalty them',
  UNDO: 'undo',
  TIMER_START: 'start timer',
  TIMER_STOP: 'stop timer',
  TIMER_RESET: 'reset timer',
  FINISH_GAME: 'finish game'
};

export const AccessibilityOverlay = ({ isVisible, onDismiss, onCommand }) => {
  const [activeMode, setActiveMode] = useState('voice');
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    // Check for voice recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
    }
  }, []);

  const startVoiceRecognition = () => {
    if (!voiceSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      setLastCommand(command);
      
      // Process voice command
      Object.entries(VOICE_COMMANDS).forEach(([key, phrase]) => {
        if (command.includes(phrase)) {
          onCommand?.(key.toLowerCase());
        }
      });
      
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyPress = (event) => {
    // Keyboard shortcuts
    switch (event.key) {
      case '1':
        onCommand?.('goal_us');
        break;
      case '2':
        onCommand?.('goal_them');
        break;
      case '3':
        onCommand?.('penalty_us');
        break;
      case '4':
        onCommand?.('penalty_them');
        break;
      case 'u':
      case 'U':
        onCommand?.('undo');
        break;
      case ' ':
        event.preventDefault();
        onCommand?.('toggle_timer');
        break;
      case 'Escape':
        onDismiss();
        break;
    }
  };

  useEffect(() => {
    if (activeMode === 'keyboard' && isVisible) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [activeMode, isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Accessibility Options</h2>
            <button
              onClick={onDismiss}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              onClick={() => setActiveMode('voice')}
              className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                activeMode === 'voice'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span className="text-xs font-medium">Voice</span>
            </button>
            
            <button
              onClick={() => setActiveMode('keyboard')}
              className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                activeMode === 'keyboard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Keyboard className="w-5 h-5" />
              <span className="text-xs font-medium">Keyboard</span>
            </button>
            
            <button
              onClick={() => setActiveMode('buttons')}
              className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                activeMode === 'buttons'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Hand className="w-5 h-5" />
              <span className="text-xs font-medium">Buttons</span>
            </button>
          </div>

          {/* Voice Mode */}
          {activeMode === 'voice' && (
            <div className="space-y-4">
              <div className="text-center">
                <button
                  onClick={startVoiceRecognition}
                  disabled={!voiceSupported || isListening}
                  className={`w-full py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : voiceSupported
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  {isListening ? 'Listening...' : voiceSupported ? 'Start Voice Control' : 'Voice Not Supported'}
                </button>
                
                {lastCommand && (
                  <div className="mt-2 text-sm text-gray-600">
                    Last command: "{lastCommand}"
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">Voice Commands:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Goal us" / "Goal them"</li>
                  <li>• "Penalty us" / "Penalty them"</li>
                  <li>• "Undo"</li>
                  <li>• "Start timer" / "Stop timer"</li>
                  <li>• "Finish game"</li>
                </ul>
              </div>
            </div>
          )}

          {/* Keyboard Mode */}
          {activeMode === 'keyboard' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Keyboard shortcuts are now active. Press ESC to close this panel.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">1</kbd> - Goal for us</li>
                  <li>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">2</kbd> - Goal for them</li>
                  <li>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">3</kbd> - Penalty for us</li>
                  <li>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">4</kbd> - Penalty for them</li>
                  <li>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">U</kbd> - Undo last action</li>
                  <li>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">Space</kbd> - Toggle timer</li>
                </ul>
              </div>
            </div>
          )}

          {/* Button Mode */}
          {activeMode === 'buttons' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onCommand?.('goal_us')}
                  className="bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Goal Us
                </button>
                <button
                  onClick={() => onCommand?.('goal_them')}
                  className="bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Goal Them
                </button>
                <button
                  onClick={() => onCommand?.('penalty_us')}
                  className="bg-yellow-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                >
                  Penalty Us
                </button>
                <button
                  onClick={() => onCommand?.('penalty_them')}
                  className="bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Penalty Them
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onCommand?.('undo')}
                  className="bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Undo
                </button>
                <button
                  onClick={() => onCommand?.('toggle_timer')}
                  className="bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Timer
                </button>
                <button
                  onClick={() => onCommand?.('finish_game')}
                  className="bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                >
                  Finish
                </button>
              </div>
            </div>
          )}

          {/* Additional Options */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High contrast mode</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-600">Large text</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Screen reader announcements
export const ScreenReaderAnnouncer = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  };

  useEffect(() => {
    // Make announce function globally available
    window.announceToScreenReader = announce;
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};
