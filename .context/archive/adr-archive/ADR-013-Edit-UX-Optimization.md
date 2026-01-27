# ADR-013: Edit UX Optimization

## Status
Proposed

## Context
The current edit match flow has several UX issues that create confusion and redundant interactions:

### Current Issues
1. **Non-functional + Button**: The "+" button in MatchDetailView has no click handler
2. **Redundant Edit Buttons**: Both "Edit Match" and "Edit Match Info" buttons exist in close proximity
3. **Confusing Edit Modes**: Users don't understand the difference between editing metadata vs events
4. **Poor Visual Hierarchy**: Edit actions compete with primary navigation
5. **Inconsistent Patterns**: Edit behavior differs from standard app conventions

### User Flow Problems
- Users click "+" button expecting to add events but nothing happens
- Users hesitate between two edit buttons, unsure which to choose
- Edit mode activation is unclear - users don't know what they can edit
- No clear indication of edit state vs view state

## Decision
Implement a **unified editing system** with clear visual hierarchy and intuitive interactions:

### Edit Mode Redesign
1. **Single Edit Toggle**: One "Edit" button that enables all editing capabilities
2. **Contextual Actions**: Edit options appear inline where relevant
3. **Visual Feedback**: Clear edit state indication with consistent styling
4. **Progressive Disclosure**: Advanced options only show when in edit mode

### New Interaction Pattern
```
Match Detail View (View Mode)
├── Header: [← Back] [Title] [⋮ More Options]
├── Match Score: Display Only
├── Events List: Display Only
└── Footer: [Copy] [Export]

Match Detail View (Edit Mode)
├── Header: [← Back] [✓ Save] [✕ Cancel]
├── Match Score: [Editable Opponent Name]
├── Events List: [Edit/Delete each event] [+ Add Event]
└── Footer: [Copy] [Export]
```

### Button Consolidation
- **Remove "Edit Match Info"** button from header
- **Keep single "Edit Match"** toggle button
- **Move "+" button** to events section with proper handler
- **Add Save/Cancel** buttons that replace edit toggle

## Consequences
- ✅ **Clearer UX**: Single edit mode eliminates confusion
- ✅ **Functional + Button**: Users can actually add events
- ✅ **Better Visual Hierarchy**: Edit actions don't compete with navigation
- ✅ **Consistent Patterns**: Follows standard mobile app conventions
- ✅ **Reduced Cognitive Load**: Users understand what they can edit
- ⚠️ **Learning Curve**: Users need to adapt to new edit flow
- ⚠️ **More Code Complexity**: Unified edit state management
- ⚠️ **Design Changes**: Visual updates needed for edit state

## Implementation Details

### Component Restructuring
1. **Edit State Management**: Single `isEditing` state controls all edit capabilities
2. **Conditional Rendering**: Show edit controls only when `isEditing` is true
3. **Header Actions**: Dynamic header based on edit state
4. **Inline Editing**: Edit controls appear directly on editable elements
5. **Save/Cancel Flow**: Proper state management for edit completion

### New Header Design
```jsx
// View Mode Header
<div className="flex items-center justify-between">
  <BackButton />
  <Title />
  <MoreOptionsButton /> {/* Copy, Export, Delete */}
</div>

// Edit Mode Header  
<div className="flex items-center justify-between">
  <CancelButton />
  <EditIndicator />
  <SaveButton />
</div>
```

### Event Management
1. **Add Event Modal**: Reuse existing GameModal for new events
2. **Inline Event Editing**: Enhanced EditableEventItem component
3. **Batch Operations**: Select multiple events for bulk actions
4. **Event Validation**: Ensure score consistency when editing

### Mobile Optimization
- **Thumb-Friendly Targets**: All edit controls meet 44px minimum
- **Clear Visual States**: Obvious difference between edit/view modes
- **Gesture Support**: Swipe actions for quick edit/delete
- **Keyboard Optimization**: Proper focus management for form inputs

## Success Metrics
- **Task Success Rate**: 95% of users successfully add/edit events on first try
- **Time to Complete**: Average edit task completion < 10 seconds
- **Error Reduction**: 80% fewer accidental edit mode activations
- **User Satisfaction**: Improved feedback on edit flow clarity

## Implementation Priority
**Priority**: HIGH
**Effort**: 12 hours
**Dependencies**: ADR-012 (Duration Display) completion
**Timeline**: Phase 2 of UX improvements

## Testing Requirements
- **+ Button Functionality**: Verify add event modal opens correctly
- **Edit Mode Toggle**: Test state transitions between view/edit modes
- **Save/Cancel Flow**: Ensure proper state management
- **Mobile Usability**: Test edit flow on actual mobile devices
- **Accessibility**: Screen reader compatibility for edit state changes

## Future Enhancements
- **Gesture Editing**: Swipe to edit/delete events
- **Keyboard Shortcuts**: Quick edit mode activation
- **Bulk Operations**: Select multiple events for batch editing
- **Edit History**: Undo/redo functionality for changes
- **Collaborative Editing**: Multiple user edit support

---

*This ADR transforms the confusing edit experience into a unified, intuitive system that follows established mobile app patterns and provides clear visual feedback for all edit operations.*
