# ADR-011: Games Page Header Consolidation

## Status
ACCEPTED

## Context
The games page currently has redundant header information displaying the same opponent name in multiple places:
1. Shell title (`vs ${opponentName}`)
2. TrackSideHeader component with title and subtitle
3. Enhanced opponent header with VS label and opponent name

This creates visual noise and confusion for users, particularly parents who need clear, simple interfaces.

## Decision
Consolidate all header information into a single, clean header component that:
- Maintains the current scoreboard aesthetics
- Removes redundancy while preserving essential information
- Uses the existing TrackSide branding appropriately
- Keeps the opponent name prominent but not repetitive

## Consequences
- **Positive**: Cleaner UI, reduced cognitive load, better mobile experience
- **Negative**: Need to refactor existing header components
- **Neutral**: Maintains current visual design patterns

## Implementation Plan
1. Create new `ConsolidatedGameHeader` component
2. Remove redundant opponent header section
3. Update Shell title to be minimal
4. Preserve TrackSide branding in appropriate location
5. Test responsive behavior

## Related Components
- `TrackSideHeader` (modify)
- `Shell` component (minimal title change)
- Opponent header section (remove)
- ScoreBoard component (preserve aesthetics)
