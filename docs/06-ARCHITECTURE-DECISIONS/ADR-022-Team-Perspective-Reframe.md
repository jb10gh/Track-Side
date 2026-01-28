# ADR-022: Team Perspective Reframe

## Status
**Medium** - UX Enhancement

## Context
The current app frames games as "Track Side VS Opponent" which creates a competitive dynamic between teams. The user wants to reframe this as a single team using the app to track their performance while highlighting the opposing team.

## Problem
- "VS" framing suggests competition between equals
- Current design doesn't reflect the app's purpose as a tracking tool
- Language and visuals create wrong psychological framing
- Export formats reinforce competitive framing
- Team identity not clearly established

## Decision
Reframe the entire app experience from "VS competition" to "Our team tracking opponent performance" with appropriate language, visuals, and data presentation.

## Implementation Plan

### Phase 1: Language and Terminology
1. **Content Strategy Update**
   ```jsx
   // Language mapping
   const LANGUAGE_MAPPING = {
     // Current → New
     'Track Side VS Opponent' → 'Track Side: vs Opponent',
     'Us vs Them' → 'Our Team vs Opponent',
     'VS' → 'vs',
     'Match: Us vs' → 'Match: Our Team vs',
     'Final Score: 2-1' → 'Our Team: 2, Opponent: 1',
     'Our Goals' → 'Our Team Goals',
     'Their Goals' → 'Opponent Goals'
   };
   
   // Component updates
   const GameHeader = ({ opponentName, ourScore, opponentScore }) => {
     return (
       <div className="game-header">
         <h2>Track Side: vs {opponentName}</h2>
         <div className="score-display">
           <div className="our-score">
             <span className="label">Our Team</span>
             <span className="score">{ourScore}</span>
           </div>
           <div className="separator">:</div>
           <div className="opponent-score">
             <span className="label">{opponentName}</span>
             <span className="score">{opponentScore}</span>
           </div>
         </div>
       </div>
     );
   };
   ```

2. **UI Text Updates**
   ```jsx
   // Update all UI text throughout the app
   const UI_TEXT_UPDATES = {
     // Active game page
     gameTitle: (opponent) => `Track Side: vs ${opponent}`,
     ourTeamLabel: 'Our Team',
     opponentLabel: (name) => name,
     
     // Export formats
     matchSummary: (opponent) => `🏆 Match: Our Team vs ${opponent}`,
     finalScore: (our, their) => `⚡ Our Team: ${our}, Opponent: ${their}`,
     
     // Event descriptions
     ourGoal: (player) => `⚽ [time] 🔵 ${player}`,
     opponentGoal: (player) => `⚽ [time] 🔴 ${player}`,
     
     // Statistics
     ourStats: 'Our Team Stats',
     opponentStats: 'Opponent Stats'
   };
   ```

### Phase 2: Visual Design Updates
1. **Score Display Reframe**
   ```jsx
   // New score display component
   const TeamScoreDisplay = ({ ourScore, opponentScore, opponentName }) => {
     return (
       <div className="team-score-display">
         <div className="our-team-section">
           <div className="team-label">Our Team</div>
           <div className="team-score">{ourScore}</div>
           <div className="team-indicator our-indicator">
             <div className="indicator-dot"></div>
             <span>Track Side</span>
           </div>
         </div>
         
         <div className="vs-separator">vs</div>
         
         <div className="opponent-section">
           <div className="team-label">{opponentName}</div>
           <div className="team-score">{opponentScore}</div>
           <div className="team-indicator opponent-indicator">
             <div className="indicator-dot"></div>
             <span>Opponent</span>
           </div>
         </div>
       </div>
     );
   };
   ```

2. **Color Scheme Adjustment**
   ```css
   /* Updated color scheme for team perspective */
   :root {
     /* Our Team (Primary) */
     --team-our-primary: #E91E63;     /* Hot pink - Track Side brand */
     --team-our-light: #F48FB1;
     --team-our-dark: #C2185B;
     --team-our-bg: rgba(233, 30, 99, 0.1);
     
     /* Opponent (Secondary) */
     --team-opponent-primary: #9C27B0; /* Purple */
     --team-opponent-light: #BA68C8;
     --team-opponent-dark: #7B1FA2;
     --team-opponent-bg: rgba(156, 39, 176, 0.1);
     
     /* Neutral elements */
     --vs-separator: var(--text-secondary);
     --track-side-accent: var(--team-our-primary);
   }
   
   /* Visual hierarchy */
   .our-team-section {
     border: 2px solid var(--team-our-primary);
     background: var(--team-our-bg);
   }
   
   .opponent-section {
     border: 1px solid var(--team-opponent-primary);
     background: var(--team-opponent-bg);
   }
   
   .vs-separator {
     color: var(--vs-separator);
     font-weight: var(--font-bold);
     font-size: 1.2rem;
   }
   ```

### Phase 3: Export Format Updates
1. **Beautiful Export Reframe**
   ```javascript
   // Updated export format generator
   const generateTeamPerspectiveExport = (game, formatTime, productionUrl) => {
     const summary = [
       '📊 MATCH SUMMARY',
       '═══════════════════════════',
       `🏆 Match: Our Team vs ${game.opponentName}`,
       `⚡ Our Team: ${game.myScore}, Opponent: ${game.opponentScore}`,
       `📅 Date: ${new Date(game.timestamp || Date.now()).toLocaleDateString()}`,
       `⏱️ Duration: ${formatTime ? formatTime(game.finalTime) : game.finalTime || 'Unknown'}`,
       `📝 Events: ${game.events.length} total`,
       '',
       '📋 EVENT TIMELINE',
       '═══════════════════════════',
       ...game.events.slice().reverse().map(e => {
         const icon = e.type === 'goal' ? '⚽' : e.type === 'penalty' ? '🟨' : '📝';
         const team = e.team === 'us' ? '🔵' : '🔴';
         const teamLabel = e.team === 'us' ? 'Our Team' : game.opponentName;
         const pk = e.meta?.isPK ? ' (PK)' : '';
         return `${icon} [${formatTime ? formatTime(e.gameTime) : e.gameTime}] ${team} ${e.label || 'Unnamed'} (${teamLabel})${pk}`;
       }),
       '',
       '📊 TEAM STATISTICS',
       '═══════════════════════════',
       `🔵 Our Team: ${game.myScore} goals`,
       `🔴 ${game.opponentName}: ${game.opponentScore} goals`,
       '',
       `🌐 View Live: ${productionUrl}`,
       '',
       'Generated by Track Side App'
     ].join('\n');
     
     return summary;
   };
   ```

2. **Email Template Update**
   ```typescript
   // Updated email subject and content
   const generateTeamPerspectiveEmail = (game: GameData) => {
     const subject = `Track Side: Our Team ${game.myScore} - ${game.opponentScore} ${game.opponentName}`;
     const content = generateTeamPerspectiveExport(game, formatTimeForExport, getProductionUrl());
     
     return {
       subject,
       body: content,
       isHtml: false
     };
   };
   ```

### Phase 4: Component Updates
1. **Game Header Reframe**
   ```jsx
   // Updated ConsolidatedGameHeader
   const ConsolidatedGameHeader = ({ opponentName, ourScore, opponentScore }) => {
     return (
       <header className="consolidated-game-header">
         <div className="app-identity">
           <TrackSideLogo />
           <h1>Track Side</h1>
         </div>
         
         <div className="match-context">
           <div className="match-title">
             <span className="track-side-label">Our Team</span>
             <span className="vs-separator">vs</span>
             <span className="opponent-name">{opponentName}</span>
           </div>
           
           <TeamScoreDisplay 
             ourScore={ourScore}
             opponentScore={opponentScore}
             opponentName={opponentName}
           />
         </div>
       </header>
     );
   };
   ```

2. **Event List Updates**
   ```jsx
   // Updated event display
   const EventItem = ({ event, opponentName }) => {
     const isOurTeam = event.team === 'us';
     const teamLabel = isOurTeam ? 'Our Team' : opponentName;
     const teamClass = isOurTeam ? 'our-team' : 'opponent';
     
     return (
       <div className={`event-item ${teamClass}`}>
         <div className="event-icon">
           {event.type === 'goal' ? '⚽' : '🟨'}
         </div>
         <div className="event-details">
           <span className="event-time">[{event.gameTime}]</span>
           <span className="event-player">{event.label}</span>
           <span className="event-team">({teamLabel})</span>
           {event.meta?.isPK && <span className="event-pk"> (PK)</span>}
         </div>
       </div>
     );
   };
   ```

### Phase 5: Testing Integration
1. **Language Consistency Tests**
   ```javascript
   describe('Team Perspective Language', () => {
     test('should use "Our Team" instead of "Us"', () => {
       const export = generateTeamPerspectiveExport(testGame);
       expect(export).toContain('Our Team');
       expect(export).not.toContain('Us vs');
     });
     
     test('should use "vs" instead of "VS"', () => {
       const header = render(<GameHeader opponentName="Test FC" />);
       expect(header).toContain('vs');
       expect(header).not.toContain('VS');
     });
     
     test('should frame scores as "Our Team: X, Opponent: Y"', () => {
       const export = generateTeamPerspectiveExport(testGame);
       expect(export).toContain('Our Team: 2, Opponent: 1');
     });
   });
   ```

2. **Visual Hierarchy Tests**
   - Our team section prominence
   - Opponent section secondary positioning
   - Clear visual separation
   - Consistent color application

## Technical Specifications

### Language Standards
```
Team References:
- Our Team (primary focus)
- Opponent Name (secondary)
- Track Side (app identity)

Score Format:
- "Our Team: X, Opponent: Y"
- "Our Team Goals" vs "Opponent Goals"

Separators:
- "vs" (lowercase, not "VS")
- ":" for score separation
- "—" for section dividers
```

### Visual Hierarchy
```
1. Track Side Brand (top)
2. "Our Team" (prominent)
3. "vs" (subtle separator)
4. Opponent Name (secondary)
5. Score Display (balanced)
```

### Color Psychology
```
Our Team:
- Primary: Hot Pink (brand color)
- Emphasis: Strong borders, backgrounds
- Position: Left/prominent

Opponent:
- Secondary: Purple
- Subtle: Lighter borders, backgrounds
- Position: Right/secondary
```

## Testing Requirements

### Language Tests
- Consistent terminology across all components
- Export format language validation
- Email content verification
- UI text completeness

### Visual Tests
- Visual hierarchy validation
- Color scheme consistency
- Responsive design testing
- Accessibility compliance

### User Experience Tests
- Clear team identification
- Intuitive score understanding
- Professional appearance
- Mobile compatibility

## Success Metrics

### Language Requirements
- ✅ "Our Team" used consistently
- ✅ "vs" separator instead of "VS"
- ✅ Score format "Our Team: X, Opponent: Y"
- ✅ Professional tone maintained

### Visual Requirements
- ✅ Our team visually prominent
- ✅ Clear team separation
- ✅ Consistent color scheme
- ✅ Professional appearance

### User Experience Requirements
- ✅ Clear team perspective
- ✅ Easy score interpretation
- ✅ Intuitive interface
- ✅ Mobile-friendly design

## Risk Assessment

### Technical Risks
- **Inconsistent Updates**: Comprehensive component audit
- **Color Conflicts**: Clear design system
- **Text Overflow**: Responsive design
- **Accessibility**: Color contrast validation

### User Experience Risks
- **Confusion**: Clear visual hierarchy
- **Brand Dilution**: Maintain Track Side identity
- **Mobile Issues**: Responsive testing
- **Learning Curve**: Intuitive design

## Implementation Timeline

### Week 1: Language Updates
- Day 1-2: Content strategy and text updates
- Day 3-4: Component text updates
- Day 5: Export format updates

### Week 2: Visual Updates
- Day 1-3: Score display and color updates
- Day 4-5: Component visual updates

### Week 3: Integration and Testing
- Day 1-3: Full integration and testing
- Day 4-5: Polish and deployment

## Dependencies

### Required Components
- All text-containing components
- Score display components
- Export functionality
- Email templates

### External Dependencies
- Color scheme system
- Text content management
- Export format generators
- Email service integration

## Alternatives Considered

### Option 1: Minimal Text Changes
- **Pros**: Quick implementation
- **Cons**: Incomplete reframe
- **Rejected**: Doesn't address core issue

### Option 2: Visual Only Changes
- **Pros**: Visual improvement
- **Cons**: Language inconsistency
- **Rejected**: Half-measure approach

### Option 3: Complete Reframe (Chosen)
- **Pros**: Complete solution, consistent experience
- **Cons**: Comprehensive implementation
- **Accepted**: Best user experience

## Conclusion

This ADR reframes the entire app experience from a competitive "VS" dynamic to a team-focused tracking perspective. The comprehensive approach ensures consistent language, visual hierarchy, and user experience that properly reflects the app's purpose as a team tracking tool rather than a competitive platform.

**Status**: Ready for implementation
**Priority**: Medium
**Expected Timeline**: 2-3 weeks
**Success Criteria**: Complete reframe to team perspective with consistent language, visuals, and user experience throughout the app.
