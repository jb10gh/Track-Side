# ADR-026: Rebrand Header Layout

## Status
**Medium** - UX Enhancement Priority

## Context
The current header layout shows "Track Side Analytics vs Opponent" which doesn't reflect the actual "Us vs Opponent" game perspective. The branding needs to be repositioned while maintaining app identity and improving information hierarchy.

## Problem
- Header shows "Track Side Analytics vs Opponent" instead of "Us vs Opponent"
- Branding competes with game information
- Timer and opponent name not always visible
- Top right buttons look misaligned after unified button system
- Information hierarchy needs improvement

## Decision
Redesign header layout to separate branding from game information while improving visual hierarchy and button alignment.

## Implementation Plan

### Phase 1: Layout Analysis and Design
**Skills Applied**: `brainstorming`, `core-components`, `architecture`

1. **Current Layout Analysis**
   - Examine ConsolidatedGameHeader component
   - Analyze information hierarchy
   - Review button alignment issues
   - Identify branding placement opportunities

2. **New Layout Design**
   ```jsx
   // New header layout structure
   const NewGameHeader = ({ opponentName, ourScore, opponentScore, timerState, displayTime }) => {
     return (
       <header className="game-header">
         {/* Top Bar - Branding and Actions */}
         <div className="header-top">
           <div className="branding">
             <TrackSideLogo />
             <span className="app-name">Track Side Analytics</span>
           </div>
           
           <div className="header-actions">
             <TimerDisplay time={displayTime} state={timerState} />
             <ActionButtons />
           </div>
         </div>
         
         {/* Game Information - Clear "Us vs Opponent" */}
         <div className="game-info">
           <div className="match-title">
             <span className="our-team">Us</span>
             <span className="vs-separator">vs</span>
             <span className="opponent">{opponentName}</span>
           </div>
           
           <ScoreDisplay 
             ourScore={ourScore} 
             opponentScore={opponentScore}
             opponentName={opponentName}
           />
         </div>
       </header>
     );
   };
   ```

### Phase 2: Component Implementation
**Skills Applied**: `frontend-dev`, `clean-code`, `core-components`

1. **Enhanced Header Component**
   ```jsx
   // Completely redesigned header
   const EnhancedGameHeader = ({ opponentName, ourScore, opponentScore, timerState, displayTime }) => {
     return (
       <div className="enhanced-game-header">
         {/* Branding Bar */}
         <div className="branding-bar">
           <div className="brand-section">
             <div className="logo-container">
               <TrackSideLogo size={24} />
             </div>
             <div className="brand-text">
               <h1 className="app-title">Track Side</h1>
               <span className="app-subtitle">Analytics</span>
             </div>
           </div>
           
           <div className="utility-section">
             <TimerDisplay 
               time={displayTime} 
               state={timerState}
               className="header-timer"
             />
             <HeaderActions />
           </div>
         </div>
         
         {/* Game Match Display */}
         <div className="match-display">
           <div className="match-header">
             <div className="teams-display">
               <div className="team our-team">
                 <span className="team-label">Our Team</span>
                 <span className="team-score">{ourScore}</span>
               </div>
               
               <div className="vs-divider">
                 <span className="vs-text">vs</span>
               </div>
               
               <div className="team opponent-team">
                 <span className="team-label">{opponentName}</span>
                 <span className="team-score">{opponentScore}</span>
               </div>
             </div>
           </div>
         </div>
       </div>
     );
   };
   ```

2. **Timer Display Component**
   ```jsx
   // Dedicated timer display for header
   const TimerDisplay = ({ time, state, className = '' }) => {
     const stateConfig = {
       NOT_STARTED: { color: 'gray', label: 'Ready' },
       RUNNING: { color: 'green', label: 'Live' },
       PAUSED: { color: 'yellow', label: 'Paused' },
       FINISHED: { color: 'blue', label: 'Finished' }
     };
     
     const config = stateConfig[state.status];
     
     return (
       <div className={`timer-display ${className} timer-${config.color}`}>
         <div className="timer-indicator">
           <div className={`status-dot status-${config.color}`} />
           <span className="status-label">{config.label}</span>
         </div>
         <div className="timer-time">
           <span className="time-value">{time}</span>
         </div>
       </div>
     );
   };
   ```

3. **Enhanced Score Display**
   ```jsx
   // Improved score display with team emphasis
   const ScoreDisplay = ({ ourScore, opponentScore, opponentName }) => {
     return (
       <div className="score-display">
         <div className="score-section our-score-section">
           <div className="score-header">
             <span className="team-name">Our Team</span>
           </div>
           <div className="score-value our-score">
             {ourScore}
           </div>
         </div>
         
         <div className="score-divider">
           <span className="divider-text">:</span>
         </div>
         
         <div className="score-section opponent-score-section">
           <div className="score-header">
             <span className="team-name">{opponentName}</span>
           </div>
           <div className="score-value opponent-score">
             {opponentScore}
           </div>
         </div>
       </div>
     );
   };
   ```

### Phase 3: Styling and Theme Integration
**Skills Applied**: `core-components`, `clean-code`, `frontend-dev`

1. **Header CSS Architecture**
   ```css
   /* Enhanced header styling */
   .enhanced-game-header {
     @apply w-full bg-[var(--bg-surface)] border-b border-[var(--border-primary)];
   }
   
   .branding-bar {
     @apply flex items-center justify-between px-6 py-3 border-b border-[var(--border-secondary)];
   }
   
   .brand-section {
     @apply flex items-center gap-3;
   }
   
   .brand-text {
     @apply flex flex-col;
   }
   
   .app-title {
     @apply text-lg font-black text-[var(--text-primary)] leading-tight;
   }
   
   .app-subtitle {
     @apply text-xs font-medium text-[var(--text-secondary)] leading-tight;
   }
   
   .utility-section {
     @apply flex items-center gap-4;
   }
   
   .match-display {
     @apply px-6 py-4;
   }
   
   .teams-display {
     @apply flex items-center justify-center gap-8;
   }
   
   .team {
     @apply text-center;
   }
   
   .team-label {
     @apply text-sm font-medium text-[var(--text-secondary)] block mb-1;
   }
   
   .team-score {
     @apply text-4xl font-black leading-tight;
   }
   
   .our-score {
     @apply text-[var(--team-our-primary)];
   }
   
   .opponent-score {
     @apply text-[var(--team-opponent-primary)];
   }
   
   .vs-divider {
     @apply flex flex-col items-center justify-center;
   }
   
   .vs-text {
     @apply text-2xl font-bold text-[var(--text-secondary)] uppercase tracking-wider;
   }
   ```

2. **Timer Display Styling**
   ```css
   .timer-display {
     @apply flex items-center gap-3 px-3 py-2 rounded-lg border border-[var(--border-primary)];
   }
   
   .timer-indicator {
     @apply flex items-center gap-2;
   }
   
   .status-dot {
     @apply w-2 h-2 rounded-full;
   }
   
   .status-green { @apply bg-green-500; }
   .status-yellow { @apply bg-yellow-500; }
   .status-gray { @apply bg-gray-500; }
   .status-blue { @apply bg-blue-500; }
   
   .timer-time {
     @apply font-mono text-sm font-medium;
   }
   ```

### Phase 4: Button Alignment Fix
**Skills Applied**: `core-components`, `clean-code`

1. **Fixed Header Actions**
   ```jsx
   // Properly aligned header actions
   const HeaderActions = () => {
     const { copied, setCopied, confirmingFinish, setConfirmingFinish } = useGameStore();
     
     return (
       <div className="header-actions">
         <div className="action-group">
           <IconButton 
             variant="ghost" 
             size="sm"
             onClick={handleCopy}
             className="action-button"
           >
             {copied ? <ClipboardCheck size={16} /> : <Share2 size={16} />}
           </IconButton>
           
           <IconButton 
             variant="ghost" 
             size="sm"
             onClick={handleCSV}
             className="action-button"
           >
             <FileDown size={16} />
           </IconButton>
         </div>
         
         <div className="end-game-section">
           {!confirmingFinish ? (
             <Button 
               variant="danger" 
               size="sm"
               onClick={() => setConfirmingFinish(true)}
               className="end-game-btn"
             >
               End
             </Button>
           ) : (
             <div className="confirmation-group">
               <Button 
                 variant="ghost" 
                 size="sm"
                 onClick={() => setConfirmingFinish(false)}
               >
                 Cancel
               </Button>
               <Button 
                 variant="primary" 
                 size="sm"
                 onClick={handleFinish}
               >
                 Confirm
               </Button>
             </div>
           )}
         </div>
       </div>
     );
   };
   ```

2. **Button Alignment CSS**
   ```css
   .header-actions {
     @apply flex items-center gap-3;
   }
   
   .action-group {
     @apply flex items-center gap-2;
   }
   
   .action-button {
     @apply w-8 h-8 flex items-center justify-center;
   }
   
   .end-game-section {
     @apply flex items-center;
   }
   
   .confirmation-group {
     @apply flex items-center gap-2;
   }
   ```

### Phase 5: Responsive Design
**Skills Applied**: `frontend-dev`, `core-components`

1. **Mobile-First Responsive Design**
   ```css
   /* Responsive header design */
   @media (max-width: 768px) {
     .branding-bar {
       @apply px-4 py-2;
     }
     
     .brand-text .app-title {
       @apply text-base;
     }
     
     .brand-text .app-subtitle {
       @apply text-xs;
     }
     
     .teams-display {
       @apply gap-4;
     }
     
     .team-score {
       @apply text-3xl;
     }
     
     .vs-text {
       @apply text-xl;
     }
     
     .timer-display {
       @apply hidden; /* Hide timer on mobile, show in game area */
     }
   }
   
   @media (max-width: 480px) {
     .teams-display {
       @apply gap-2;
     }
     
     .team-score {
       @apply text-2xl;
     }
     
     .vs-text {
       @apply text-lg;
     }
     
     .action-group {
       @apply gap-1;
     }
   }
   ```

## Technical Specifications

### Component Structure
```
components/header/
├── EnhancedGameHeader.jsx    # Main header component
├── TimerDisplay.jsx          # Timer display component
├── ScoreDisplay.jsx          # Score display component
├── HeaderActions.jsx         # Action buttons component
└── index.js                  # Component exports
```

### Layout Architecture
```
EnhancedGameHeader
├── BrandingBar
│   ├── BrandSection (Logo + App Name)
│   └── UtilitySection (Timer + Actions)
└── MatchDisplay
    └── TeamsDisplay
        ├── OurTeamSection
        ├── VsDivider
        └── OpponentTeamSection
```

### Responsive Breakpoints
- **Desktop**: Full header with all elements
- **Tablet**: Compact branding, full game info
- **Mobile**: Minimal branding, essential info only

## Testing Requirements

### Functional Tests
- Header renders correctly
- Branding displays properly
- Score display works
- Timer shows correct state
- Buttons align properly

### Responsive Tests
- Mobile layout works
- Tablet layout works
- Desktop layout works
- Breakpoints trigger correctly

### User Experience Tests
- Clear information hierarchy
- Intuitive navigation
- Accessible design
- Smooth animations

## Success Metrics

### Functional Requirements
- ✅ Header shows "Us vs Opponent" clearly
- ✅ Branding separated from game info
- ✅ Timer always visible
- ✅ Buttons properly aligned
- ✅ Responsive design works

### User Experience Requirements
- ✅ Clear visual hierarchy
- ✅ Professional appearance
- ✅ Mobile-friendly
- ✅ Accessible design

### Performance Requirements
- ✅ Fast rendering
- ✅ Smooth animations
- ✅ Efficient state updates
- ✅ Minimal re-renders

## Risk Assessment

### Technical Risks
- **Layout Conflicts**: Clear CSS architecture and testing
- **Responsive Issues**: Comprehensive testing across devices
- **State Management**: Proper component isolation
- **Performance**: Optimized rendering and updates

### User Experience Risks
- **Information Overload**: Clear hierarchy and spacing
- **Navigation Confusion**: Intuitive layout and labeling
- **Mobile Usability**: Responsive design and testing

## Implementation Timeline

### Day 1: Foundation
- Morning: Header component architecture
- Afternoon: Basic layout and branding

### Day 2: Enhancement
- Morning: Score display and timer integration
- Afternoon: Button alignment and styling

### Day 3: Polish
- Morning: Responsive design and testing
- Afternoon: Final adjustments and optimization

## Dependencies

### Required Components
- Enhanced header components
- Timer display system
- Score display components
- Unified button system

### External Dependencies
- React state management
- CSS custom properties
- Responsive design utilities
- Animation library

## Alternatives Considered

### Option 1: Minimal Header Changes
- **Pros**: Quick implementation
- **Cons**: Doesn't solve core issues
- **Rejected**: Insufficient improvement

### Option 2: Complete Header Redesign
- **Pros**: Comprehensive solution
- **Cons**: High implementation cost
- **Rejected**: Over-engineered for current needs

### Option 3: Strategic Header Restructure (Chosen)
- **Pros**: Solves core issues, maintains familiarity
- **Cons**: Requires careful implementation
- **Accepted**: Best balance of improvement and effort

## Conclusion

This ADR addresses the header layout issues by separating branding from game information while improving visual hierarchy and button alignment. The new design clearly shows "Us vs Opponent" while maintaining the Track Side Analytics branding in a non-intrusive way. The solution is responsive, accessible, and maintains professional appearance.

**Status**: Ready for implementation
**Priority**: Medium
**Expected Timeline**: 2-3 days
**Success Criteria**: Header clearly shows game information with proper branding separation and aligned buttons across all devices.
