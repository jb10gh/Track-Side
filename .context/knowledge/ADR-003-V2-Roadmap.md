# ADR-003: V2 Feature Roadmap (Pure Utility)

## Status
Proposed

## Context
After successfully launching V1 (Score, Timer, Events, Undo), we need to expand utility for more professional use cases:
1.  **Correction**: Users often hit the wrong name or button and need retroactive edits.
2.  **Roster Reusability**: Typing "Jordan #23" every match is slow.
3.  **Conditionals**: Sideline signal is unreliable; the app must be 100% offline.
4.  **Reporting**: Coaches need CSVs for seasonal spreadsheets.

## Decision
We will implement the following architectural extensions:
- **Service Worker integration** via `vite-plugin-pwa`.
- **Global Roster State**: A new slice in `gameStore.js` to remember player names.
- **Retroactive Mutation**: Enhance `gameStore.js` with `updateEvent` and `deleteMatch` actions.
- **CSV Transformer**: A utility to flatten the `events` nested array into a downloadable string.

## UI/UX Rules for V2
- **No Clutter**: All new features must be hidden behind secondary menus (e.g., long-press or settings dots) to keep the V1 "Action-First" speed for live tracking.
- **Monospace Consistency**: Any new data tables (attendance) must use Fira Code.

## Consequences
- Increased local storage payload (Roster).
- Need for the browser subagent to verify specific offline/download scenarios.
