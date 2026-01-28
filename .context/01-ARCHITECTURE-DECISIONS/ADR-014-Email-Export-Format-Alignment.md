# ADR-014: Email Export Format Alignment

## Status
ACCEPTED

## Context
The email export functionality doesn't match the beautiful copy format that users love. The copy format has perfect emoji usage, clean formatting, and professional presentation, but email export uses a different, less appealing format.

## Decision
Update the email export to exactly match the copy format by:
- Removing '>' characters from email template
- Matching the exact emoji usage and layout
- Using the same timeline formatting
- Ensuring consistent professional presentation across all export methods

## Consequences
- **Positive**: Consistent beautiful formatting, improved user satisfaction
- **Negative**: Requires updating email service templates
- **Neutral**: Builds on existing copy format success

## Implementation Plan
1. Analyze current copy format in `export.js`
2. Update `nativeEmailService.generateConciseEmailContent()`
3. Remove '>' characters from email templates
4. Match exact emoji and formatting structure
5. Test email client rendering
6. Ensure all export methods use consistent formatting

## Related Components
- `nativeEmailService.js` (update email content generation)
- `export.js` (reference copy format)
- `SimplifiedExport.jsx` (email workflow)
- Email client compatibility testing
