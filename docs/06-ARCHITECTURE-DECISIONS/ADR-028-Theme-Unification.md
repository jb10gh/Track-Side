# ADR-028: Theme Unification

## Status
**Medium** - Design System Priority

## Context
The application has inconsistent theming across different pages - some pages have rich colors and styling while others appear basic. This creates a disjointed user experience and undermines the professional appearance of the app.

## Problem
- Inconsistent color schemes across pages
- Some pages look basic while others are styled
- Lack of unified design language
- Poor visual cohesion
- Inconsistent component styling
- Missing theme application in some areas

## Decision
Implement comprehensive theme unification across all pages and components using a systematic design system approach.

## Implementation Plan

### Phase 1: Theme Audit and Analysis
**Skills Applied**: `architecture`, `brainstorming`, `core-components`

1. **Current State Assessment**
   - Audit all pages for theme consistency
   - Identify missing theme applications
   - Document color usage patterns
   - Analyze component styling gaps

2. **Theme Inventory**
   ```javascript
   // Theme audit results
   const themeAudit = {
     consistentPages: ['ActiveGame', 'Home'],
     inconsistentPages: ['MatchHistory', 'Settings', 'About'],
     missingThemes: ['backgrounds', 'borders', 'text colors'],
     componentGaps: ['cards', 'buttons', 'forms'],
     colorInconsistencies: [
       'primary colors vary by page',
       'background colors inconsistent',
       'text colors not unified',
       'border colors missing in some areas'
     ]
   };
   ```

### Phase 2: Enhanced Theme System
**Skills Applied**: `core-components`, `clean-code`, `architecture`

1. **Comprehensive Theme Variables**
   ```css
   /* Enhanced theme system - Complete coverage */
   :root {
     /* ===== CORE BRAND COLORS ===== */
     --color-brand: #E91E63;
     --color-brand-light: #F48FB1;
     --color-brand-dark: #C2185B;
     --color-brand-accent: #FF007F;
     
     /* ===== TEAM COLORS ===== */
     --team-our-primary: #E91E63;
     --team-our-light: #F48FB1;
     --team-our-dark: #C2185B;
     --team-our-bg: rgba(233, 30, 99, 0.1);
     --team-our-border: rgba(233, 30, 99, 0.3);
     --team-our-text: #E91E63;
     
     --team-opponent-primary: #9C27B0;
     --team-opponent-light: #BA68C8;
     --team-opponent-dark: #7B1FA2;
     --team-opponent-bg: rgba(156, 39, 176, 0.1);
     --team-opponent-border: rgba(156, 39, 176, 0.3);
     --team-opponent-text: #9C27B0;
     
     /* ===== SEMANTIC COLORS ===== */
     --color-success: #4CAF50;
     --color-warning: #FF9800;
     --color-error: #F44336;
     --color-info: #2196F3;
     
     /* ===== BACKGROUND SYSTEM ===== */
     --bg-primary: #0a0a0a;
     --bg-secondary: #1a1a1a;
     --bg-tertiary: #2a2a2a;
     --bg-surface: #1f1f1f;
     --bg-elevated: #2f2f2f;
     --bg-overlay: rgba(0, 0, 0, 0.8);
     --bg-modal: rgba(10, 10, 10, 0.95);
     
     /* ===== TEXT SYSTEM ===== */
     --text-primary: #ffffff;
     --text-secondary: #b0b0b0;
     --text-tertiary: #808080;
     --text-muted: #606060;
     --text-inverse: #000000;
     --text-placeholder: #666666;
     
     /* ===== BORDER SYSTEM ===== */
     --border-primary: #333333;
     --border-secondary: #444444;
     --border-tertiary: #555555;
     --border-light: rgba(255, 255, 255, 0.1);
     --border-medium: rgba(255, 255, 255, 0.2);
     --border-heavy: rgba(255, 255, 255, 0.3);
     
     /* ===== SHADOW SYSTEM ===== */
     --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
     --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
     --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
     --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
     
     /* ===== GLOW SYSTEM ===== */
     --glow-brand: 0 0 20px rgba(233, 30, 99, 0.3);
     --glow-success: 0 0 20px rgba(76, 175, 80, 0.3);
     --glow-warning: 0 0 20px rgba(255, 152, 0, 0.3);
     --glow-error: 0 0 20px rgba(244, 67, 54, 0.3);
     
     /* ===== SPACING SYSTEM ===== */
     --spacing-xs: 0.25rem;   /* 4px */
     --spacing-sm: 0.5rem;    /* 8px */
     --spacing-md: 1rem;      /* 16px */
     --spacing-lg: 1.5rem;    /* 24px */
     --spacing-xl: 2rem;      /* 32px */
     --spacing-2xl: 3rem;     /* 48px */
     --spacing-3xl: 4rem;     /* 64px */
     
     /* ===== RADIUS SYSTEM ===== */
     --radius-sm: 0.25rem;    /* 4px */
     --radius-md: 0.5rem;     /* 8px */
     --radius-lg: 0.75rem;    /* 12px */
     --radius-xl: 1rem;       /* 16px */
     --radius-2xl: 1.5rem;    /* 24px */
     --radius-full: 9999px;
     
     /* ===== TYPOGRAPHY SYSTEM ===== */
     --font-family-primary: 'Inter', system-ui, sans-serif;
     --font-family-mono: 'JetBrains Mono', monospace;
     
     --font-size-xs: 0.75rem;    /* 12px */
     --font-size-sm: 0.875rem;   /* 14px */
     --font-size-base: 1rem;     /* 16px */
     --font-size-lg: 1.125rem;   /* 18px */
     --font-size-xl: 1.25rem;    /* 20px */
     --font-size-2xl: 1.5rem;    /* 24px */
     --font-size-3xl: 1.875rem;  /* 30px */
     --font-size-4xl: 2.25rem;   /* 36px */
     
     --font-weight-light: 300;
     --font-weight-normal: 400;
     --font-weight-medium: 500;
     --font-weight-semibold: 600;
     --font-weight-bold: 700;
     --font-weight-black: 900;
     
     --line-height-tight: 1.25;
     --line-height-normal: 1.5;
     --line-height-relaxed: 1.75;
     
     /* ===== TRANSITION SYSTEM ===== */
     --transition-fast: 150ms ease;
     --transition-normal: 200ms ease;
     --transition-slow: 300ms ease;
     --transition-slower: 500ms ease;
     
     /* ===== Z-INDEX SYSTEM ===== */
     --z-dropdown: 1000;
     --z-sticky: 1020;
     --z-fixed: 1030;
     --z-modal-backdrop: 1040;
     --z-modal: 1050;
     --z-popover: 1060;
     --z-tooltip: 1070;
     --z-toast: 1080;
   }
   ```

### Phase 3: Component Theme Integration
**Skills Applied**: `core-components`, `clean-code`, `frontend-dev`

1. **Base Component Themes**
   ```css
   /* Base component themes */
   body {
     background-color: var(--bg-primary);
     color: var(--text-primary);
     font-family: var(--font-family-primary);
     line-height: var(--line-height-normal);
   }
   
   /* Card component theme */
   .card {
     background-color: var(--bg-surface);
     border: 1px solid var(--border-primary);
     border-radius: var(--radius-lg);
     box-shadow: var(--shadow-md);
     transition: var(--transition-normal);
   }
   
   .card:hover {
     border-color: var(--border-secondary);
     box-shadow: var(--shadow-lg);
   }
   
   /* Button component themes */
   .btn {
     border-radius: var(--radius-md);
     font-weight: var(--font-weight-semibold);
     transition: var(--transition-normal);
     cursor: pointer;
     display: inline-flex;
     align-items: center;
     justify-content: center;
     gap: var(--spacing-sm);
   }
   
   .btn:focus {
     outline: 2px solid var(--color-brand);
     outline-offset: 2px;
   }
   
   /* Form component themes */
   .input {
     background-color: var(--bg-secondary);
     border: 1px solid var(--border-primary);
     border-radius: var(--radius-md);
     color: var(--text-primary);
     font-size: var(--font-size-base);
     padding: var(--spacing-sm) var(--spacing-md);
     transition: var(--transition-normal);
   }
   
   .input:focus {
     border-color: var(--color-brand);
     box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
   }
   
   .input::placeholder {
     color: var(--text-placeholder);
   }
   ```

2. **Page-Specific Theme Applications**
   ```css
   /* Home page theme */
   .home-page {
     background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
     min-height: 100vh;
   }
   
   .home-section {
     background-color: var(--bg-surface);
     border: 1px solid var(--border-primary);
     border-radius: var(--radius-xl);
     padding: var(--spacing-xl);
     margin-bottom: var(--spacing-lg);
   }
   
   /* Match history page theme */
   .match-history-page {
     background-color: var(--bg-primary);
     min-height: 100vh;
   }
   
   .match-history-header {
     background-color: var(--bg-surface);
     border-bottom: 1px solid var(--border-primary);
     padding: var(--spacing-lg);
     margin-bottom: var(--spacing-lg);
   }
   
   .match-list {
     display: grid;
     gap: var(--spacing-md);
   }
   
   .match-card {
     background-color: var(--bg-surface);
     border: 1px solid var(--border-primary);
     border-radius: var(--radius-lg);
     padding: var(--spacing-lg);
     transition: var(--transition-normal);
   }
   
   .match-card:hover {
     border-color: var(--border-secondary);
     transform: translateY(-2px);
     box-shadow: var(--shadow-lg);
   }
   
   /* Settings page theme */
   .settings-page {
     background-color: var(--bg-primary);
     min-height: 100vh;
   }
   
   .settings-section {
     background-color: var(--bg-surface);
     border: 1px solid var(--border-primary);
     border-radius: var(--radius-lg);
     padding: var(--spacing-xl);
     margin-bottom: var(--spacing-lg);
   }
   
   .settings-item {
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: var(--spacing-md) 0;
     border-bottom: 1px solid var(--border-primary);
   }
   
   .settings-item:last-child {
     border-bottom: none;
   }
   ```

### Phase 4: Layout Consistency
**Skills Applied**: `architecture`, `frontend-dev`, `clean-code`

1. **Unified Layout System**
   ```css
   /* Layout system */
   .container {
     max-width: 1200px;
     margin: 0 auto;
     padding: 0 var(--spacing-lg);
   }
   
   .page {
     min-height: 100vh;
     background-color: var(--bg-primary);
   }
   
   .page-header {
     background-color: var(--bg-surface);
     border-bottom: 1px solid var(--border-primary);
     padding: var(--spacing-xl) 0;
     margin-bottom: var(--spacing-xl);
   }
   
   .page-content {
     padding-bottom: var(--spacing-3xl);
   }
   
   .section {
     margin-bottom: var(--spacing-2xl);
   }
   
   .section-header {
     margin-bottom: var(--spacing-lg);
   }
   
   .section-title {
     font-size: var(--font-size-2xl);
     font-weight: var(--font-weight-bold);
     color: var(--text-primary);
     margin-bottom: var(--spacing-sm);
   }
   
   .section-subtitle {
     font-size: var(--font-size-base);
     color: var(--text-secondary);
   }
   
   /* Grid system */
   .grid {
     display: grid;
     gap: var(--spacing-lg);
   }
   
   .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
   .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
   .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
   .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
   
   /* Flex utilities */
   .flex { display: flex; }
   .flex-col { flex-direction: column; }
   .items-center { align-items: center; }
   .justify-center { justify-content: center; }
   .justify-between { justify-content: space-between; }
   .gap-sm { gap: var(--spacing-sm); }
   .gap-md { gap: var(--spacing-md); }
   .gap-lg { gap: var(--spacing-lg); }
   ```

### Phase 5: Responsive Theme Consistency
**Skills Applied**: `frontend-dev`, `core-components`

1. **Mobile-First Responsive Themes**
   ```css
   /* Responsive theme adjustments */
   @media (max-width: 768px) {
     .container {
       padding: 0 var(--spacing-md);
     }
     
     .page-header {
       padding: var(--spacing-lg) 0;
     }
     
     .section {
       margin-bottom: var(--spacing-xl);
     }
     
     .card {
       padding: var(--spacing-lg);
       border-radius: var(--radius-md);
     }
     
     .btn {
       padding: var(--spacing-sm) var(--spacing-md);
       font-size: var(--font-size-sm);
     }
   }
   
   @media (max-width: 480px) {
     .container {
       padding: 0 var(--spacing-sm);
     }
     
     .page-header {
       padding: var(--spacing-md) 0;
     }
     
     .section {
       margin-bottom: var(--spacing-lg);
     }
     
     .card {
       padding: var(--spacing-md);
       border-radius: var(--radius-sm);
     }
     
     .grid-cols-2 { grid-template-columns: 1fr; }
     .grid-cols-3 { grid-template-columns: 1fr; }
     .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
   }
   ```

### Phase 6: Theme Validation and Testing
**Skills Applied**: `agent-evaluation`, `browser-automation`

1. **Theme Consistency Tests**
   ```javascript
   // Theme validation tests
   describe('Theme Consistency', () => {
     test('should apply consistent colors across pages', () => {
       const pages = ['Home', 'ActiveGame', 'MatchHistory', 'Settings'];
       const expectedColors = {
         background: 'rgb(10, 10, 10)',
         text: 'rgb(255, 255, 255)',
         primary: 'rgb(233, 30, 99)'
       };
       
       pages.forEach(page => {
         const { container } = render(<page />);
         
         // Check background color
         expect(container).toHaveStyle({
           backgroundColor: expectedColors.background
         });
         
         // Check text color
         const textElements = container.querySelectorAll('h1, h2, h3, p');
         textElements.forEach(el => {
           expect(el).toHaveStyle({
             color: expect.stringContaining('255')
           });
         });
       });
     });
     
     test('should have consistent component styling', () => {
       const components = ['Button', 'Card', 'Input'];
       
       components.forEach(component => {
         const { container } = render(<component />);
         
         // Check consistent border radius
         expect(container.firstChild).toHaveStyle({
           borderRadius: expect.stringContaining('px')
         });
         
         // Check consistent transitions
         expect(container.firstChild).toHaveStyle({
           transition: expect.stringContaining('ms')
         });
       });
     });
   });
   ```

## Technical Specifications

### Theme Structure
```
theme/
├── core.css              # Core theme variables
├── components.css        # Component themes
├── layouts.css          # Layout themes
├── pages.css            # Page-specific themes
├── responsive.css       # Responsive themes
└── utilities.css        # Theme utilities
```

### Color System
- **Brand Colors**: Primary, secondary, accent variants
- **Team Colors**: Our team, opponent team
- **Semantic Colors**: Success, warning, error, info
- **Neutral Colors**: Backgrounds, text, borders

### Component Coverage
- **All Buttons**: Consistent styling and states
- **All Cards**: Unified appearance and interactions
- **All Forms**: Consistent input styling
- **All Pages**: Unified background and layout

## Testing Requirements

### Visual Tests
- Color consistency across pages
- Component styling consistency
- Responsive design validation
- Theme application completeness

### Functional Tests
- Theme switching works
- Component interactions work
- Responsive behavior works
- Performance is maintained

### User Experience Tests
- Visual cohesion
- Professional appearance
- Accessibility compliance
- Cross-browser compatibility

## Success Metrics

### Visual Requirements
- ✅ Consistent color scheme across all pages
- ✅ Unified component styling
- ✅ Professional appearance maintained
- ✅ Responsive design works

### Technical Requirements
- ✅ Complete theme coverage
- ✅ Efficient CSS organization
- ✅ Maintainable theme system
- ✅ Performance optimized

### User Experience Requirements
- ✅ Seamless visual experience
- ✅ Professional appearance
- ✅ Accessible design
- ✅ Cross-device consistency

## Risk Assessment

### Technical Risks
- **CSS Conflicts**: Clear organization and specificity
- **Performance**: Optimized CSS and minimal redundancy
- **Maintenance**: Clear documentation and structure
- **Browser Compatibility**: Comprehensive testing

### User Experience Risks
- **Visual Inconsistency**: Comprehensive testing and validation
- **Accessibility**: WCAG compliance and testing
- **Performance**: Optimized loading and rendering

## Implementation Timeline

### Day 1: Foundation
- Morning: Theme system architecture
- Afternoon: Core theme variables and base styles

### Day 2: Components
- Morning: Component theme integration
- Afternoon: Layout and page themes

### Day 3: Polish
- Morning: Responsive themes and testing
- Afternoon: Validation and optimization

## Dependencies

### Required Components
- Enhanced theme system
- Component theme integration
- Layout consistency
- Responsive design

### External Dependencies
- CSS custom properties
- Modern CSS features
- Browser compatibility
- Testing framework

## Alternatives Considered

### Option 1: Minimal Theme Updates
- **Pros**: Quick implementation
- **Cons**: Incomplete coverage
- **Rejected**: Doesn't solve core issues

### Option 2: Complete Theme Overhaul
- **Pros**: Comprehensive solution
- **Cons**: High implementation cost
- **Rejected**: Over-engineered for current needs

### Option 3: Systematic Theme Unification (Chosen)
- **Pros**: Complete coverage, maintainable
- **Cons**: Requires careful implementation
- **Accepted**: Best long-term solution

## Conclusion

This ADR addresses the theme inconsistency issues across the application by implementing a comprehensive, systematic theme unification approach. The solution ensures consistent visual appearance across all pages while maintaining professional design and user experience standards.

**Status**: Ready for implementation
**Priority**: Medium
**Expected Timeline**: 2-3 days
**Success Criteria**: All pages have consistent theming with unified colors, components, and layouts while maintaining professional appearance and performance.
