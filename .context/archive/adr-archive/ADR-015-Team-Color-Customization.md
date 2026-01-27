# ADR-015: Team Color Customization

## Status
Proposed

## Context
The current color system uses generic blue/red color schemes that don't reflect actual team colors. The user specifically wants "our colors" to be pink with contrasting colors for opponents. This personalization enhances team identity and makes the interface more engaging and intuitive for users tracking their specific team.

### Current Color Issues
1. **Generic Colors**: Blue/red scheme doesn't represent actual team colors
2. **Poor Personalization**: No connection to user's actual team identity
3. **Limited Contrast**: Current colors may not provide optimal contrast
4. **Static Design**: No ability to adapt to different team color schemes
5. **Visual Fatigue**: Generic colors are less engaging over long sessions

### User Requirements
- **Primary Team Color**: Pink for "our" team
- **Contrasting Opponent Colors**: Colors that work well with pink
- **Consistent Application**: Colors applied throughout the interface
- **Professional Appearance**: Maintain clean, modern design
- **Accessibility**: Proper contrast ratios for readability

## Decision
Implement a **flexible team color system** with pink as the default primary color and intelligent contrasting colors for opponents, with full customization capabilities and consistent application across all interface elements.

### Color System Architecture

#### Primary Color Palette
```css
/* Our Team (Pink Theme) */
--color-primary: #ec4899;      /* Pink-500 */
--color-primary-light: #f9a8d4; /* Pink-300 */
--color-primary-dark: #be185d;  /* Pink-700 */
--color-primary-bg: #fce7f3;     /* Pink-100 */

/* Opponent Team (Contrasting Colors) */
--color-opponent: #3b82f6;      /* Blue-500 - contrasts with pink */
--color-opponent-light: #93c5fd; /* Blue-300 */
--color-opponent-dark: #1d4ed8;  /* Blue-700 */
--color-opponent-bg: #dbeafe;    /* Blue-100 */
```

#### Alternative Opponent Colors
```css
/* High Contrast Options */
--color-opponent-green: #10b981;    /* Emerald */
--color-opponent-purple: #8b5cf6;   /* Violet */
--color-opponent-orange: #f97316;    /* Orange */
--color-opponent-teal: #14b8a6;      /* Teal */
```

#### Semantic Color Mapping
```css
/* Score Display */
--score-our-color: var(--color-primary);
--score-their-color: var(--color-opponent);

/* Event Items */
--event-our-bg: var(--color-primary-bg);
--event-our-border: var(--color-primary);
--event-their-bg: var(--color-opponent-bg);
--event-their-border: var(--color-opponent);

/* UI Elements */
--button-primary: var(--color-primary);
--accent-our: var(--color-primary);
--accent-their: var(--color-opponent);
```

### Implementation Strategy

#### 1. CSS Custom Properties System
- **Dynamic Variables**: CSS custom properties for easy color switching
- **Theme Classes**: CSS classes for different color schemes
- **Consistent Application**: Colors applied through semantic naming
- **Fallback Support**: Default colors for compatibility

#### 2. Color Configuration Store
```javascript
// Store color preferences
const colorConfig = {
  ourTeam: {
    primary: '#ec4899',
    light: '#f9a8d4',
    dark: '#be185d',
    background: '#fce7f3'
  },
  opponentTeam: {
    primary: '#3b82f6',
    light: '#93c5fd',
    dark: '#1d4ed8',
    background: '#dbeafe'
  },
  accessibility: {
    contrastRatio: 4.5,  // WCAG AA standard
    textColor: '#1f2937'
  }
};
```

#### 3. Component Color Integration
- **Score Boards**: Dynamic color application
- **Event Items**: Team-specific backgrounds and borders
- **Buttons**: Contextual color coding
- **Charts**: Team color integration in visualizations

### Visual Design Applications

#### Score Display
```
Our Score: [PINK] 3
Their Score: [BLUE] 1
```

#### Event Timeline
```
[PINK BG] Our Goal - Player Name (15:30)
[BLUE BG] Their Goal - Player Name (22:15)
```

#### Match Cards
```
[PINK ACCENT] vs Opponent
[PINK] 3 - [BLUE] 1
```

#### Action Buttons
```
[PINK] Record Our Goal
[BLUE] Record Their Goal
```

## Consequences
- ✅ **Team Identity**: Strong visual connection to user's team
- ✅ **Better UX**: Colors provide intuitive team identification
- ✅ **Professional Look**: Pink theme creates modern, engaging interface
- ✅ **Accessibility**: Proper contrast ratios maintained
- ✅ **Flexibility**: System supports future color customization
- ⚠️ **Color Dependencies**: Components must use semantic color variables
- ⚠️ **Testing Required**: Ensure contrast ratios meet accessibility standards
- ⚠️ **User Preference**: Some users may prefer different color schemes

## Success Metrics
- **User Engagement**: Increased time spent in app due to better visual appeal
- **Team Recognition**: Faster identification of team-specific elements
- **Accessibility Score**: All color combinations meet WCAG AA standards
- **User Satisfaction**: Positive feedback on visual design

## Implementation Priority
**Priority**: MEDIUM
**Effort**: 12 hours
**Dependencies**: None (can be implemented independently)
**Timeline**: Phase 2 of Visual Enhancements

## Technical Requirements

### CSS Architecture
```css
/* Base color system */
:root {
  /* Pink theme for our team */
  --team-our-primary: #ec4899;
  --team-our-light: #f9a8d4;
  --team-our-dark: #be185d;
  --team-our-bg: #fce7f3;
  
  /* Contrasting colors for opponents */
  --team-their-primary: #3b82f6;
  --team-their-light: #93c5fd;
  --team-their-dark: #1d4ed8;
  --team-their-bg: #dbeafe;
  
  /* Semantic mappings */
  --score-our: var(--team-our-primary);
  --score-their: var(--team-their-primary);
  --event-our-bg: var(--team-our-bg);
  --event-their-bg: var(--team-their-bg);
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  :root {
    --team-our-primary: #f9a8d4;
    --team-their-primary: #93c5fd;
  }
}
```

### Component Integration
```jsx
// Score component with dynamic colors
const ScoreDisplay = ({ ourScore, theirScore }) => (
  <div className="score-display">
    <span className="score-our" style={{ color: 'var(--score-our)' }}>
      {ourScore}
    </span>
    <span className="score-separator">-</span>
    <span className="score-their" style={{ color: 'var(--score-their)' }}>
      {theirScore}
    </span>
  </div>
);
```

## Testing Requirements
- **Contrast Testing**: Verify all color combinations meet WCAG standards
- **Visual Testing**: Ensure colors work across different screen types
- **User Testing**: Validate color preferences and usability
- **Accessibility Testing**: Screen reader compatibility with color changes
- **Performance**: CSS variable performance impact assessment

## Future Enhancements
- **Custom Color Picker**: Allow users to select custom team colors
- **Multiple Themes**: Pre-built color schemes for different sports
- **Dynamic Contrast**: Automatic contrast adjustment based on primary color
- **Team Logo Integration**: Incorporate team colors from logos
- **Season Themes**: Special color schemes for tournaments/events

---

*This ADR transforms the generic color scheme into a personalized team identity system with pink as the primary color and intelligent contrasting colors for opponents, enhancing user engagement and team recognition.*
