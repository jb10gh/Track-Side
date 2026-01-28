# ADR-013: Fix Edit Ended Games Bug

## Status
ACCEPTED

## Context
Users can no longer edit individual games after they've been ended, but this functionality was working previously. This is a regression that impacts the core value proposition of the app for tracking and correcting game data.

## Decision
Debug and restore the edit functionality for ended games by:
- Investigating the `updateEvent` function in gameStore
- Ensuring the GameModal works properly with completed games
- Adding regression tests to prevent future breaks
- Maintaining data integrity during edits

## Consequences
- **Positive**: Restores critical functionality, improves user trust
- **Negative**: Requires careful debugging and testing
- **Neutral**: Builds on existing edit infrastructure

## Implementation Plan
1. Debug the `updateEvent` function flow
2. Test GameModal with completed game states
3. Verify event editing preserves game integrity
4. Add unit tests for edit functionality
5. Add regression tests for future changes
6. Test edge cases (empty events, malformed data)

## Related Components
- `gameStore.js` (debug updateEvent function)
- `GameModal.jsx` (ensure proper editing state)
- `ActiveGame.jsx` (edit workflow)
- Event data integrity validation
- Test suite enhancement
