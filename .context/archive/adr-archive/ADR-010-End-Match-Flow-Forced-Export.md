# ADR-010: End Match Flow - Forced Export Decision

## Status
Proposed

## Context
Currently, when users finish a match, they can optionally copy or export data via header buttons, but many users forget to export their match data. This leads to:
- Lost data when browser storage is cleared
- No backup for important match statistics
- Inconsistent data export habits among users
- Users having to manually remember to export after every match

The current flow in both `ActiveGame.jsx` and `ActiveGamePro.jsx` provides copy and CSV buttons in the header, but they're optional and easily missed during the excitement of finishing a match.

## Decision
Implement a **forced export decision modal** that appears immediately after a user clicks "Finish" on a match. The modal will require users to make an explicit choice about their data before proceeding.

### Modal Design
- **Blocking modal** that prevents navigation until decision is made
- **Three clear options**: Copy Summary, Download CSV, or Skip (with warning)
- **Preview of match summary** shown in modal
- **Auto-select copy** as default for quick workflow
- **One-tap actions** for mobile optimization

### User Flow
1. User clicks "End" → "Finish?" confirmation
2. **NEW**: Export Decision Modal appears
3. User must choose:
   - **Copy Summary** (default, highlighted)
   - **Download CSV** 
   - **Skip Export** (with "Data may be lost" warning)
4. Only after selection can user proceed to home screen

### Technical Implementation
- New component: `ExportDecisionModal`
- Integration with existing `handleFinish` functions
- Enhanced `copySummary` function with better formatting
- Improved `downloadCSV` with additional metadata
- State management for export preferences

## Consequences
- ✅ **100% export awareness** - users can't forget to export
- ✅ **Consistent data backup** habits formed
- ✅ **Better data recovery** options for users
- ✅ **Professional workflow** for serious tracking
- ⚠️ **Additional friction** in match completion flow
- ⚠️ **More modal interactions** to manage
- ⚠️ **Mobile screen real estate** considerations

## Implementation Details

### Component Structure
```jsx
// New modal component
<ExportDecisionModal
  isOpen={showExportModal}
  gameData={{ opponentName, myScore, opponentScore, events }}
  onCopy={handleCopyAndFinish}
  onDownload={handleDownloadAndFinish}
  onSkip={handleSkipAndFinish}
  defaultAction="copy"
/>
```

### Enhanced Export Features
- **Rich copy format** with better structure
- **CSV with metadata** (date, weather, location if available)
- **Export preference memory** (remembers user's preferred export method)
- **Batch export option** for multiple games (future)

### Mobile Optimization
- **Large touch targets** (44px minimum)
- **Thumb-friendly button placement**
- **Haptic feedback** for export actions
- **Visual confirmation** with success animations

## Success Metrics
- **Export rate**: Target 95% of completed matches exported
- **User satisfaction**: Reduced complaints about lost data
- **Workflow efficiency**: Time from finish to export < 3 seconds
- **Adoption rate**: Users choosing preferred export method consistently

## Implementation Priority
**Priority**: HIGH
**Effort**: 12 hours
**Dependencies**: None (can be implemented independently)
**Timeline**: Phase 1 of V2 utility features

## Testing Requirements
- **Modal blocking behavior** - cannot bypass without decision
- **Export functionality** - all three options work correctly
- **Mobile usability** - one-handed operation testing
- **Accessibility** - screen reader compatibility
- **Performance** - no lag in match completion flow

---

*This ADR addresses the critical data loss issue by making export a mandatory part of the match completion workflow, ensuring users always have a backup of their important match statistics.*
