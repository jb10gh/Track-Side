# ADR-024: Fix Edit Function After Game End

## Status
**Critical** - High Priority Fix Required

## Context
Users cannot edit events after ending a game. The edit functionality that should work on completed matches is broken, preventing users from correcting mistakes or updating event details post-game.

## Problem
- Edit function doesn't work after game completion
- Historical matches cannot be modified
- Users cannot correct post-game errors
- MatchDetailView edit functionality is non-functional
- Breaks expected workflow for game management

## Decision
Implement robust edit functionality for completed games using clean-code patterns and comprehensive testing.

## Implementation Plan

### Phase 1: Investigation and Analysis
**Skills Applied**: `architecture`, `brainstorming`, `agent-evaluation`

1. **Current State Analysis**
   - Examine MatchDetailView component functionality
   - Check event update handlers in gameStore
   - Test edit flow on completed games
   - Identify root cause of edit failure

2. **Architecture Review**
   - Analyze state management for completed games
   - Review event update mechanisms
   - Check navigation and routing for edit access
   - Evaluate data persistence for edited matches

### Phase 2: Component Enhancement
**Skills Applied**: `clean-code`, `core-components`, `frontend-dev`

1. **MatchDetailView Enhancement**
   ```jsx
   // Enhanced MatchDetailView with robust editing
   const MatchDetailView = ({ matchId, onClose }) => {
     const { updateHistoricalEvent, getMatchById } = useGameStore();
     const [editingEvent, setEditingEvent] = useState(null);
     const [isUpdating, setIsUpdating] = useState(false);
     
     const handleEventUpdate = async (eventId, updates) => {
       setIsUpdating(true);
       try {
         await updateHistoricalEvent(matchId, eventId, updates);
         setEditingEvent(null);
         // Show success feedback
       } catch (error) {
         // Handle error gracefully
         console.error('Failed to update event:', error);
       } finally {
         setIsUpdating(false);
       }
     };
     
     return (
       <div className="match-detail-view">
         {/* Enhanced match display with editing */}
         {match.events.map(event => (
           <EditableEventItem
             key={event.id}
             event={event}
             isEditing={editingEvent?.id === event.id}
             onUpdate={(updates) => handleEventUpdate(event.id, updates)}
             onEdit={() => setEditingEvent(event)}
             onCancel={() => setEditingEvent(null)}
           />
         ))}
       </div>
     );
   };
   ```

2. **Store Method Implementation**
   ```javascript
   // Enhanced gameStore with historical editing
   const updateHistoricalEvent = async (matchId, eventId, updates) => {
     set((state) => {
       const matchIndex = state.history.findIndex(m => m.id === matchId);
       if (matchIndex === -1) return state;
       
       const updatedHistory = [...state.history];
       const eventIndex = updatedHistory[matchIndex].events.findIndex(e => e.id === eventId);
       
       if (eventIndex !== -1) {
         updatedHistory[matchIndex].events[eventIndex] = {
           ...updatedHistory[matchIndex].events[eventIndex],
           ...updates,
           lastModified: Date.now()
         };
       }
       
       return { history: updatedHistory };
     });
     
     // Persist to storage
     await persistHistoricalMatches();
   };
   ```

### Phase 3: User Experience Enhancement
**Skills Applied**: `brainstorming`, `frontend-dev`, `core-components`

1. **Visual Feedback System**
   ```jsx
   // Enhanced EditableEventItem with better UX
   const EditableEventItem = ({ event, isEditing, onUpdate, onEdit, onCancel }) => {
     const [localUpdates, setLocalUpdates] = useState({});
     
     return (
       <div className={`event-item ${isEditing ? 'editing' : ''}`}>
         {!isEditing ? (
           <div onClick={onEdit} className="event-display">
             {/* Event content with edit indicator */}
             <div className="event-content">
               {/* Display event details */}
             </div>
             <button className="edit-indicator">
               <Edit2 size={14} />
             </button>
           </div>
         ) : (
           <div className="event-editor">
             {/* Edit form with save/cancel */}
             <EventEditForm
               event={event}
               updates={localUpdates}
               onChange={setLocalUpdates}
               onSave={() => onUpdate(localUpdates)}
               onCancel={onCancel}
             />
           </div>
         )}
       </div>
     );
   };
   ```

2. **Navigation Integration**
   ```jsx
   // Enhanced MatchCard with edit access
   const MatchCard = ({ match }) => {
     const navigate = useNavigate();
     
     const handleEditMatch = () => {
       navigate(`/match/${match.id}/edit`);
     };
     
     return (
       <div className="match-card">
         <div className="match-summary">
           {/* Match details */}
         </div>
         <div className="match-actions">
           <Button variant="ghost" size="sm" onClick={handleEditMatch}>
             <Edit2 size={16} />
             Edit Match
           </Button>
         </div>
       </div>
     );
   };
   ```

### Phase 4: Testing and Validation
**Skills Applied**: `agent-evaluation`, `browser-automation`

1. **Comprehensive Test Suite**
   ```javascript
   // Test suite for historical editing
   describe('Historical Match Editing', () => {
     test('should open edit view for completed match', () => {
       const match = createMockCompletedMatch();
       render(<MatchCard match={match} />);
       
       const editButton = screen.getByRole('button', { name: /edit match/i });
       fireEvent.click(editButton);
       
       expect(screen.getByTestId('match-detail-view')).toBeInTheDocument();
     });
     
     test('should update event in historical match', async () => {
       const match = createMockCompletedMatch();
       const { getByTestId, getByRole } = render(<MatchDetailView matchId={match.id} />);
       
       const editButton = getByTestId(`edit-event-${match.events[0].id}`);
       fireEvent.click(editButton);
       
       const labelInput = getByTestId('event-label-input');
       fireEvent.change(labelInput, { target: { value: 'Updated Goal' } });
       
       const saveButton = getByRole('button', { name: /save/i });
       fireEvent.click(saveButton);
       
       await waitFor(() => {
         expect(getByTestId('event-label')).toHaveTextContent('Updated Goal');
       });
     });
   });
   ```

2. **Integration Testing**
   - End-to-end edit workflow
   - Data persistence validation
   - State consistency checks
   - Error handling verification

## Technical Specifications

### Component Changes
- **MatchDetailView.jsx**: Enhanced with robust editing
- **EditableEventItem.jsx**: Improved UX and state management
- **MatchCard.jsx**: Better edit access and navigation
- **gameStore.js**: Historical editing methods

### State Management
```javascript
// Enhanced state structure for historical editing
{
  history: [
    {
      id: string,
      opponentName: string,
      myScore: number,
      opponentScore: number,
      events: [
        {
          id: string,
          type: string,
          team: string,
          label: string,
          gameTime: string,
          timestamp: number,
          lastModified: number, // Track edits
          editHistory: Array     // Track change history
        }
      ],
      lastModified: number
    }
  ]
}
```

### Navigation Structure
```
/home                    // Match list
/match/:id/edit          // Edit historical match
/match/:id               // View match details
```

## Testing Requirements

### Functional Tests
- Edit view opens correctly
- Event updates persist
- Navigation works properly
- Data integrity maintained

### User Experience Tests
- Smooth edit transitions
- Clear visual feedback
- Intuitive edit controls
- Error handling

### Integration Tests
- Complete edit workflow
- State persistence
- Cross-component consistency
- Performance validation

## Success Metrics

### Functional Requirements
- ✅ Edit function works on completed games
- ✅ Event updates persist correctly
- ✅ Navigation to edit view works
- ✅ Data integrity maintained

### User Experience Requirements
- ✅ Intuitive edit interface
- ✅ Clear visual feedback
- ✅ Smooth transitions
- ✅ Error recovery

### Performance Requirements
- ✅ Fast edit response time
- ✅ Efficient state updates
- ✅ Minimal re-renders
- ✅ Smooth animations

## Risk Assessment

### Technical Risks
- **State Corruption**: Robust validation and error handling
- **Data Loss**: Proper backup and recovery mechanisms
- **Performance**: Optimized updates and rendering
- **Navigation**: Clear routing and state management

### User Experience Risks
- **Confusion**: Clear edit indicators and instructions
- **Data Loss**: Confirmation dialogs and undo functionality
- **Performance**: Loading states and feedback

## Implementation Timeline

### Day 1: Investigation and Planning
- Morning: Current state analysis and architecture review
- Afternoon: Component enhancement planning

### Day 2: Core Implementation
- Morning: Store methods and component updates
- Afternoon: Navigation and UX enhancements

### Day 3: Testing and Polish
- Morning: Comprehensive testing and validation
- Afternoon: Bug fixes and optimization

## Dependencies

### Required Components
- MatchDetailView component
- EditableEventItem component
- Enhanced gameStore methods
- Navigation routing

### External Dependencies
- React state management
- Navigation library
- Storage persistence
- Testing framework

## Alternatives Considered

### Option 1: Simple Edit Modal
- **Pros**: Quick implementation
- **Cons**: Limited functionality
- **Rejected**: Insufficient for complex editing

### Option 2: Full Edit Page
- **Pros**: Comprehensive editing
- **Cons**: Complex navigation
- **Rejected**: Over-engineered for current needs

### Option 3: Enhanced Inline Editing (Chosen)
- **Pros**: Intuitive, efficient, user-friendly
- **Cons**: Requires careful implementation
- **Accepted**: Best balance of functionality and UX

## Conclusion

This ADR addresses the critical issue of non-functional edit capabilities for completed games. The implementation focuses on robust, user-friendly editing with comprehensive testing and error handling. The solution maintains data integrity while providing an intuitive editing experience.

**Status**: Ready for implementation
**Priority**: Critical
**Expected Timeline**: 2-3 days
**Success Criteria**: Users can successfully edit events in completed games with persistent changes and intuitive UX.
