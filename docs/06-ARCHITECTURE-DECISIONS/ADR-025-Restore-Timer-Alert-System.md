# ADR-025: Restore Timer Alert System

## Status
**Critical** - High Priority Fix Required

## Context
The alert system that warned users when triggering events before the timer has started has been removed. This was an important UX feature that prevented confusion and ensured proper game flow.

## Problem
- No warning when adding events before timer starts
- Users can create events with invalid timing
- Game flow confusion without proper alerts
- Missing user guidance for timer usage
- Potential data integrity issues with premature events

## Decision
Restore and enhance the timer alert system using behavioral-modes and user-experience design principles.

## Implementation Plan

### Phase 1: Alert System Analysis
**Skills Applied**: `brainstorming`, `behavioral-modes`, `analytics-tracking`

1. **Current State Investigation**
   - Examine existing timer state management
   - Check event creation flow
   - Identify where alerts were removed
   - Analyze user interaction patterns

2. **Behavioral Mode Design**
   ```javascript
   // Timer behavioral modes
   const TIMER_MODES = {
     NOT_STARTED: {
       alerts: ['timer_not_started'],
       allowedActions: ['start_timer'],
       blockedActions: ['add_events'],
       message: 'Start the timer before adding events'
     },
     RUNNING: {
       alerts: [],
       allowedActions: ['add_events', 'pause_timer'],
       blockedActions: [],
       message: ''
     },
     PAUSED: {
       alerts: ['timer_paused'],
       allowedActions: ['add_events', 'resume_timer'],
       blockedActions: [],
       message: 'Timer is paused - events will be marked at current time'
     },
     FINISHED: {
       alerts: ['timer_finished'],
       allowedActions: [],
       blockedActions: ['add_events'],
       message: 'Game is finished - no more events can be added'
     }
   };
   ```

### Phase 2: Alert Component System
**Skills Applied**: `core-components`, `frontend-dev`, `clean-code`

1. **Alert Component Architecture**
   ```jsx
   // Unified Alert System
   const AlertSystem = ({ timerState, onAction }) => {
     const [alerts, setAlerts] = useState([]);
     const currentMode = TIMER_MODES[timerState.status];
     
     useEffect(() => {
       if (currentMode.alerts.length > 0) {
         setAlerts(currentMode.alerts.map(alertType => ({
           type: alertType,
           message: getAlertMessage(alertType, timerState),
           severity: getAlertSeverity(alertType),
           actions: getAlertActions(alertType, onAction)
         })));
       } else {
         setAlerts([]);
       }
     }, [timerState.status, onAction]);
     
     return (
       <div className="alert-system">
         {alerts.map((alert, index) => (
           <Alert
             key={`${alert.type}-${index}`}
             type={alert.type}
             severity={alert.severity}
             message={alert.message}
             actions={alert.actions}
             onDismiss={() => dismissAlert(alert.type)}
           />
         ))}
       </div>
     );
   };
   ```

2. **Alert Component Implementation**
   ```jsx
   // Individual Alert Component
   const Alert = ({ type, severity, message, actions, onDismiss }) => {
     const alertStyles = {
       warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-100',
       error: 'bg-red-500/20 border-red-500 text-red-100',
       info: 'bg-blue-500/20 border-blue-500 text-blue-100',
       success: 'bg-green-500/20 border-green-500 text-green-100'
     };
     
     return (
       <div className={`alert alert-${severity} ${alertStyles[severity]} border rounded-lg p-4 mb-4 animate-slide-in`}>
         <div className="flex items-start gap-3">
           <AlertIcon type={type} severity={severity} />
           <div className="flex-1">
             <p className="font-medium">{message}</p>
             {actions && actions.length > 0 && (
               <div className="flex gap-2 mt-3">
                 {actions.map((action, index) => (
                   <Button
                     key={index}
                     variant={action.variant || 'secondary'}
                     size="sm"
                     onClick={action.handler}
                   >
                     {action.label}
                   </Button>
                 ))}
               </div>
             )}
           </div>
           <button onClick={onDismiss} className="text-current/60 hover:text-current">
             <X size={16} />
           </button>
         </div>
       </div>
     );
   };
   ```

### Phase 3: Integration with Event Creation
**Skills Applied**: `frontend-dev`, `clean-code`, `architecture`

1. **Event Creation Guard**
   ```jsx
   // Enhanced ActionGrid with timer guards
   const ActionGrid = ({ onAction, timerState }) => {
     const currentMode = TIMER_MODES[timerState.status];
     
     const handleAction = (actionType, team) => {
       // Check if action is allowed
       if (currentMode.blockedActions.includes('add_events')) {
         // Show alert instead of executing action
         showTimerAlert(currentMode.message, 'warning');
         return;
       }
       
       // Execute action if allowed
       onAction(actionType, team);
     };
     
     return (
       <div className="action-grid">
         <AlertSystem timerState={timerState} onAction={handleAction} />
         
         <div className="grid grid-cols-2 gap-4">
           {ACTIONS.map(action => (
             <ActionButton
               key={action.type}
               action={action}
               disabled={currentMode.blockedActions.includes('add_events')}
               onClick={() => handleAction(action.type, action.team)}
               tooltip={getActionTooltip(action, currentMode)}
             />
           ))}
         </div>
       </div>
     );
   };
   ```

2. **Timer State Integration**
   ```javascript
   // Enhanced gameStore with alert integration
   const useGameStore = create((set, get) => ({
     // ... existing state
     
     // Enhanced timer state with alerts
     timerState: {
       status: 'NOT_STARTED',
       startTime: null,
       elapsedTime: 0,
       alerts: []
     },
     
     // Enhanced action method with validation
     addEventWithValidation: (type, team, label, meta) => {
       const state = get();
       const currentMode = TIMER_MODES[state.timerState.status];
       
       if (currentMode.blockedActions.includes('add_events')) {
         // Trigger alert instead of adding event
         state.triggerAlert(currentMode.message, 'warning');
         return false;
       }
       
       // Add event if allowed
       state.addEvent(type, team, label, meta);
       return true;
     },
     
     // Alert management
     triggerAlert: (message, severity = 'info', actions = []) => {
       set((state) => ({
         timerState: {
           ...state.timerState,
           alerts: [...state.timerState.alerts, {
             id: Date.now(),
             message,
             severity,
             actions,
             timestamp: Date.now()
           }]
         }
       }));
     },
     
     clearAlerts: () => {
       set((state) => ({
         timerState: {
           ...state.timerState,
           alerts: []
         }
       }));
     }
   }));
   ```

### Phase 4: User Experience Enhancement
**Skills Applied**: `user-experience`, `brainstorming`, `analytics-tracking`

1. **Smart Alert Timing**
   ```javascript
   // Contextual alert system
   const getAlertMessage = (alertType, context) => {
     const messages = {
       timer_not_started: {
         primary: "Start the timer before adding events",
         secondary: "This ensures accurate game timing",
         actions: [
           { label: "Start Timer", variant: "primary", handler: () => context.startTimer() }
         ]
       },
       timer_paused: {
         primary: "Timer is currently paused",
         secondary: "Events will be marked at the current time",
         actions: [
           { label: "Resume Timer", variant: "primary", handler: () => context.resumeTimer() },
           { label: "Add Anyway", variant: "secondary", handler: () => context.allowPausedEvents() }
         ]
       }
     };
     
     return messages[alertType] || { primary: "Unknown alert", secondary: "", actions: [] };
   };
   ```

2. **Visual Feedback System**
   ```jsx
   // Enhanced visual indicators
   const TimerStatusIndicator = ({ timerState }) => {
     const statusConfig = {
       NOT_STARTED: { color: 'gray', icon: Clock, label: 'Not Started' },
       RUNNING: { color: 'green', icon: Play, label: 'Running' },
       PAUSED: { color: 'yellow', icon: Pause, label: 'Paused' },
       FINISHED: { color: 'blue', icon: Check, label: 'Finished' }
     };
     
     const config = statusConfig[timerState.status];
     
     return (
       <div className={`timer-status status-${config.color.toLowerCase()}`}>
         <config.icon size={16} />
         <span className="text-xs font-medium">{config.label}</span>
       </div>
     );
   };
   ```

### Phase 5: Testing and Validation
**Skills Applied**: `agent-evaluation`, `browser-automation`

1. **Alert System Tests**
   ```javascript
   describe('Timer Alert System', () => {
     test('should show alert when adding event before timer starts', () => {
       const { getByText, getByRole } = render(
         <ActionGrid timerState={{ status: 'NOT_STARTED' }} />
       );
       
       const goalButton = getByRole('button', { name: /goal/i });
       fireEvent.click(goalButton);
       
       expect(getByText(/start the timer before adding events/i)).toBeInTheDocument();
       expect(getByRole('button', { name: /start timer/i })).toBeInTheDocument();
     });
     
     test('should allow events when timer is running', () => {
       const mockOnAction = jest.fn();
       const { getByRole } = render(
         <ActionGrid 
           timerState={{ status: 'RUNNING' }} 
           onAction={mockOnAction}
         />
       );
       
       const goalButton = getByRole('button', { name: /goal/i });
       fireEvent.click(goalButton);
       
       expect(mockOnAction).toHaveBeenCalledWith('goal', 'us');
     });
   });
   ```

## Technical Specifications

### Component Architecture
```
components/alerts/
├── AlertSystem.jsx      # Main alert container
├── Alert.jsx            # Individual alert component
├── AlertIcon.jsx        # Alert icons
└── index.js             # Component exports
```

### State Management
```javascript
// Enhanced timer state structure
{
  timerState: {
    status: 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'FINISHED',
    startTime: number | null,
    elapsedTime: number,
    alerts: Array<{
      id: number,
      message: string,
      severity: 'info' | 'warning' | 'error' | 'success',
      actions: Array<{
        label: string,
        variant: string,
        handler: Function
      }>,
      timestamp: number
    }>
  }
}
```

### Alert Types
- **timer_not_started**: Warning when events added before timer
- **timer_paused**: Info when timer is paused
- **timer_finished**: Error when trying to add events to finished game
- **event_validation**: Warning for invalid event data

## Testing Requirements

### Functional Tests
- Alerts show at appropriate times
- Alert actions work correctly
- Event blocking/enforcement works
- Timer state transitions work

### User Experience Tests
- Clear alert messaging
- Intuitive action buttons
- Smooth alert animations
- Proper alert dismissal

### Integration Tests
- Complete timer workflow
- Event creation with alerts
- State consistency
- Performance under rapid interactions

## Success Metrics

### Functional Requirements
- ✅ Alerts show before timer starts
- ✅ Events blocked when appropriate
- ✅ Alert actions work correctly
- ✅ Timer state properly managed

### User Experience Requirements
- ✅ Clear, helpful alert messages
- ✅ Intuitive action buttons
- ✅ Smooth animations
- ✅ Non-intrusive but effective

### Performance Requirements
- ✅ Fast alert rendering
- ✅ Minimal state updates
- ✅ Smooth animations
- ✅ Efficient event handling

## Risk Assessment

### Technical Risks
- **Alert Spam**: Proper alert management and dismissal
- **State Conflicts**: Clear state transitions and validation
- **Performance**: Optimized rendering and updates
- **User Confusion**: Clear messaging and intuitive actions

### User Experience Risks
- **Annoyance**: Smart alert timing and dismissal
- **Confusion**: Clear messaging and visual indicators
- **Blocking**: Appropriate alert severity and actions

## Implementation Timeline

### Day 1: Foundation
- Morning: Alert system architecture and components
- Afternoon: Timer state integration and basic alerts

### Day 2: Enhancement
- Morning: Advanced alert features and actions
- Afternoon: User experience improvements and visual feedback

### Day 3: Testing
- Morning: Comprehensive testing and validation
- Afternoon: Bug fixes and optimization

## Dependencies

### Required Components
- Alert system components
- Enhanced timer state management
- Event creation guards
- Visual status indicators

### External Dependencies
- React state management
- Timer functionality
- Event system
- Animation library

## Alternatives Considered

### Option 1: Simple Browser Alerts
- **Pros**: Quick implementation
- **Cons**: Poor UX, no customization
- **Rejected**: Inadequate for professional app

### Option 2: Toast Notifications
- **Pros**: Non-intrusive
- **Cons**: Easy to miss, limited actions
- **Rejected**: Insufficient for critical warnings

### Option 3: Rich Alert System (Chosen)
- **Pros**: Comprehensive, customizable, actionable
- **Cons**: More complex implementation
- **Accepted**: Best user experience and functionality

## Conclusion

This ADR restores and enhances the timer alert system that was previously removed. The implementation provides comprehensive user guidance with actionable alerts, ensuring proper game flow and preventing user confusion. The system is designed to be helpful without being intrusive, with smart timing and clear messaging.

**Status**: Ready for implementation
**Priority**: Critical
**Expected Timeline**: 2-3 days
**Success Criteria**: Users receive clear, helpful alerts when attempting invalid actions, with intuitive options to resolve issues.
