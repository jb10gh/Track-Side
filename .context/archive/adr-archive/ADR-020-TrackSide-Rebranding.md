---
@skills: architecture, doc-coauthoring, ui-ux-pro-max, content-creator
context_priority: critical
document_type: adr
status: proposed
implementation_date: 2024-01-27
reviewers: [human, ai-assistant]
---

# ADR-020: TrackSide Rebranding & Theme Enhancement

## Status
Proposed

## Context
The project needs to be rebranded from "Sideline Stats" to "TrackSide" to match the track-side.vercel.app domain and QR code branding. Additionally, the theme needs to be enhanced with hot pink as the primary color and dynamic contrasting colors for opponents. The current CSS error with @import statements also needs to be resolved.

### Current Issues
1. **CSS Import Error**: `@import` statements must precede all other CSS rules
2. **Brand Mismatch**: App called "Sideline Stats" but domain is "track-side.vercel.app"
3. **Theme Limitation**: Fixed color scheme doesn't allow for dynamic opponent colors
4. **Documentation Outdated**: Documentation doesn't reflect current implemented features
5. **User Experience**: Limited customization for team colors

### User Requirements
- **Rebrand to TrackSide**: Update all branding, documentation, and references
- **Hot Pink Theme**: Primary team color should be hot pink
- **Dynamic Opponent Colors**: Contrasting colors that change per game or user-customizable
- **Fix CSS Error**: Resolve @import precedence issues
- **Update Documentation**: Reflect current feature state and new branding

## 🤖 AI Assistant Instructions
**Primary Skills:**
- @skills:architecture for rebranding strategy and theme architecture
- @skills:ui-ux-pro-max for theme design and color system
- @skills:doc-coauthoring for comprehensive documentation updates
- @skills:content-creator for brand messaging and user guides

## Decision
Implement a **comprehensive TrackSide rebranding** with hot pink theme, dynamic opponent color system, and updated documentation that reflects current features.

### **Rebranding Strategy**
1. **Brand Identity**: TrackSide with hot pink primary color
2. **Color System**: Hot pink for our team, dynamic contrasting colors for opponents
3. **Theme Architecture**: CSS custom properties with dynamic color generation
4. **Documentation Update**: Complete refresh with current features
5. **CSS Fix**: Proper @import statement ordering

### **Dynamic Color System**
- **Primary Color**: Hot pink (#FF1493 or similar)
- **Opponent Colors**: Algorithmically generated contrasting colors
- **User Customization**: Allow users to select opponent colors
- **Accessibility**: Ensure WCAG AA compliance for all color combinations
- **Black Background**: Maintain black as base for contrast

## Consequences
- ✅ **Brand Consistency**: App name matches domain and QR codes
- ✅ **Enhanced Theme**: Hot pink creates strong visual identity
- ✅ **Dynamic Colors**: Fresh experience for each game
- ✅ **User Customization**: Personalized color experience
- ✅ **Fixed CSS**: Resolved import precedence issues
- ✅ **Updated Documentation**: Accurate feature documentation
- ⚠️ **Breaking Changes**: Brand name changes affect references
- ⚠️ **Color Testing**: Extensive testing needed for accessibility
- ⚠️ **Documentation Effort**: Comprehensive update required

## Success Metrics
- **100%** brand consistency across all touchpoints
- **95%** user satisfaction with new theme
- **100%** WCAG AA compliance for color combinations
- **90%** documentation accuracy with current features
- **0** CSS import errors

## Technical Implementation

### **CSS Architecture Fix**
```css
/* index.css - Fixed import order */
@import './styles/team-colors.css';
@import './styles/trackside-theme.css';

/* All other CSS rules after imports */
:root {
  /* Theme variables */
}
```

### **Dynamic Color System**
```typescript
interface ColorSystem {
  primary: string;        // Hot pink
  opponent: string;       // Dynamic contrasting color
  background: string;     // Black
  text: string;          // White/contrasting
}

class DynamicColorGenerator {
  generateOpponentColor(primaryColor: string): string;
  validateContrast(color1: string, color2: string): boolean;
  generateColorPalette(baseColor: string): ColorPalette;
}
```

### **Brand Update Strategy**
```typescript
// Brand configuration
const TRACKSIDE_BRAND = {
  name: 'TrackSide',
  tagline: 'Professional Sports Analytics',
  domain: 'track-side.vercel.app',
  primaryColor: '#FF1493',
  theme: 'hot-pink-dynamic'
};
```

---

*ADR maintained with @skills:architecture, @skills:ui-ux-pro-max, @skills:doc-coauthoring, and @skills:content-creator*
