import React, { useState, useEffect } from 'react';
import { Palette, Settings, Shuffle } from 'lucide-react';
import { colorService, ColorOption } from '../../services/colorService';

interface ColorCustomizationPanelProps {
  onColorChange?: (color: ColorOption) => void;
  className?: string;
}

export const ColorCustomizationPanel: React.FC<ColorCustomizationPanelProps> = ({ 
  onColorChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ColorOption>();
  const [availableColors] = useState<ColorOption[]>(colorService.getOpponentColorOptions());

  useEffect(() => {
    // Initialize with current theme
    const currentTheme = colorService.getCurrentTheme();
    const currentOption = colorService.getColorOptionByValue(currentTheme.opponentColor);
    if (currentOption) {
      setSelectedColor(currentOption);
    }
  }, []);

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    colorService.applyThemeToDOM(color);
    colorService.saveThemePreference(color.value);
    onColorChange?.(color);
  };

  const handleRandomColor = () => {
    const randomColor = colorService.generateOpponentColor();
    handleColorSelect(randomColor);
  };

  const validateAccessibility = (color: string) => {
    const validation = colorService.validateThemeAccessibility(color);
    const allValid = Object.values(validation).every(Boolean);
    return { allValid, validation };
  };

  if (!selectedColor) {
    return null; // Loading state
  }

  return (
    <div className={`color-customization ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="color-customization-toggle flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
      >
        <Palette size={20} />
        <span className="text-sm font-medium">Team Colors</span>
        <Settings size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="color-customization-panel absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Team Colors</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <Settings size={16} className="text-gray-400" />
            </button>
          </div>
          
          {/* Color Preview */}
          <div className="p-4 border-b border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div 
                  className="w-full h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2"
                  style={{ backgroundColor: '#FF1493', boxShadow: '0 0 30px rgba(255, 20, 147, 0.8)' }}
                >
                  Our Team
                </div>
                <span className="text-xs text-gray-400">TrackSide</span>
              </div>
              <div className="text-center">
                <div 
                  className="w-full h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2"
                  style={{ 
                    backgroundColor: selectedColor.value, 
                    boxShadow: selectedColor.shadow 
                  }}
                >
                  Their Team
                </div>
                <span className="text-xs text-gray-400">{selectedColor.name}</span>
              </div>
            </div>
          </div>
          
          {/* Color Options */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">Opponent Color</h4>
              <button
                onClick={handleRandomColor}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
              >
                <Shuffle size={12} />
                Random
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {availableColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color)}
                  className={`color-option w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedColor.value === color.value 
                      ? 'border-white shadow-lg' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {selectedColor.value === color.value && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 rounded-full" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Accessibility Info */}
            <div className="text-xs text-gray-400">
              {(() => {
                const validation = validateAccessibility(selectedColor.value);
                return (
                  <div className={`flex items-center gap-1 ${
                    validation.allValid ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      validation.allValid ? 'bg-green-400' : 'bg-yellow-400'
                    }`} />
                    {validation.allValid ? 'WCAG AA Compliant' : 'Accessibility Warning'}
                  </div>
                );
              })()}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 text-center">
              Hot pink theme with dynamic opponent colors
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorCustomizationPanel;
