# ADR-012: Duration Display Enhancement

## Status
Proposed

## Context
The current duration display throughout the app shows time in a basic "minutes:seconds" format (e.g., "45:30") which is not logical for longer matches. The `formatTime` function only handles minutes and seconds, but sports matches often last for hours. Users are seeing confusing displays like "90:15" for what should be "1:30:15" (1 hour, 30 minutes, 15 seconds).

### Current Issues
1. **Inconsistent Time Format**: Shows "90:15" instead of "1:30:15" for matches over 60 minutes
2. **Poor Readability**: Long minute values are hard to parse mentally
3. **No Context**: Users can't quickly understand if a match lasted 1.5 hours or 90 minutes
4. **Export Problems**: CSV exports contain confusing duration data
5. **Mobile Display**: Long minute strings overflow on small screens

## Decision
Implement a **smart duration formatting system** that adapts based on the total duration length:

### Duration Formatting Rules
- **< 60 minutes**: Display as "MM:SS" (e.g., "45:30")
- **60-119 minutes**: Display as "1h MMm" (e.g., "1h 30m")
- **≥ 120 minutes**: Display as "Hh MMm" (e.g., "2h 15m")
- **Export Format**: Always use "HH:MM:SS" for consistency

### Smart Format Function
```javascript
const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours === 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else if (hours === 1) {
    return `1h ${minutes}m`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};
```

### Implementation Areas
1. **Game Store**: Replace `formatTime` with smart `formatDuration`
2. **Active Game Display**: Show appropriate format during play
3. **Match History**: Display readable durations in archive
4. **Export Functions**: Use consistent "HH:MM:SS" format
5. **Event Timeline**: Keep "MM:SS" for individual events (they won't exceed match duration)

## Consequences
- ✅ **Improved Readability**: Users can quickly understand match length
- ✅ **Mobile Friendly**: Shorter, more scannable format
- ✅ **Professional Exports**: Consistent time format in CSV files
- ✅ **Context Awareness**: Format adapts to duration length
- ⚠️ **Learning Curve**: Users need to adapt to new format
- ⚠️ **Code Changes**: Multiple components need updates
- ⚠️ **Data Migration**: Existing exports may need reformatting

## Implementation Details

### Component Updates
1. **Store Functions**: Update `formatTime` to `formatDuration`
2. **Display Components**: Update all time displays
3. **Export Functions**: Use separate export formatting
4. **Event Items**: Keep current format for game times
5. **Match Cards**: Show smart duration format

### Mobile Optimization
- **Compact Display**: "1h 30m" fits better on small screens
- **Quick Recognition**: Hour format is immediately understandable
- **Consistent Spacing**: Uniform width across different durations

### Export Enhancement
- **CSV Format**: Standard "HH:MM:SS" for data processing
- **Summary Format**: Human-readable "1h 30m 15s" for text exports
- **API Compatibility**: Maintain millisecond precision internally

## Success Metrics
- **User Understanding**: 90% of users correctly interpret duration at first glance
- **Mobile Usability**: Duration text fits without overflow on all screen sizes
- **Export Quality**: Professional, consistent time formatting in all exports
- **Performance**: No impact on timer performance or accuracy

## Implementation Priority
**Priority**: HIGH
**Effort**: 8 hours
**Dependencies**: None (can be implemented independently)
**Timeline**: Phase 1 of UX improvements

## Testing Requirements
- **Format Accuracy**: Test with various duration lengths (5min, 45min, 1h30m, 2h15m)
- **Mobile Display**: Verify text fits on smallest supported screens
- **Export Consistency**: Ensure CSV exports use correct format
- **Performance**: Timer updates remain smooth and accurate
- **Edge Cases**: Handle very long matches (3+ hours) gracefully

---

*This ADR addresses the fundamental usability issue of duration display by implementing a smart, context-aware formatting system that makes match lengths immediately understandable to users.*
