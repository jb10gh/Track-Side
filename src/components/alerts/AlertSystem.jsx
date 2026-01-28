import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Play, Pause, Check, X } from 'lucide-react';
import { Button } from '../ui';

/**
 * Timer Alert System - Behavioral Modes Implementation
 * Provides contextual alerts based on timer state
 */

const TIMER_MODES = {
  NOT_STARTED: {
    alerts: ['timer_not_started'],
    allowedActions: ['start_timer'],
    blockedActions: ['add_events'],
    message: 'Start the timer before adding events',
    severity: 'warning'
  },
  RUNNING: {
    alerts: [],
    allowedActions: ['add_events', 'pause_timer'],
    blockedActions: [],
    message: '',
    severity: 'info'
  },
  PAUSED: {
    alerts: ['timer_paused'],
    allowedActions: ['add_events', 'resume_timer'],
    blockedActions: [],
    message: 'Timer is paused - events will be marked at current time',
    severity: 'info'
  },
  FINISHED: {
    alerts: ['timer_finished'],
    allowedActions: [],
    blockedActions: ['add_events'],
    message: 'Game is finished - no more events can be added',
    severity: 'error'
  }
};

const AlertSystem = ({ timerState, onAction }) => {
  const [alerts, setAlerts] = useState([]);
  const currentMode = TIMER_MODES[timerState.status] || TIMER_MODES.NOT_STARTED;
  
  useEffect(() => {
    if (currentMode.alerts.length > 0) {
      const newAlerts = currentMode.alerts.map(alertType => ({
        id: `${alertType}-${Date.now()}`,
        type: alertType,
        message: getAlertMessage(alertType, timerState),
        severity: currentMode.severity,
        actions: getAlertActions(alertType, onAction)
      }));
      setAlerts(newAlerts);
    } else {
      setAlerts([]);
    }
  }, [timerState.status, onAction]);
  
  const getAlertMessage = (alertType, context) => {
    const messages = {
      timer_not_started: {
        primary: "Start the timer before adding events",
        secondary: "This ensures accurate game timing and event tracking"
      },
      timer_paused: {
        primary: "Timer is currently paused",
        secondary: "Events will be marked at the current time"
      },
      timer_finished: {
        primary: "Game is finished",
        secondary: "No more events can be added to this match"
      }
    };
    
    return messages[alertType] || { primary: "Unknown alert", secondary: "" };
  };
  
  const getAlertActions = (alertType, onAction) => {
    const actions = {
      timer_not_started: [
        { 
          label: "Start Timer", 
          variant: "primary", 
          handler: () => onAction?.startTimer?.() 
        }
      ],
      timer_paused: [
        { 
          label: "Resume Timer", 
          variant: "primary", 
          handler: () => onAction?.resumeTimer?.() 
        },
        { 
          label: "Add Anyway", 
          variant: "secondary", 
          handler: () => onAction?.allowPausedEvents?.() 
        }
      ]
    };
    
    return actions[alertType] || [];
  };
  
  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };
  
  return (
    <div className="alert-system space-y-3">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          severity={alert.severity}
          message={alert.message}
          actions={alert.actions}
          onDismiss={() => dismissAlert(alert.id)}
        />
      ))}
    </div>
  );
};

const Alert = ({ type, severity, message, actions, onDismiss }) => {
  const alertStyles = {
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-100',
    error: 'bg-red-500/10 border-red-500/30 text-red-100',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-100',
    success: 'bg-green-500/10 border-green-500/30 text-green-100'
  };
  
  const getAlertIcon = (alertType) => {
    const icons = {
      timer_not_started: Clock,
      timer_paused: Pause,
      timer_finished: Check
    };
    
    return icons[alertType] || AlertTriangle;
  };
  
  const AlertIcon = getAlertIcon(type);
  
  return (
    <div 
      className={`alert ${alertStyles[severity]} border rounded-lg p-4 animate-slide-in`}
      style={{
        background: `var(--bg-surface)`,
        borderColor: `var(--border-primary)`,
        animation: 'slideInDown 0.3s ease-out'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertIcon 
            size={20} 
            style={{ 
              color: severity === 'warning' ? 'var(--color-warning)' : 
                     severity === 'error' ? 'var(--color-error)' : 
                     severity === 'info' ? 'var(--color-info)' : 
                     'var(--color-success)'
            }} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
            {message.primary}
          </p>
          {message.secondary && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {message.secondary}
            </p>
          )}
          
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'secondary'}
                  size="sm"
                  onClick={action.handler}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export { AlertSystem, Alert };
