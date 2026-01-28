import React from 'react';
import { Clock, Play, Pause, Check } from 'lucide-react';
import { Button, IconButton } from '../ui';

/**
 * Enhanced Game Header - Track Side Analytics Branding
 * Separates branding from game information with improved visual hierarchy
 */

const TimerDisplay = ({ time, state }) => {
  const stateConfig = {
    NOT_STARTED: { color: 'gray', label: 'Ready', icon: Clock },
    RUNNING: { color: 'green', label: 'Live', icon: Play },
    PAUSED: { color: 'yellow', label: 'Paused', icon: Pause },
    FINISHED: { color: 'blue', label: 'Finished', icon: Check }
  };
  
  const config = stateConfig[state.status] || stateConfig.NOT_STARTED;
  const Icon = config.icon;
  
  return (
    <div className="timer-display" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid var(--border-primary)',
      backgroundColor: 'var(--bg-surface)'
    }}>
      <div className="timer-indicator" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div 
          className="status-dot" 
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: config.color === 'green' ? 'var(--color-success)' :
                               config.color === 'yellow' ? 'var(--color-warning)' :
                               config.color === 'blue' ? 'var(--color-info)' :
                               'var(--text-secondary)'
          }}
        />
        <span className="status-label" style={{
          fontSize: '12px',
          fontWeight: '500',
          color: 'var(--text-secondary)'
        }}>
          {config.label}
        </span>
      </div>
      <div className="timer-time" style={{
        fontFamily: 'var(--font-family-mono)',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-primary)'
      }}>
        {time}
      </div>
    </div>
  );
};

const ScoreDisplay = ({ ourScore, opponentScore, opponentName }) => {
  return (
    <div className="score-display" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px'
    }}>
      <div className="team-section our-team-section">
        <div className="team-label" style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-secondary)',
          marginBottom: '4px',
          textAlign: 'center'
        }}>
          Our Team
        </div>
        <div className="score-value our-score" style={{
          fontSize: '36px',
          fontWeight: '900',
          color: 'var(--team-our-primary)',
          lineHeight: '1'
        }}>
          {ourScore}
        </div>
      </div>
      
      <div className="score-divider" style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'var(--text-secondary)'
      }}>
        :
      </div>
      
      <div className="team-section opponent-team-section">
        <div className="team-label" style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-secondary)',
          marginBottom: '4px',
          textAlign: 'center'
        }}>
          {opponentName}
        </div>
        <div className="score-value opponent-score" style={{
          fontSize: '36px',
          fontWeight: '900',
          color: 'var(--team-opponent-primary)',
          lineHeight: '1'
        }}>
          {opponentScore}
        </div>
      </div>
    </div>
  );
};

const EnhancedGameHeader = ({ opponentName, ourScore, opponentScore, timerState, displayTime, headerActions }) => {
  return (
    <div className="enhanced-game-header" style={{
      width: '100%',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-primary)'
    }}>
      {/* Branding Bar */}
      <div className="branding-bar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid var(--border-secondary)'
      }}>
        <div className="brand-section" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div className="logo-container" style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            TS
          </div>
          <div className="brand-text">
            <h1 className="app-title" style={{
              fontSize: '18px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              lineHeight: '1',
              margin: 0
            }}>
              Track Side
            </h1>
            <span className="app-subtitle" style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginLeft: '4px'
            }}>
              Analytics
            </span>
          </div>
        </div>
        
        <div className="utility-section" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <TimerDisplay time={displayTime} state={timerState} />
          {headerActions}
        </div>
      </div>
      
      {/* Game Match Display */}
      <div className="match-display" style={{
        padding: '24px'
      }}>
        <div className="match-header">
          <div className="teams-display">
            <ScoreDisplay 
              ourScore={ourScore}
              opponentScore={opponentScore}
              opponentName={opponentName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { EnhancedGameHeader, TimerDisplay, ScoreDisplay };
