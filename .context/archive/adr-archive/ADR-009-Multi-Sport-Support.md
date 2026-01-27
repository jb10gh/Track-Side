# ADR-009: Multi-Sport Support Architecture

## Status
Accepted

## Context
Current app is soccer-specific. Market expansion requires support for basketball, volleyball, hockey, and other sports with different rules and scoring systems.

## Decision
Implement flexible multi-sport architecture:

### Sport Configurations
- Pluggable sport definition system
- Custom event types per sport
- Sport-specific scoring rules
- Variable game durations

### Custom Events
- Sport-appropriate event types
- Dynamic event creation
- Sport-specific metadata
- Custom validation rules

### Rule Adaptation
- Different scoring systems
- Sport-specific timer logic
- Custom penalty systems
- Variable substitution rules

### UI Adaptation
- Sport-appropriate interfaces
- Dynamic component rendering
- Sport-specific visual themes
- Adaptive gesture patterns

## Consequences
- ✅ Market expansion capability
- ✅ Flexible architecture
- ✅ Future sport additions
- ⚠️ Increased complexity
- ⚠️ More extensive testing required

## Implementation
Priority: LOW
Effort: 28 hours
Dependencies: Analytics complete
