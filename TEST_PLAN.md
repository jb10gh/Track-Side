# Track Side App Comprehensive Test Plan

## Testing All Implemented ADRs

### ✅ ADR-011: Games Page Header Consolidation
- [ ] Verify single consolidated header displays opponent name
- [ ] Confirm no redundant information (Shell title, TrackSideHeader, opponent header)
- [ ] Check TrackSide branding is present but not repetitive
- [ ] Test responsive behavior on mobile

### ✅ ADR-012: Timer Start UX Enhancement  
- [ ] Verify prominent "Start Timer" button appears when timer is stopped
- [ ] Check visual feedback (status indicator, animations)
- [ ] Test timer functionality works correctly
- [ ] Confirm button disappears when timer is running

### ✅ ADR-013: Fix Edit Ended Games Bug
- [ ] Create a test game and finish it
- [ ] Navigate to match archive
- [ ] Click "Edit" button on completed game
- [ ] Verify MatchDetailView opens with editing capabilities
- [ ] Test editing an event (change player name)
- [ ] Confirm changes are saved and persist

### ✅ ADR-014: Email Export Format Alignment
- [ ] Complete a test game with multiple events
- [ ] Use email export functionality
- [ ] Verify email content matches copy format exactly
- [ ] Confirm no '>' characters in email body
- [ ] Check emoji usage and timeline formatting

### ✅ ADR-015: Export Menu Overhaul
- [ ] Test new streamlined export modal
- [ ] Verify email, copy, and CSV options work
- [ ] Check beautiful formatting integration
- [ ] Test mobile responsiveness of export modal
- [ ] Confirm proper error handling

### ✅ ADR-016: Dark Theme Refinement
- [ ] Verify muted color palette throughout app
- [ ] Check reduced contrast (soft grays vs pure black/white)
- [ ] Confirm subtle glows and shadows
- [ ] Test readability and accessibility
- [ ] Verify consistent theme application

## Cross-Functional Testing
- [ ] Complete full game workflow: start → play events → finish → export
- [ ] Test all export methods (email, copy, CSV) in one session
- [ ] Verify edit functionality after export
- [ ] Test responsive design on different screen sizes
- [ ] Check for console errors or warnings
