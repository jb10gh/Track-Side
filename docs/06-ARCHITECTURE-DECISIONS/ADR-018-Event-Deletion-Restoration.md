# ADR-018: Event Deletion Restoration

## Status
**Critical** - Core Feature Regression

## Context
Users can no longer delete individual events from the live scores area at the bottom of the app. This represents a regression of core functionality that was previously working, impacting data accuracy and user control.

## Problem
- Delete functionality missing from event items
- No way to correct mistakes during live scoring
- Data integrity issues
- User frustration with inability to edit
- Breaks expected app behavior

## Decision
Restore event deletion functionality with improved UX, confirmation dialogs, and comprehensive testing.

## Implementation Plan

### Phase 1: Investigation and Analysis
1. **Current State Assessment**
   - Examine event item components
   - Check for deleted delete buttons
   - Verify event deletion handlers
   - Review recent changes

2. **Previous Implementation Review**
   - Find original delete functionality
   - Analyze why it was removed/broken
   - Identify best practices from original code
   - Plan restoration approach

### Phase 2: Component Restoration
1. **Delete Button Implementation**
   ```jsx
   // Add delete button to event items
   const EventItem = ({ event, onDelete, onEdit }) => {
     return (
       <div className="event-item">
         {/* Event content */}
         <div className="event-actions">
           <button 
             onClick={() => onDelete(event.id)}
             className="delete-btn"
             aria-label="Delete event"
           >
             <Trash2 size={16} />
           </button>
         </div>
       </div>
     );
   };
   ```

2. **Confirmation Dialog**
   ```jsx
   // Confirmation modal for deletion
   const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, eventName }) => {
     return (
       <Modal isOpen={isOpen}>
         <h3>Delete Event?</h3>
         <p>Are you sure you want to delete "{eventName}"?</p>
         <p>This action cannot be undone.</p>
         <div className="modal-actions">
           <button onClick={onCancel}>Cancel</button>
           <button onClick={onConfirm} className="danger">Delete</button>
         </div>
       </Modal>
     );
   };
   ```

### Phase 3: State Management Integration
1. **Store Method Updates**
   ```javascript
   // Add to gameStore.js
   const deleteEvent = (eventId) => {
     setEvents(prev => prev.filter(event => event.id !== eventId));
     // Update scores if needed
     recalculateScores();
   };
   ```

2. **Score Recalculation**
   - Update team scores after deletion
   - Adjust game statistics
   - Maintain data consistency
   - Trigger UI updates

### Phase 4: UX Enhancements
1. **Visual Feedback**
   - Hover states for delete button
   - Loading states during deletion
   - Success/error notifications
   - Smooth animations

2. **Accessibility**
   - Keyboard navigation support
   - Screen reader compatibility
   - High contrast visibility
   - Touch-friendly targets

### Phase 5: Testing Integration
1. **Unit Tests**
   ```javascript
   describe('Event Deletion', () => {
     test('should show delete button for events', () => {
       // Test delete button visibility
     });
     
     test('should show confirmation dialog', () => {
       // Test confirmation modal
     });
     
     test('should delete event when confirmed', () => {
       // Test actual deletion
     });
     
     test('should not delete when cancelled', () => {
       // Test cancellation
     });
   });
   ```

2. **Integration Tests**
   - Complete deletion flow
   - Score recalculation
   - State persistence
   - Error handling

## Technical Specifications

### Component Changes
- **EventItem.jsx**: Add delete button and handlers
- **DeleteConfirmationModal.jsx**: New confirmation component
- **gameStore.js**: Add deleteEvent method
- **ActiveGame.jsx**: Integrate deletion flow

### State Management
```javascript
// Event deletion flow
const handleDeleteEvent = (eventId) => {
  const event = events.find(e => e.id === eventId);
  if (event) {
    setShowDeleteConfirmation(true);
    setSelectedEvent(event);
  }
};

const confirmDelete = () => {
  if (selectedEvent) {
    deleteEvent(selectedEvent.id);
    setShowDeleteConfirmation(false);
    setSelectedEvent(null);
  }
};
```

### Styling Requirements
```css
/* Delete button styles */
.delete-btn {
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
  cursor: pointer;
  transition: var(--transition-fast);
}

.delete-btn:hover {
  background: var(--color-danger-dark);
  transform: scale(1.1);
}
```

## Testing Requirements

### Functional Tests
- Delete button visibility and functionality
- Confirmation modal behavior
- Event removal from list
- Score recalculation accuracy

### User Experience Tests
- Visual feedback during deletion
- Confirmation flow clarity
- Error handling and recovery
- Accessibility compliance

### Performance Tests
- Deletion response time
- UI update smoothness
- State change efficiency
- Memory usage optimization

## Success Metrics

### Functional Requirements
- ✅ Delete button visible on all events
- ✅ Confirmation dialog appears before deletion
- ✅ Event removed when confirmed
- ✅ Scores recalculated correctly
- ✅ No deletion when cancelled

### Performance Requirements
- <50ms response time for delete button
- <100ms for event removal
- Smooth animations and transitions
- No UI freezing or lag

### User Experience Requirements
- Clear visual indicators
- Intuitive confirmation flow
- Appropriate button sizing
- Consistent with app design

## Risk Assessment

### Technical Risks
- **State Corruption**: Implement proper state validation
- **Score Calculation Errors**: Add verification logic
- **UI Inconsistencies**: Follow design system
- **Performance Issues**: Optimize rendering

### User Experience Risks
- **Accidental Deletion**: Require explicit confirmation
- **Confusing Interface**: Clear visual design
- **Insufficient Feedback**: Add notifications and indicators

## Implementation Timeline

### Day 1: Investigation and Planning
- Morning: Current state analysis
- Afternoon: Component design and planning

### Day 2: Core Implementation
- Morning: Delete button and confirmation
- Afternoon: State management integration

### Day 3: Testing and Polish
- Morning: Testing and bug fixes
- Afternoon: UX improvements and deployment

## Dependencies

### Required Components
- Event item components
- Modal system
- State management store
- Score calculation logic

### External Dependencies
- React state management
- Icon library (Lucide React)
- CSS styling system
- Testing framework

## Alternatives Considered

### Option 1: Simple Delete Button
- **Pros**: Quick implementation
- **Cons**: No confirmation, risky
- **Rejected**: Too dangerous for users

### Option 2: Swipe to Delete (Mobile)
- **Pros**: Mobile-friendly
- **Cons**: Inconsistent with desktop
- **Rejected**: Platform inconsistency

### Option 3: Delete with Confirmation (Chosen)
- **Pros**: Safe, clear, consistent
- **Cons**: Requires extra click
- **Accepted**: Best user experience

## Conclusion

This ADR restores critical event deletion functionality that was previously working. The implementation focuses on user safety with confirmation dialogs while maintaining data integrity through proper state management and score recalculation. Comprehensive testing ensures the feature works reliably across all scenarios.

**Status**: Ready for implementation
**Priority**: Critical
**Expected Timeline**: 2-3 days
**Success Criteria**: Users can safely delete events with confirmation and proper score updates.
