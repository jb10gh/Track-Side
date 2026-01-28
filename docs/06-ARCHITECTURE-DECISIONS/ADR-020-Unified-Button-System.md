# ADR-020: Unified Button System

## Status
**Medium** - Professional Design Enhancement

## Context
Button styles differ throughout the app, creating an inconsistent and unprofessional appearance. This undermines the overall design quality and user experience.

## Problem
- Inconsistent button styles across components
- Different hover states and animations
- Varying sizes and spacing
- Lack of design system cohesion
- Unprofessional appearance

## Decision
Create a unified button component system using design tokens and consistent patterns for professional appearance.

## Implementation Plan

### Phase 1: Design System Analysis
1. **Current Button Inventory**
   ```jsx
   // Examples of inconsistent buttons found:
   <button className="btn-ghost p-2 rounded-xl bg-[var(--bg-secondary)]">
   <button className="bg-gradient-to-r from-[#FF1493] to-[#FF007F]">
   <button onClick={() => setConfirmingFinish(true)} className="btn-ghost p-2 text-[var(--color-danger)]">
   <button className="bg-gradient-to-r from-[#FF1493] to-[#FF007F] hover:from-[#FF69B4] hover:to-[#FF1493]">
   ```

2. **Design Token Definition**
   ```css
   /* Button design tokens */
   --button-height-sm: 2rem;    /* 32px */
   --button-height-md: 2.5rem;   /* 40px */
   --button-height-lg: 3rem;    /* 48px */
   
   --button-padding-sm: 0.5rem 1rem;
   --button-padding-md: 0.75rem 1.5rem;
   --button-padding-lg: 1rem 2rem;
   
   --button-radius-sm: 0.375rem; /* 6px */
   --button-radius-md: 0.5rem;   /* 8px */
   --button-radius-lg: 0.75rem;  /* 12px */
   
   --button-font-size-sm: 0.875rem; /* 14px */
   --button-font-size-md: 1rem;     /* 16px */
   --button-font-size-lg: 1.125rem; /* 18px */
   
   --button-transition: all 0.2s ease;
   ```

### Phase 2: Unified Button Component
1. **Base Button Component**
   ```jsx
   // components/ui/Button.jsx
   import React from 'react';
   import { cn } from '../utils/cn';
   
   const buttonVariants = {
     variant: {
       primary: `
         bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-accent)]
         text-white
         hover:from-[var(--color-brand-light)] hover:to-[var(--color-brand)]
         active:from-[var(--color-brand-dark)] active:to-[var(--color-brand)]
         shadow-[var(--shadow-button)]
         hover:shadow-lg
         transform hover:scale-105
       `,
       secondary: `
         bg-[var(--btn-secondary-bg)]
         text-[var(--btn-secondary-text)]
         border-[var(--btn-secondary-border)]
         hover:bg-[var(--btn-secondary-hover)]
         active:bg-[var(--btn-secondary-active)]
       `,
       ghost: `
         bg-[var(--btn-ghost-bg)]
         text-[var(--btn-ghost-text)]
         hover:bg-[var(--btn-ghost-hover)]
         active:bg-[var(--btn-ghost-active)]
       `,
       danger: `
         bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-danger-dark)]
         text-white
         hover:from-[var(--color-danger-light)] hover:to-[var(--color-danger)]
         shadow-[var(--shadow-button)]
       `
     },
     size: {
       sm: 'h-8 px-4 text-sm rounded-md',
       md: 'h-10 px-6 text-base rounded-lg',
       lg: 'h-12 px-8 text-lg rounded-xl'
     }
   };
   
   const Button = React.forwardRef(({ 
     className, 
     variant = 'primary', 
     size = 'md', 
     children, 
     ...props 
   }, ref) => {
     return (
       <button
         className={cn(
           'inline-flex items-center justify-center font-medium transition-[var(--button-transition)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
           buttonVariants.variant[variant],
           buttonVariants.size[size],
           className
         )}
         ref={ref}
         {...props}
       >
         {children}
       </button>
     );
   });
   
   Button.displayName = 'Button';
   export { Button };
   ```

2. **Icon Button Component**
   ```jsx
   // components/ui/IconButton.jsx
   import React from 'react';
   import { Button } from './Button';
   import { cn } from '../utils/cn';
   
   const IconButton = React.forwardRef(({ 
     className, 
     variant = 'ghost', 
     size = 'sm', 
     children, 
     ...props 
   }, ref) => {
     return (
       <Button
         className={cn('p-2', className)}
         variant={variant}
         size={size}
         ref={ref}
         {...props}
       >
         {children}
       </Button>
     );
   });
   
   IconButton.displayName = 'IconButton';
   export { IconButton };
   ```

### Phase 3: Theme Integration
1. **CSS Custom Properties Update**
   ```css
   /* theme.css - Enhanced button tokens */
   :root {
     /* Button Base Styles */
     --button-font-family: var(--font-family-primary);
     --button-font-weight: var(--font-semibold);
     --button-letter-spacing: 0.025em;
     
     /* Button Transitions */
     --button-transition-fast: 150ms ease;
     --button-transition-normal: 200ms ease;
     --button-transition-slow: 300ms ease;
     
     /* Primary Button */
     --btn-primary-bg: linear-gradient(135deg, var(--color-brand), var(--color-brand-accent));
     --btn-primary-hover: linear-gradient(135deg, var(--color-brand-light), var(--color-brand));
     --btn-primary-active: linear-gradient(135deg, var(--color-brand-dark), var(--color-brand-accent));
     --btn-primary-text: var(--text-primary);
     --btn-primary-shadow: var(--shadow-button);
     
     /* Secondary Button */
     --btn-secondary-bg: var(--bg-surface);
     --btn-secondary-hover: var(--bg-tertiary);
     --btn-secondary-active: var(--bg-secondary);
     --btn-secondary-text: var(--text-primary);
     --btn-secondary-border: 1px solid var(--border-primary);
     
     /* Ghost Button */
     --btn-ghost-bg: transparent;
     --btn-ghost-hover: rgba(255, 255, 255, 0.05);
     --btn-ghost-active: rgba(255, 255, 255, 0.1);
     --btn-ghost-text: var(--text-primary);
     
     /* Danger Button */
     --btn-danger-bg: linear-gradient(135deg, var(--color-danger), var(--color-danger-dark));
     --btn-danger-hover: linear-gradient(135deg, var(--color-danger-light), var(--color-danger));
     --btn-danger-active: linear-gradient(135deg, var(--color-danger-dark), var(--color-danger));
     --btn-danger-text: var(--text-primary);
   }
   ```

### Phase 4: Component Migration
1. **Systematic Replacement**
   ```jsx
   // Before: Inconsistent buttons
   <button onClick={copySummary} className="btn-ghost p-2 rounded-xl bg-[var(--bg-secondary)] flex items-center gap-2">
     <Share2 size={18} />
     <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Copy</span>
   </button>
   
   // After: Unified button system
   <Button variant="ghost" size="sm" onClick={copySummary} className="flex items-center gap-2">
     <Share2 size={18} />
     <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Copy</span>
   </Button>
   ```

2. **Migration Priority List**
   - **High Priority**: Active game controls, export buttons
   - **Medium Priority**: Navigation, settings, modals
   - **Low Priority**: Decorative elements,次要 actions

### Phase 5: Testing Integration
1. **Visual Regression Tests**
   ```javascript
   // Button visual testing
   describe('Button Component', () => {
     test('should render consistent styles across variants', () => {
       const primaryButton = render(<Button variant="primary">Test</Button>);
       const secondaryButton = render(<Button variant="secondary">Test</Button>);
       const ghostButton = render(<Button variant="ghost">Test</Button>);
       
       // Test consistent dimensions
       expect(primaryButton).toHaveStyle({ height: '40px' });
       expect(secondaryButton).toHaveStyle({ height: '40px' });
       expect(ghostButton).toHaveStyle({ height: '40px' });
     });
     
     test('should have consistent hover states', () => {
       // Test hover state consistency
     });
   });
   ```

2. **Accessibility Testing**
   - Keyboard navigation
   - Screen reader compatibility
   - Focus management
   - Color contrast validation

## Technical Specifications

### Component Architecture
```
components/ui/
├── Button.jsx          # Main button component
├── IconButton.jsx      # Icon-only button
├── ButtonGroup.jsx      # Button grouping
└── index.js           # Component exports
```

### Design Token Structure
```css
/* Button Design Tokens */
--button-{property}-{variant}-{state}
--button-height-{size}
--button-padding-{size}
--button-radius-{size}
--button-font-size-{size}
```

### Variant System
- **Primary**: Main actions, CTAs
- **Secondary**: Alternative actions
- **Ghost**: Subtle actions, icons
- **Danger**: Destructive actions

### Size System
- **Small**: Compact spaces, icon buttons
- **Medium**: Default size, most common
- **Large**: Important actions, mobile

## Testing Requirements

### Visual Tests
- Consistent rendering across variants
- Hover state animations
- Active state feedback
- Disabled state appearance

### Functional Tests
- Click handlers work correctly
- Keyboard navigation
- Focus management
- Accessibility compliance

### Integration Tests
- Works with existing components
- Theme integration
- Responsive behavior
- Cross-browser compatibility

## Success Metrics

### Design Requirements
- ✅ Consistent button styles across app
- ✅ Professional appearance maintained
- ✅ Design system cohesion achieved
- ✅ Brand consistency preserved

### User Experience Requirements
- ✅ Intuitive interaction patterns
- ✅ Clear visual hierarchy
- ✅ Accessible to all users
- ✅ Responsive across devices

### Technical Requirements
- ✅ Component reusability
- ✅ Maintainable codebase
- ✅ Performance optimized
- ✅ Browser compatible

## Risk Assessment

### Technical Risks
- **Breaking Changes**: Gradual migration strategy
- **Performance**: Optimize CSS and JS
- **Browser Compatibility**: Test thoroughly
- **Theme Conflicts**: Clear token structure

### User Experience Risks
- **Learning Curve**: Maintain familiar patterns
- **Accessibility**: Comprehensive testing
- **Mobile Experience**: Responsive design
- **Visual Confusion**: Clear variant usage

## Implementation Timeline

### Week 1: Foundation
- Day 1-2: Design system analysis and token creation
- Day 3-4: Base button component development
- Day 5: Theme integration and testing

### Week 2: Migration
- Day 1-3: High-priority component migration
- Day 4-5: Medium-priority updates

### Week 3: Polish
- Day 1-2: Low-priority updates and fixes
- Day 3-5: Testing, documentation, and deployment

## Dependencies

### Required Components
- Base button system
- Design tokens
- Theme integration
- Utility functions

### External Dependencies
- React forwardRef
- CSS custom properties
- Testing framework
- Accessibility tools

## Alternatives Considered

### Option 1: CSS Classes Only
- **Pros**: Simple implementation
- **Cons**: Limited flexibility
- **Rejected**: Insufficient for complex needs

### Option 2: Third-Party Library
- **Pros**: Quick implementation
- **Cons**: Customization limits
- **Rejected**: Brand consistency issues

### Option 3: Custom Component System (Chosen)
- **Pros**: Full control, brand consistency
- **Cons**: Development effort
- **Accepted**: Best long-term solution

## Conclusion

This ADR establishes a unified button system that brings professional consistency to the Track Side app. The component-based approach with design tokens ensures maintainability while providing the flexibility needed for different use cases. The systematic migration strategy minimizes disruption while achieving the desired visual cohesion.

**Status**: Ready for implementation
**Priority**: Medium
**Expected Timeline**: 2-3 weeks
**Success Criteria**: Consistent, professional button appearance across the entire application with improved maintainability and user experience.
