---
@skills: architecture, doc-coauthoring, ui-ux-pro-max
context_priority: critical
document_type: adr
status: proposed
implementation_date: 2024-01-27
reviewers: [human, ai-assistant]
---

# ADR-018: Match Screen Flow Enhancement

## Status
Proposed

## Context
Currently, the match screen appears immediately when users click "Begin Tracking" (game mode), which creates confusion and doesn't align with the intended user flow. Users should be taken directly to the active game interface, with the match summary/export screen appearing only at the end of the match. Additionally, the export process needs to be streamlined to automatically create emails with relevant data.

### Current Issues
1. **Premature Match Screen**: Export screen appears at game start instead of end
2. **Manual Export Process**: Users must manually configure email exports
3. **Incomplete ADR Implementation**: Previous ADRs may not be fully implemented
4. **User Experience Friction**: Extra steps reduce adoption and compliance

### User Requirements
- **Direct Game Entry**: Click "Begin Tracking" → Start game immediately
- **End-Match Export**: Automatic email creation when game ends
- **Streamlined Process**: One-click export with pre-filled content
- **Complete Implementation**: All ADRs properly implemented

## 🤖 AI Assistant Instructions
**Primary Skills:**
- @skills:architecture for user flow and system design decisions
- @skills:doc-coauthoring for structured ADR documentation
- @skills:ui-ux-pro-max for user experience optimization

## Decision
Implement a **streamlined match flow** that takes users directly to the active game interface and provides automatic email export at match end, with comprehensive ADR implementation validation.

### **Enhanced User Flow**
1. **Begin Tracking** → **Active Game Interface** (immediate)
2. **Track Events** → **Live Game Experience**
3. **End Match** → **Automatic Email Export** (one-click)
4. **Complete** → **Return to Home**

### **Automatic Email Export**
- **Pre-filled Subject**: Match summary with score and date
- **Formatted Body**: Complete match statistics and events
- **CSV Attachment**: Automatically attached data file
- **One-Click Send**: Open email client with all content ready

## Consequences
- ✅ **Better UX**: Direct game entry reduces friction
- ✅ **Higher Compliance**: Automatic export increases coach data submission
- ✅ **Complete Implementation**: All ADRs properly validated
- ✅ **Professional Experience**: Streamlined, professional workflow
- ⚠️ **Development Effort**: Requires significant refactoring
- ⚠️ **Email Client Dependency**: Relies on user's email client
- ⚠️ **Testing Required**: Comprehensive testing of new flow

## Success Metrics
- **95%** of users complete games without premature export screen
- **90%** of matches exported via automatic email
- **100%** of ADRs properly implemented and validated
- **80%** reduction in export completion time
- **95%** user satisfaction with new flow

## Technical Implementation

### **Component Flow Changes**
```typescript
// Current flow (broken)
Begin Tracking → Match Screen → Active Game → Export

// New flow (fixed)
Begin Tracking → Active Game → End Match → Auto Email Export
```

### **Email Enhancement**
```typescript
interface AutoEmailExport {
  subject: string;
  body: string;
  csvAttachment: File;
  recipient: string;
  preFilled: boolean;
}
```

---

*ADR maintained with @skills:architecture, @skills:doc-coauthoring, and @skills:ui-ux-pro-max*
