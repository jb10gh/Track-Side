---
@skills: content-creator, doc-coauthoring, ui-ux-pro-max, typescript-expert, architecture
context_priority: critical
document_type: component-documentation
execution_date: 2024-01-28
reviewers: [human, ai-assistant]
---

# 📚 Component Documentation Library

## 🎯 Overview

This document provides comprehensive documentation for all components refactored with the unified Track Side theme system. Each component includes usage examples, theme integration patterns, and best practices.

## 🏆 Critical Components

### **1. ScoreBoard Component**

#### **File**: `src/components/game/ScoreBoard.jsx`

#### **Description**
The ScoreBoard component displays the current game score, timer, and team information with enhanced visual effects and team-specific styling.

#### **Props**
```typescript
interface ScoreBoardProps {
  ourScore: number;
  theirScore: number;
  timer: number;
  isRunning: boolean;
  opponentName?: string;
}
```

#### **Theme Integration**
```jsx
import { useTheme, useTeamTheme } from '../../theme/useTheme';

export const ScoreBoard = ({ ourScore, theirScore, timer, isRunning, opponentName }) => {
  const { getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  // Theme integration for team colors
  const scoreDisplay = (
    <div>
      <span style={{ 
        color: ourTeam.colors.primary, 
        textShadow: ourTeam.colors.shadow 
      }}>
        {ourScore}
      </span>
      <span>-</span>
      <span style={{ 
        color: theirTeam.colors.primary, 
        textShadow: theirTeam.colors.shadow 
      }}>
        {theirScore}
      </span>
    </div>
  );
};
```

#### **Usage Example**
```jsx
import { ScoreBoard } from '../game/ScoreBoard';

export const GamePage = () => {
  const [ourScore, setOurScore] = useState(0);
  const [theirScore, setTheirScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  return (
    <ScoreBoard
      ourScore={ourScore}
      theirScore={theirScore}
      timer={timer}
      isRunning={isRunning}
      opponentName="Opponent Team"
    />
  );
};
```

#### **Theme Features**
- **Team Colors**: Dynamic our/their team color application
- **Enhanced Typography**: Theme fonts and weights
- **Semantic Spacing**: Using getSpacingValue utilities
- **Visual Effects**: Team-specific glows and shadows
- **Professional Timer**: Clean timer display without flashing indicators

---

### **2. SimplifiedExport Component**

#### **File**: `src/components/game/SimplifiedExport.jsx`

#### **Description**
The SimplifiedExport component provides a modal interface for exporting match data with various options including email, CSV download, and sharing.

#### **Props**
```typescript
interface SimplifiedExportProps {
  matchData: {
    id: string;
    myScore: number;
    opponentScore: number;
    opponentName: string;
    events: Array<any>;
    finalTime: number;
  };
  onClose: () => void;
}
```

#### **Theme Integration**
```jsx
import { useTheme, useTeamTheme } from '../../theme/useTheme';

export const SimplifiedExport = ({ matchData, onClose }) => {
  const { createModalStyles, createButtonStyles, getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  const modalStyles = createModalStyles();
  
  return (
    <div style={modalStyles}>
      <div style={{
        ...createButtonStyles('primary'),
        padding: getSpacingValue('md')
      }}>
        Export Options
      </div>
    </div>
  );
};
```

#### **Usage Example**
```jsx
import { SimplifiedExport } from '../game/SimplifiedExport';

export const MatchDetailPage = () => {
  const [showExport, setShowExport] = useState(false);
  const matchData = {
    id: 'match-1',
    myScore: 3,
    opponentScore: 2,
    opponentName: 'Opponent Team',
    events: [],
    finalTime: 3600
  };
  
  return (
    <>
      <button onClick={() => setShowExport(true)}>
        Export Match
      </button>
      {showExport && (
        <SimplifiedExport
          matchData={matchData}
          onClose={() => setShowExport(false)}
        />
      )}
    </>
  );
};
```

#### **Theme Features**
- **Modal Styling**: Using createModalStyles for consistent appearance
- **Button Standardization**: Using createButtonStyles utilities
- **Team Colors**: Score display with team-specific colors
- **Professional Layout**: Consistent spacing and typography
- **Enhanced Interactions**: Smooth hover effects and transitions

---

### **3. MatchDetailView Component**

#### **File**: `src/components/match/MatchDetailView.jsx`

#### **Description**
The MatchDetailView component provides a comprehensive interface for viewing and editing match details, including scores, events, and metadata.

#### **Props**
```typescript
interface MatchDetailViewProps {
  matchId: string;
  onClose: () => void;
}
```

#### **Theme Integration**
```jsx
import { useTheme, useTeamTheme } from '../../theme/useTheme';

export const MatchDetailView = ({ matchId, onClose }) => {
  const { createModalStyles, createButtonStyles, getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  return (
    <div style={createModalStyles()}>
      <div style={{
        padding: getSpacingValue('lg'),
        borderBottom: 'var(--border-subtle)'
      }}>
        <h2 style={{
          color: 'var(--text-primary)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-bold)'
        }}>
          Match Details
        </h2>
      </div>
    </div>
  );
};
```

#### **Usage Example**
```jsx
import { MatchDetailView } from '../match/MatchDetailView';

export const MatchListPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  return (
    <>
      <div>
        {matches.map(match => (
          <div key={match.id} onClick={() => setSelectedMatch(match.id)}>
            {match.opponentName}
          </div>
        ))}
      </div>
      {selectedMatch && (
        <MatchDetailView
          matchId={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </>
  );
};
```

#### **Theme Features**
- **Complete Theme Integration**: All sections use unified theme system
- **Team Color Management**: Proper our/their team distinction
- **Button Standardization**: Using createButtonStyles utilities
- **Semantic Spacing**: Using getSpacingValue throughout
- **Professional Typography**: Consistent fonts and weights

---

## 🏠 High Priority Components

### **4. MatchCard Component**

#### **File**: `src/components/home/MatchCard.jsx`

#### **Description**
The MatchCard component displays a summary of a match with score, opponent information, and action buttons in a card format.

#### **Props**
```typescript
interface MatchCardProps {
  match: {
    id: string;
    myScore: number;
    opponentScore: number;
    opponentName: string;
    date: string;
    events: Array<any>;
    finalTime: number;
  };
  onView: (matchId: string) => void;
  onEdit: (matchId: string) => void;
  onDelete: (matchId: string) => void;
}
```

#### **Theme Integration**
```jsx
import { useTheme, useTeamTheme } from '../../theme/useTheme';

export const MatchCard = ({ match, onView, onEdit, onDelete }) => {
  const { createCardStyles, createButtonStyles, getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  const cardStyles = createCardStyles();
  
  return (
    <div style={cardStyles}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: getSpacingValue('md')
      }}>
        <div>
          <span style={{ 
            color: ourTeam.colors.primary, 
            textShadow: ourTeam.colors.shadow 
          }}>
            {match.myScore}
          </span>
          <span>-</span>
          <span style={{ 
            color: theirTeam.colors.primary, 
            textShadow: theirTeam.colors.shadow 
          }}>
            {match.opponentScore}
          </span>
        </div>
        <div style={{ gap: getSpacingValue('sm') }}>
          <button style={createButtonStyles('secondary')}>
            View
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### **Usage Example**
```jsx
import { MatchCard } from '../home/MatchCard';

export const MatchList = () => {
  const handleView = (matchId) => console.log('View match:', matchId);
  const handleEdit = (matchId) => console.log('Edit match:', matchId);
  const handleDelete = (matchId) => console.log('Delete match:', matchId);
  
  return (
    <div>
      {matches.map(match => (
        <MatchCard
          key={match.id}
          match={match}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
```

#### **Theme Features**
- **Card Styling**: Using createCardStyles for consistent appearance
- **Team Colors**: Score display with our/their team distinction
- **Enhanced Interactions**: Smooth hover effects with theme transitions
- **Professional Typography**: Consistent fonts and weights
- **Semantic Spacing**: Using getSpacingValue utilities

---

### **5. ActionGrid Component**

#### **File**: `src/components/game/ActionGrid.jsx`

#### **Description**
The ActionGrid component provides a grid of action buttons for game events, with team-specific styling and enhanced interactions.

#### **Props**
```typescript
interface ActionGridProps {
  onOurGoal: () => void;
  onTheirGoal: () => void;
  onOurPenalty: () => void;
  onTheirPenalty: () => void;
  disabled?: boolean;
}
```

#### **Theme Integration**
```jsx
import { useTheme, useTeamTheme } from '../../theme/useTheme';

export const ActionGrid = ({ onOurGoal, onTheirGoal, onOurPenalty, onTheirPenalty, disabled }) => {
  const { getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: getSpacingValue('md'),
      padding: getSpacingValue('lg')
    }}>
      <button
        onClick={onOurGoal}
        disabled={disabled}
        style={{
          backgroundColor: ourTeam.colors.primary,
          color: 'var(--text-primary)',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          padding: getSpacingValue('lg'),
          transition: 'var(--transition-normal)',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        Our Goal
      </button>
      <button
        onClick={onTheirGoal}
        disabled={disabled}
        style={{
          backgroundColor: theirTeam.colors.primary,
          color: 'var(--text-primary)',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          padding: getSpacingValue('lg'),
          transition: 'var(--transition-normal)',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        Their Goal
      </button>
    </div>
  );
};
```

#### **Usage Example**
```jsx
import { ActionGrid } from '../game/ActionGrid';

export const GamePage = () => {
  const handleOurGoal = () => console.log('Our goal scored');
  const handleTheirGoal = () => console.log('Their goal scored');
  const handleOurPenalty = () => console.log('Our penalty');
  const handleTheirPenalty = () => console.log('Their penalty');
  
  return (
    <ActionGrid
      onOurGoal={handleOurGoal}
      onTheirGoal={handleTheirGoal}
      onOurPenalty={handleOurPenalty}
      onTheirPenalty={handleTheirPenalty}
      disabled={false}
    />
  );
};
```

#### **Theme Features**
- **Team-Specific Buttons**: Each action button uses respective team colors
- **Enhanced Interactions**: Scale transforms with team-specific glows
- **Semantic Layout**: Grid system with theme spacing
- **Consistent Typography**: Theme fonts and weights throughout
- **Visual Feedback**: Smooth transitions and hover states

---

## 🏗️ Medium Priority Components

### **6. Modal Component**

#### **File**: `src/components/game/Modal.jsx`

#### **Description**
The Modal component provides a base modal interface with backdrop, animations, and theme integration.

#### **Props**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
}
```

#### **Theme Integration**
```jsx
import { useTheme, getSpacingValue } from '../../theme/useTheme';

export const Modal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) => {
  const { createModalStyles } = useTheme();
  
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
        <motion.div
          className="absolute inset-0 modal-overlay"
          onClick={onClose}
          style={{ background: 'var(--modal-overlay)' }}
        />
        <motion.div
          className="relative w-full max-h-[90vh] overflow-y-auto"
          style={{
            ...modalStyles,
            ...sizeClasses[size],
            maxHeight: '90vh'
          }}
        >
          {/* Modal content */}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```

#### **Usage Example**
```jsx
import { Modal } from '../game/Modal';

export const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
        size="md"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
};
```

#### **Theme Features**
- **Modal Styling**: Using createModalStyles for consistent appearance
- **Size Management**: Responsive size classes with theme integration
- **Enhanced Interactions**: Smooth hover effects with theme transitions
- **Semantic Typography**: Consistent fonts and weights
- **Backdrop Styling**: Theme-appropriate backdrop with blur effect

---

### **7. Shell Component**

#### **File**: `src/components/layout/Shell.jsx`

#### **Description**
The Shell component provides the main application layout with header, navigation, and content areas.

#### **Props**
```typescript
interface ShellProps {
  children: React.ReactNode;
  title?: string;
  headerAction?: React.ReactNode;
}
```

#### **Theme Integration**
```jsx
import { useTheme, getSpacingValue } from '../../theme/useTheme';

export const Shell = ({ children, title, headerAction }) => {
  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        transition: 'var(--transition-normal)',
        minHeight: '100vh'
      }}
    >
      <header 
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: 'var(--border-primary)',
          padding: `${getSpacingValue('md')} ${getSpacingValue('lg')}`,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40
        }}
      >
        <h1 
          style={{
            color: 'var(--text-primary)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            letterSpacing: '-0.025em',
            textShadow: 'var(--glow-brand)'
          }}
        >
          {title || 'TrackSide'}
        </h1>
        {headerAction && (
          <div style={{ gap: getSpacingValue('md') }}>
            {headerAction}
          </div>
        )}
      </header>
      
      <main 
        style={{
          paddingTop: `calc(5rem + ${getSpacingValue('md')})`,
          paddingBottom: `calc(2rem + var(--safe-area-bottom, 0px))`,
          paddingLeft: getSpacingValue('md'),
          paddingRight: getSpacingValue('md'),
          maxWidth: '56rem',
          margin: '0 auto'
        }}
      >
        {children}
      </main>
    </div>
  );
};
```

#### **Usage Example**
```jsx
import { Shell } from '../layout/Shell';

export const HomePage = () => {
  const headerAction = (
    <button>
      Settings
    </button>
  );
  
  return (
    <Shell
      title="TrackSide"
      headerAction={headerAction}
    >
      <div>
        <h2>Welcome to TrackSide</h2>
        <p>Your sports tracking companion</p>
      </div>
    </Shell>
  );
};
```

#### **Theme Features**
- **Professional Header**: Enhanced styling with brand glow
- **Theme Integration**: Full useTheme hook usage
- **Semantic Spacing**: Using getSpacingValue utilities
- **Professional Typography**: Consistent fonts with text shadow
- **Responsive Layout**: Proper spacing and max-width

---

### **8. TimerInvocationModal Component**

#### **File**: `src/components/game/TimerInvocationModal.jsx`

#### **Description**
The TimerInvocationModal component provides contextual prompts for timer management with different urgency levels and actions.

#### **Props**
```typescript
interface TimerInvocationModalProps {
  isOpen: boolean;
  trigger: 'manual' | 'match_start' | 'first_event' | 'period_change';
  onStart: () => void;
  onSkip: () => void;
  onDismiss: () => void;
}
```

#### **Theme Integration**
```jsx
import { useTheme, createButtonStyles, getSpacingValue } from '../../theme/useTheme';

export const TimerInvocationModal = ({ isOpen, trigger, onStart, onSkip, onDismiss }) => {
  const { createModalStyles } = useTheme();
  
  const modalStyles = createModalStyles();
  
  const getTriggerMessage = () => {
    switch (trigger) {
      case 'match_start':
        return {
          title: '⏰ Don\'t Forget to Start the Timer!',
          message: 'Track Side needs accurate game time for better statistics and analysis',
          urgency: 'high',
          icon: '⏰'
        };
      // ... other cases
    }
  };
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 modal-overlay"
          onClick={onDismiss}
          style={{ background: 'var(--modal-overlay)' }}
        />
        <motion.div
          className="relative rounded-2xl p-6 max-w-md w-full"
          style={{
            ...modalStyles,
            padding: getSpacingValue('lg'),
            maxWidth: '28rem'
          }}
        >
          <div style={{ marginBottom: getSpacingValue('xl') }}>
            <AlertTriangle 
              size={48} 
              style={{ color: 'var(--status-error)' }}
            />
            <h3 style={{
              color: 'var(--text-primary)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)'
            }}>
              {message.title}
            </h3>
          </div>
          
          <button
            onClick={onStart}
            style={{
              ...createButtonStyles('primary'),
              padding: `${getSpacingValue('md')} ${getSpacingValue('lg')}`
            }}
          >
            ⏰ Start Timer Now
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```

#### **Usage Example**
```jsx
import { TimerInvocationModal } from '../game/TimerInvocationModal';

export const GamePage = () => {
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [trigger, setTrigger] = useState('manual');
  
  const handleStart = () => {
    console.log('Timer started');
    setShowTimerModal(false);
  };
  
  const handleSkip = () => {
    console.log('Timer skipped');
    setShowTimerModal(false);
  };
  
  const handleDismiss = () => {
    setShowTimerModal(false);
  };
  
  return (
    <>
      <button onClick={() => setShowTimerModal(true)}>
        Show Timer Modal
      </button>
      <TimerInvocationModal
        isOpen={showTimerModal}
        trigger={trigger}
        onStart={handleStart}
        onSkip={handleSkip}
        onDismiss={handleDismiss}
      />
    </>
  );
};
```

#### **Theme Features**
- **Modal Structure**: Using createModalStyles for consistent appearance
- **Status Colors**: Using theme status colors for icons and messages
- **Button Styling**: Using createButtonStyles utilities
- **Semantic Spacing**: Using getSpacingValue utilities
- **Animation System**: Maintained with theme integration

---

### **9. EnhancedExportModal Component**

#### **File**: `src/components/game/EnhancedExportModal.jsx`

#### **Description**
The EnhancedExportModal component provides a comprehensive export interface with email submission, coach selection, and multiple export options.

#### **Props**
```typescript
interface EnhancedExportModalProps {
  matchData: {
    id: string;
    myScore: number;
    opponentScore: number;
    opponentName: string;
    events: Array<any>;
    finalTime: number;
  };
  onClose: () => void;
}
```

#### **Theme Integration**
```jsx
import { useTheme, createButtonStyles, getSpacingValue } from '../../theme/useTheme';

export const EnhancedExportModal = ({ matchData, onClose }) => {
  const { createModalStyles } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  const modalStyles = createModalStyles();
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 modal-overlay"
          onClick={onClose}
          style={{ background: 'var(--modal-overlay)' }}
        />
        <motion.div
          className="relative rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          style={{
            ...modalStyles,
            padding: getSpacingValue('lg'),
            maxWidth: '28rem',
            maxHeight: '90vh'
          }}
        >
          <div style={{ marginBottom: getSpacingValue('xl') }}>
            <h2 style={{
              color: 'var(--text-primary)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)'
            }}>
              Submit Match Report
            </h2>
          </div>
          
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: getSpacingValue('md'),
            marginBottom: getSpacingValue('xl')
          }}>
            <div style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-black)',
              marginBottom: getSpacingValue('sm')
            }}>
              <span style={{ 
                color: ourTeam.colors.primary, 
                textShadow: ourTeam.colors.shadow 
              }}>
                {matchData.myScore}
              </span>
              <span style={{ 
                color: 'var(--text-secondary)',
                margin: `0 ${getSpacingValue('sm')}`
              }}>
                -
              </span>
              <span style={{ 
                color: theirTeam.colors.primary, 
                textShadow: theirTeam.colors.shadow 
              }}>
                {matchData.opponentScore}
              </span>
            </div>
          </div>
          
          <button
            style={{
              ...createButtonStyles('primary'),
              padding: getSpacingValue('md'),
              width: '100%'
            }}
          >
            Email Coach (Recommended)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```

#### **Usage Example**
```jsx
import { EnhancedExportModal } from '../game/EnhancedExportModal';

export const MatchDetailPage = () => {
  const [showExport, setShowExport] = useState(false);
  const matchData = {
    id: 'match-1',
    myScore: 3,
    opponentScore: 2,
    opponentName: 'Opponent Team',
    events: [],
    finalTime: 3600
  };
  
  return (
    <>
      <button onClick={() => setShowExport(true)}>
        Enhanced Export
      </button>
      <EnhancedExportModal
        matchData={matchData}
        onClose={() => setShowExport(false)}
      />
    </>
  );
};
```

#### **Theme Features**
- **Modal Styling**: Using createModalStyles for consistent appearance
- **Team Colors**: Score display with our/their team distinction
- **Button Styling**: Using createButtonStyles utilities
- **Form Elements**: Select dropdown with theme integration
- **Status Messages**: Success/error states with theme colors

---

## 🔧 Usage Patterns

### **1. Theme Hook Integration**
```jsx
import { useTheme, useTeamTheme } from '../../theme/useTheme';

const MyComponent = () => {
  const { createCardStyles, createButtonStyles, getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  return (
    <div style={createCardStyles()}>
      <button style={createButtonStyles('primary')}>
        Action
      </button>
    </div>
  );
};
```

### **2. Team Color Application**
```jsx
const ScoreDisplay = ({ ourScore, theirScore }) => {
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  return (
    <div>
      <span style={{ 
        color: ourTeam.colors.primary, 
        textShadow: ourTeam.colors.shadow 
      }}>
        {ourScore}
      </span>
      <span>-</span>
      <span style={{ 
        color: theirTeam.colors.primary, 
        textShadow: theirTeam.colors.shadow 
      }}>
        {theirScore}
      </span>
    </div>
  );
};
```

### **3. Semantic Spacing**
```jsx
const LayoutComponent = () => {
  const { getSpacingValue } = useTheme();
  
  return (
    <div style={{
      padding: getSpacingValue('lg'),
      margin: getSpacingValue('md'),
      gap: getSpacingValue('sm')
    }}>
      Content
    </div>
  );
};
```

### **4. Style Generators**
```jsx
const CardComponent = () => {
  const { createCardStyles, createButtonStyles } = useTheme();
  
  return (
    <div style={createCardStyles()}>
      <h2>Card Title</h2>
      <button style={createButtonStyles('primary')}>
        Action
      </button>
    </div>
  );
};
```

## 📋 Best Practices

### **1. Always Use Theme Hooks**
```jsx
// ✅ Good
import { useTheme } from '../../theme/useTheme';
const { createCardStyles } = useTheme();

// ❌ Avoid
const styles = { backgroundColor: '#FF1493' };
```

### **2. Use Team Colors for Team Elements**
```jsx
// ✅ Good
const ourTeam = useTeamTheme('our');
<span style={{ color: ourTeam.colors.primary }}>

// ❌ Avoid
<span style={{ color: '#FF1493' }}>
```

### **3. Use Style Generators**
```jsx
// ✅ Good
<button style={createButtonStyles('primary')}>

// ❌ Avoid
<button style={{
  backgroundColor: 'var(--trackside-hot-pink)',
  color: 'var(--text-primary)',
  padding: 'var(--spacing-sm) var(--spacing-md)'
}}>
```

### **4. Use Semantic Spacing**
```jsx
// ✅ Good
<div style={{ padding: getSpacingValue('md') }}>

// ❌ Avoid
<div style={{ padding: '16px' }}>
```

### **5. Maintain Consistency**
```jsx
// ✅ Good
const { getSpacingValue } = useTheme();
<div style={{
  padding: getSpacingValue('md'),
  margin: getSpacingValue('md'),
  gap: getSpacingValue('sm')
}}>

// ❌ Avoid mixed approaches
<div style={{
  padding: '1rem',
  margin: '16px',
  gap: '8px'
}}>
```

---

## 🧪 Testing

### **Component Testing**
```typescript
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from '../game/ScoreBoard';

test('ScoreBoard renders with theme integration', () => {
  render(<ScoreBoard ourScore={3} theirScore={2} timer={0} isRunning={false} />);
  
  expect(screen.getByText('3')).toHaveStyle({
    color: 'var(--team-our-primary)'
  });
});
```

### **Theme Integration Testing**
```typescript
import { renderHook } from '@testing-library/react';
import { useTheme } from '../useTheme';

test('useTheme returns correct theme values', () => {
  const { result } = renderHook(() => useTheme());
  
  expect(result.current.colors.primary).toBe('#FF1493');
  expect(result.current.spacing.md).toBe('1rem');
});
```

---

## 📞 Support

### **Getting Help**
- **Component Documentation**: This comprehensive guide
- **Theme System Documentation**: Complete theme system guide
- **Code Examples**: Component library examples
- **Best Practices**: Development guidelines

### **Contributing**
- **Component Updates**: Use theme system consistently
- **Documentation**: Keep component documentation updated
- **Testing**: Maintain test coverage for components
- **Examples**: Provide usage examples

---

*Component documentation library maintained with comprehensive usage examples, theme integration patterns, and best practices for all refactored components.*
