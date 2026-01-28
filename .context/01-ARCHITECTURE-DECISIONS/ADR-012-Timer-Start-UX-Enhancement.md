# ADR-012: Timer Start UX Enhancement

## Status
ACCEPTED

## Context
The current timer functionality is not discoverable enough for parents, who are the primary users. The timer start mechanism is unclear and not prominently displayed in the scoreboard area, which is the main interaction zone.

## Decision
Add a prominent, clear "Start Timer" button/indicator in the scoreboard area that:
- Is visually obvious without being intrusive
- Uses appropriate contrast and sizing for parent users
- Maintains the current scoreboard design aesthetics
- Provides clear visual feedback when timer is running vs stopped

## Consequences
- **Positive**: Better discoverability, improved user experience for target audience
- **Negative**: Requires careful visual design to maintain aesthetics
- **Neutral**: Builds on existing timer infrastructure

## Implementation Plan
1. Analyze current ScoreBoard component structure
2. Design prominent timer start indicator
3. Implement visual states (running/stopped)
4. Add appropriate animations and feedback
5. Test with parent user scenarios
6. Ensure mobile responsiveness

## Related Components
- `ScoreBoard` component (primary modifications)
- `useGameTimer` hook (leverage existing)
- Timer state management (enhance visibility)
- Mobile responsive design considerations
