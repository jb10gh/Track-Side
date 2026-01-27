# ADR-011: Post-Match Inline Editing & Details

## Status
Proposed

## Context
Currently, users can edit events during a match via the `onEdit` callback in `EventTimeline` and `SwipeStream` components, but once a match is finished, the data becomes read-only in the match history. Users need the ability to:
- Correct typos in player names after the heat of the moment
- Add missing details to events (like penalty card types, substitution reasons)
- Edit match metadata (opponent name, final score corrections)
- Add post-match notes and observations
- Fix scoring errors discovered after match completion

The current `updateEvent` function exists in the store but is only accessible during active games. There's no interface for post-match editing.

## Decision
Implement a **comprehensive post-match editing system** that allows users to review and modify all aspects of completed matches through an intuitive inline interface.

### Post-Match Review Interface
- **Dedicated match detail view** accessible from match history
- **Inline editing** for all events with tap-to-edit functionality
- **Match metadata editing** (opponent name, date, location, notes)
- **Batch operations** (multiple event selection, bulk edits)
- **Change tracking** with edit history and timestamps

### Editing Capabilities
1. **Event Editing**
   - Player name corrections
   - Event type changes (goal ↔ penalty)
   - Time adjustments
   - Metadata additions (card colors, substitution types)
   - Event deletion with score recalculation

2. **Match Metadata**
   - Opponent name editing
   - Date/time corrections
   - Location and weather notes
   - Match result adjustments
   - Coach observations

3. **Advanced Features**
   - Undo/redo for all changes
   - Auto-save during editing
   - Change validation (score consistency checks)
   - Export after edits

### Technical Implementation
- Extend existing `updateEvent` and `deleteEvent` store functions
- New component: `MatchDetailView` with inline editing
- Enhanced store actions for historical match editing
- New state management for edit sessions
- Integration with existing export functionality

## Consequences
- ✅ **Complete data accuracy** control post-match
- ✅ **Professional workflow** for serious statisticians
- ✅ **Error correction** capabilities
- ✅ **Enhanced data quality** for exports
- ✅ **Coach notes** and observations integration
- ⚠️ **Increased complexity** in match management
- ⚠️ **Data integrity** considerations
- ⚠️ **Storage overhead** for edit history
- ⚠️ **UI complexity** in match history

## Implementation Details

### Component Architecture
```jsx
// New match detail view with editing capabilities
<MatchDetailView
  matchId={selectedMatchId}
  isEditing={isEditMode}
  onToggleEdit={setEditMode}
  onSaveChanges={handleSaveChanges}
  onExport={handleExport}
/>

// Enhanced event item with inline editing
<EditableEventItem
  event={event}
  isEditing={isEditMode}
  onUpdate={handleEventUpdate}
  onDelete={handleEventDelete}
/>
```

### Store Extensions
```javascript
// New store actions for historical match editing
updateHistoricalEvent: (matchId, eventId, updates) => { /* ... */ }
deleteHistoricalEvent: (matchId, eventId) => { /* ... */ }
updateMatchMetadata: (matchId, metadata) => { /* ... */ }
getEditHistory: (matchId) => { /* ... */ }
```

### Editing Interface Design
- **Tap-to-edit** on any event or metadata field
- **Inline forms** with validation
- **Contextual keyboards** (numeric for times, text for names)
- **Quick action menus** for common edits
- **Visual indicators** for edited items
- **Save/cancel** controls with auto-save

### Mobile Optimization
- **Large edit targets** for touch interaction
- **Swipe gestures** for quick edit/delete
- **Thumb-friendly form layouts**
- **Haptic feedback** for edit actions
- **Keyboard optimization** for different input types

## User Flow
1. User navigates to match history
2. Taps on completed match → **Match Detail View**
3. Taps "Edit" button → **Editing Mode**
4. Makes changes to events/metadata
5. System validates changes and recalculates scores
6. User saves changes or cancels
7. Updated match data available for export

### Edit Validation Rules
- **Score consistency** - goals must match final score
- **Time sequence** - events must be chronological
- **Event type validity** - maintain data integrity
- **Player name format** - consistent naming conventions
- **Metadata completeness** - required fields validation

## Success Metrics
- **Edit adoption rate**: % of matches edited post-completion
- **Data accuracy**: Reduction in export errors
- **User satisfaction**: Improved confidence in data quality
- **Workflow efficiency**: Time to complete common edits
- **Error reduction**: Fewer support requests for data fixes

## Implementation Priority
**Priority**: HIGH
**Effort**: 20 hours
**Dependencies**: ADR-010 (Export Decision) implementation
**Timeline**: Phase 2 of V2 utility features

## Testing Requirements
- **Edit functionality** - all edit operations work correctly
- **Data integrity** - score recalculation accuracy
- **Mobile usability** - touch editing workflow
- **Performance** - large match editing responsiveness
- **Accessibility** - screen reader editing support
- **Data validation** - edge case handling

## Future Enhancements
- **Collaborative editing** - multiple coach inputs
- **AI suggestions** - automatic error detection
- **Advanced analytics** - post-match insights
- **Video integration** - link events to video clips
- **Cloud sync** - edit synchronization across devices

---

*This ADR transforms the app from a simple tracking tool into a comprehensive match management system by giving users full control over their data even after matches are completed, ensuring professional-grade data accuracy and completeness.*
