# ADR-014: Timer Invocation UX Enhancement

## Status
Proposed

## Context
The current game timer requires manual activation which is easily forgotten during the fast-paced environment of live sports tracking. Users often start recording events without starting the timer, leading to inaccurate game time data and compromised match analytics. This is a critical UX issue that affects the core value proposition of accurate sports metrics tracking.

### Current Problems
1. **Forgotten Timer**: Users frequently forget to start the timer when beginning a match
2. **No Visual Cues**: Timer state is not prominently displayed or emphasized
3. **Manual Process**: Timer activation requires conscious effort that's easily overlooked
4. **Data Accuracy**: Missing or incorrect timing undermines the entire tracking system
5. **User Training**: New users need to remember multiple steps to properly track a match

### User Impact
- **Inaccurate Metrics**: Game time data is unreliable
- **Poor Analytics**: Time-based analysis becomes meaningless
- **Coach Frustration**: Inconsistent data reduces trust in the system
- **User Error**: Manual process is prone to mistakes during high-pressure situations

## Decision
Implement **intelligent timer invocation** that automatically prompts and guides users to start the timer as part of the natural match flow, with multiple layers of reminders and visual cues.

### Timer Invocation Strategy

#### 1. Automatic Timer Invocation
- **Match Start Detection**: Auto-prompt timer when first event is recorded without active timer
- **Visual Timer State**: Prominent timer display with clear start/stop indicators
- **Smart Reminders**: Contextual prompts based on user actions

#### 2. Progressive Invocation System
```
Level 1: Visual Cue
├── Timer prominently displayed with "Start Timer" button
├── Pulsing animation to draw attention
└── Color-coded state (red = inactive, green = active)

Level 2: Action Prompt
├── Modal appears when first event is recorded without timer
├── Clear message: "Start timer to track game time?"
├── Quick start button with keyboard shortcut
└── Option to dismiss with understanding

Level 3: Persistent Reminder
├── Small banner reminder during match
├── Timer icon with notification badge
└── Gentle periodic reminders
```

#### 3. Timer State Visualization
- **Header Integration**: Timer status in main header
- **Color Coding**: Red (inactive) → Green (active) → Blue (paused)
- **Progress Indicators**: Visual feedback for timer state
- **Accessibility**: Clear labels and screen reader support

### Implementation Details

#### Component Enhancements
1. **Timer Status Component**: Dedicated timer display with state indicators
2. **Invocation Modal**: Smart prompt based on user actions
3. **Header Integration**: Timer prominence in main navigation
4. **Event Flow Integration**: Timer checks in event recording flow

#### User Flow Integration
```
New Match → Timer Status Check
├── Timer Active → Proceed normally
├── Timer Inactive → Show invocation prompt
│   ├── Start Timer → Begin match tracking
│   ├── Skip → Continue with warning
│   └── Remind Later → Set reminder
└── First Event → Auto-prompt if timer inactive
```

#### Smart Invocation Triggers
- **Match Creation**: Prompt timer when new match starts
- **First Event**: Auto-prompt when recording first event
- **Period Changes**: Remind at period transitions
- **Score Events**: Emphasize timer during important moments

## Consequences
- ✅ **Improved Data Accuracy**: Timer started consistently for all matches
- ✅ **Reduced User Error**: Automated prompts prevent forgotten steps
- ✅ **Better UX**: Natural flow integration without extra steps
- ✅ **Professional Output**: Consistent timing data for coaches
- ✅ **User Confidence**: Clear visual feedback improves trust
- ⚠️ **Additional UI**: More interface elements to manage
- ⚠️ **Complexity**: Multiple invocation layers increase code complexity
- ⚠️ **User Preference**: Some users may find prompts intrusive

## Success Metrics
- **Timer Activation Rate**: 95% of matches have timer started within first 2 events
- **Data Accuracy**: 90% reduction in missing timing data
- **User Satisfaction**: Improved feedback on data reliability
- **Coach Trust**: Increased confidence in submitted metrics

## Implementation Priority
**Priority**: HIGH
**Effort**: 16 hours
**Dependencies**: None (can be implemented independently)
**Timeline**: Phase 1 of Core UX Improvements

## Technical Requirements

### Component Architecture
```jsx
// Timer State Management
const TimerStatus = {
  INACTIVE: 'inactive',    // Red, pulsing
  ACTIVE: 'active',        // Green, steady
  PAUSED: 'paused',        // Blue, blinking
  WARNING: 'warning'       // Orange, attention
};

// Invocation Triggers
const InvocationTriggers = {
  MATCH_START: 'match_start',
  FIRST_EVENT: 'first_event',
  PERIOD_CHANGE: 'period_change',
  SCORE_EVENT: 'score_event'
};
```

### Store Extensions
```javascript
// Enhanced timer state
const timerState = {
  isActive: false,
  isPaused: false,
  startTime: null,
  elapsedTime: 0,
  invocationCount: 0,
  lastInvocationTrigger: null
};

// New actions
const timerActions = {
  invokeTimer: (trigger) => { /* implementation */ },
  startTimerWithConfirmation: () => { /* implementation */ },
  setInvocationReminder: (delay) => { /* implementation */ }
};
```

## Testing Requirements
- **Invocation Accuracy**: Timer prompts appear at correct triggers
- **User Flow**: Natural integration without disrupting tracking
- **Visual Clarity**: Timer state immediately understandable
- **Mobile Performance**: Smooth animations and responsive design
- **Accessibility**: Screen reader compatibility for timer state

## Future Enhancements
- **Voice Commands**: "Start timer" voice activation
- **Gesture Controls**: Shake to start timer
- **Auto-Detection**: GPS or motion-based match start detection
- **Team Integration**: Coach can remotely start timer
- **Analytics**: Timer invocation analytics and optimization

---

*This ADR addresses the critical UX issue of forgotten timers by implementing intelligent invocation that ensures accurate timing data while maintaining the app's speed and simplicity principles.*
