import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme, getSpacingValue } from '../../theme/useTheme';

/**
 * Modal Component - Unified Theme System
 * 
 * Features:
 * - Smooth animations with Framer Motion
 * - Mobile-optimized touch targets
 * - Accessibility support
 * - Backdrop blur effect
 * - Responsive sizing
 * - Unified Track Side theme integration
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  className = ''
}) => {
  const { createModalStyles } = useTheme();
  
  if (!isOpen) return null;

  const sizeClasses = {
    sm: { maxWidth: '20rem' },
    md: { maxWidth: '28rem' },
    lg: { maxWidth: '32rem' },
    xl: { maxWidth: '36rem' },
    full: { maxWidth: '100%' }
  };

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
          className="relative w-full max-h-[90vh] overflow-y-auto"
          style={{
            ...modalStyles,
            ...sizeClasses[size],
            maxHeight: '90vh',
          }}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div 
              className="flex items-center justify-between"
              style={{
                padding: getSpacingValue('lg'),
                borderBottom: 'var(--border-subtle)',
              }}
            >
              {title && (
                <h2 
                  className="text-xl font-bold"
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-bold)',
                  }}
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: 'transparent',
                    borderRadius: 'var(--radius-lg)',
                    transition: 'var(--transition-normal)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                  aria-label="Close modal"
                >
                  <X 
                    size={20} 
                    style={{ color: 'var(--text-secondary)' }}
                  />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div style={{ padding: getSpacingValue('lg') }}>
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * Simple Modal without header for custom content
 */
export const SimpleModal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = 'md',
  className = ''
}) => {
  const { createModalStyles } = useTheme();
  
  if (!isOpen) return null;

  const sizeClasses = {
    sm: { maxWidth: '20rem' },
    md: { maxWidth: '28rem' },
    lg: { maxWidth: '32rem' },
    xl: { maxWidth: '36rem' },
    full: { maxWidth: '100%' }
  };

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
          className="relative w-full max-h-[90vh] overflow-y-auto"
          style={{
            ...modalStyles,
            ...sizeClasses[size],
            maxHeight: '90vh',
          }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * Confirmation Modal
 */
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    success: 'bg-green-600 hover:bg-green-700',
    primary: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${variantClasses[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
