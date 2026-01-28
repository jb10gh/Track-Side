# ADR-015: Export Menu Overhaul

## Status
ACCEPTED

## Context
The current export menu (ExportDecisionModal and related components) needs complete redesign. Users find it confusing and it doesn't leverage the beautiful formatting from the copy function effectively.

## Decision
Scrap the entire export menu system and rebuild with:
- Streamlined, intuitive export flow
- Better UX for email vs CSV options
- Integration of beautiful copy formatting
- Clear visual hierarchy and user guidance
- Mobile-optimized interface

## Consequences
- **Positive**: Much better user experience, consistent branding
- **Negative**: Complete rewrite of export components
- **Neutral**: Opportunity to fix existing UX issues

## Implementation Plan
1. Remove existing ExportDecisionModal and related components
2. Design new export flow architecture
3. Build new streamlined export modal
4. Integrate beautiful formatting from copy function
5. Implement clear email vs CSV choice UX
6. Add mobile-responsive design
7. Test all export scenarios thoroughly

## Related Components
- `ExportDecisionModal.jsx` (remove)
- `SimplifiedExport.jsx` (replace/modify)
- `EnhancedExportModal.jsx` (remove if exists)
- Export workflow architecture (redesign)
- Mobile responsive design patterns
