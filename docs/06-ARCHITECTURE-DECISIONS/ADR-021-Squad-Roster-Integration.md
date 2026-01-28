# ADR-021: Squad Roster Integration

## Status
**Medium** - Feature Enhancement

## Context
The squad roster on the first page is currently non-functional and provides no value to users. It cannot be edited and is not leveraged in other parts of the app, making it essentially pointless.

## Problem
- Roster is non-editable
- No integration with game events
- Players cannot be selected during scoring
- Roster data isolated from rest of app
- Wasted screen space with no utility

## Decision
Transform the squad roster into an editable, integrated system that enhances the game tracking experience.

## Implementation Plan

### Phase 1: Roster Management System
1. **Editable Roster Component**
   ```jsx
   // components/roster/SquadRoster.jsx
   import React, { useState } from 'react';
   import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
   
   const SquadRoster = ({ roster, onRosterUpdate, isEditable = true }) => {
     const [editingPlayer, setEditingPlayer] = useState(null);
     const [newPlayer, setNewPlayer] = useState('');
     
     const handleAddPlayer = () => {
       if (newPlayer.trim()) {
         onRosterUpdate([...roster, { 
           id: Date.now(), 
           name: newPlayer.trim(), 
           number: null 
         }]);
         setNewPlayer('');
       }
     };
     
     const handleUpdatePlayer = (playerId, newName) => {
       onRosterUpdate(roster.map(player => 
         player.id === playerId 
           ? { ...player, name: newName.trim() }
           : player
       ));
       setEditingPlayer(null);
     };
     
     const handleDeletePlayer = (playerId) => {
       onRosterUpdate(roster.filter(player => player.id !== playerId));
     };
     
     return (
       <div className="squad-roster">
         <h3>Team Roster</h3>
         
         {isEditable && (
           <div className="add-player">
             <input
               type="text"
               value={newPlayer}
               onChange={(e) => setNewPlayer(e.target.value)}
               placeholder="Add player name..."
               onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
             />
             <Button onClick={handleAddPlayer} size="sm">
               <Plus size={16} />
             </Button>
           </div>
         )}
         
         <div className="players-list">
           {roster.map(player => (
             <div key={player.id} className="player-item">
               {editingPlayer === player.id ? (
                 <div className="player-edit">
                   <input
                     type="text"
                     defaultValue={player.name}
                     autoFocus
                     onBlur={(e) => handleUpdatePlayer(player.id, e.target.value)}
                     onKeyPress={(e) => {
                       if (e.key === 'Enter') {
                         handleUpdatePlayer(player.id, e.target.value);
                       }
                     }}
                   />
                   <Button size="sm" variant="ghost">
                     <Save size={14} />
                   </Button>
                 </div>
               ) : (
                 <div className="player-display">
                   <span className="player-name">{player.name}</span>
                   {player.number && (
                     <span className="player-number">#{player.number}</span>
                   )}
                   {isEditable && (
                     <div className="player-actions">
                       <Button 
                         size="sm" 
                         variant="ghost"
                         onClick={() => setEditingPlayer(player.id)}
                       >
                         <Edit2 size={14} />
                       </Button>
                       <Button 
                         size="sm" 
                         variant="danger"
                         onClick={() => handleDeletePlayer(player.id)}
                       >
                         <Trash2 size={14} />
                       </Button>
                     </div>
                   )}
                 </div>
               )}
             </div>
           ))}
         </div>
       </div>
     );
   };
   
   export default SquadRoster;
   ```

2. **Roster State Management**
   ```javascript
   // store/rosterStore.js
   import { create } from 'zustand';
   import { persist } from 'zustand/middleware';
   
   const useRosterStore = create(
     persist(
       (set, get) => ({
         roster: [],
         
         // Roster management
         addPlayer: (player) => set((state) => ({
           roster: [...state.roster, { ...player, id: Date.now() }]
         })),
         
         updatePlayer: (playerId, updates) => set((state) => ({
           roster: state.roster.map(player =>
             player.id === playerId ? { ...player, ...updates } : player
           )
         })),
         
         deletePlayer: (playerId) => set((state) => ({
           roster: state.roster.filter(player => player.id !== playerId)
         })),
         
         setRoster: (newRoster) => set({ roster: newRoster }),
         
         // Utility methods
         getPlayerById: (playerId) => {
           const { roster } = get();
           return roster.find(player => player.id === playerId);
         },
         
         getPlayerNames: () => {
           const { roster } = get();
           return roster.map(player => player.name);
         }
       }),
       {
         name: 'track-side-roster'
       }
     )
   );
   
   export default useRosterStore;
   ```

### Phase 2: Game Integration
1. **Player Selection in Events**
   ```jsx
   // components/game/EventPlayerSelector.jsx
   import React from 'react';
   import { useRosterStore } from '../../store/rosterStore';
   
   const EventPlayerSelector = ({ team, onPlayerSelect, selectedPlayer }) => {
     const { roster } = useRosterStore();
     
     return (
       <div className="player-selector">
         <label>Select Player:</label>
         <select
           value={selectedPlayer || ''}
           onChange={(e) => onPlayerSelect(e.target.value)}
           className="player-dropdown"
         >
           <option value="">Choose player...</option>
           {roster.map(player => (
             <option key={player.id} value={player.id}>
               {player.name}
               {player.number && ` #${player.number}`}
             </option>
           ))}
           <option value="unnamed">Unnamed</option>
         </select>
       </div>
     );
   };
   
   export default EventPlayerSelector;
   ```

2. **Enhanced Event Creation**
   ```jsx
   // Update event creation to include player selection
   const createEvent = (type, team, playerId = null) => {
     const { getPlayerById } = useRosterStore.getState();
     const player = playerId ? getPlayerById(playerId) : null;
     
     const event = {
       id: Date.now(),
       type,
       team,
       playerId,
       label: player ? player.name : 'Unnamed',
       gameTime: getCurrentGameTime(),
       timestamp: Date.now()
     };
     
     addEvent(event);
   };
   ```

### Phase 3: UI Integration
1. **Home Page Enhancement**
   ```jsx
   // pages/Home.jsx - Enhanced roster display
   const Home = () => {
     const { roster } = useRosterStore();
     
     return (
       <div className="home">
         <header>
           <h1>Track Side</h1>
         </header>
         
         <main>
           <section className="roster-section">
             <SquadRoster 
               roster={roster}
               onRosterUpdate={useRosterStore.getState().setRoster}
               isEditable={true}
             />
           </section>
           
           <section className="actions-section">
             <Button onClick={() => navigate('/new-game')}>
               Start New Game
             </Button>
           </section>
         </main>
       </div>
     );
   };
   ```

2. **Active Game Integration**
   ```jsx
   // pages/ActiveGame.jsx - Roster in game
   const ActiveGame = () => {
     const { roster } = useRosterStore();
     
     return (
       <div className="active-game">
         {/* Game header */}
         
         <div className="game-content">
           <div className="main-game">
             {/* Scoreboard and timer */}
           </div>
           
           <div className="side-panel">
             <SquadRoster 
               roster={roster}
               isEditable={false}
               onPlayerSelect={handlePlayerSelect}
             />
           </div>
         </div>
       </div>
     );
   };
   ```

### Phase 4: Advanced Features
1. **Player Statistics**
   ```jsx
   // components/roster/PlayerStats.jsx
   const PlayerStats = ({ playerId, events }) => {
     const playerEvents = events.filter(event => event.playerId === playerId);
     const goals = playerEvents.filter(event => event.type === 'goal').length;
     const penalties = playerEvents.filter(event => event.type === 'penalty').length;
     
     return (
       <div className="player-stats">
         <div className="stat">
           <span className="stat-label">Goals:</span>
           <span className="stat-value">{goals}</span>
         </div>
         <div className="stat">
           <span className="stat-label">Penalties:</span>
           <span className="stat-value">{penalties}</span>
         </div>
       </div>
     );
   };
   ```

2. **Import/Export Roster**
   ```javascript
   // Roster import/export functionality
   const exportRoster = () => {
     const { roster } = useRosterStore.getState();
     const csv = [
       ['Name', 'Number'],
       ...roster.map(player => [player.name, player.number || ''])
     ].map(row => row.join(',')).join('\n');
     
     downloadFile(csv, 'roster.csv', 'text/csv');
   };
   
   const importRoster = (file) => {
     const reader = new FileReader();
     reader.onload = (e) => {
       const csv = e.target.result;
       const lines = csv.split('\n');
       const players = lines.slice(1).map(line => {
         const [name, number] = line.split(',');
         return {
           id: Date.now() + Math.random(),
           name: name.trim(),
           number: number ? parseInt(number.trim()) : null
         };
       }).filter(player => player.name);
       
       useRosterStore.getState().setRoster(players);
     };
     reader.readAsText(file);
   };
   ```

### Phase 5: Testing Integration
1. **Roster Management Tests**
   ```javascript
   describe('Roster Management', () => {
     test('should add player to roster', () => {
       const { addPlayer, roster } = useRosterStore.getState();
       addPlayer({ name: 'John Doe', number: 10 });
       expect(roster).toHaveLength(1);
       expect(roster[0].name).toBe('John Doe');
     });
     
     test('should update player information', () => {
       const { addPlayer, updatePlayer, roster } = useRosterStore.getState();
       const player = { name: 'John Doe', number: 10 };
       addPlayer(player);
       updatePlayer(player.id, { name: 'Jane Doe' });
       expect(roster[0].name).toBe('Jane Doe');
     });
     
     test('should delete player from roster', () => {
       const { addPlayer, deletePlayer, roster } = useRosterStore.getState();
       const player = { name: 'John Doe', number: 10 };
       addPlayer(player);
       deletePlayer(player.id);
       expect(roster).toHaveLength(0);
     });
   });
   ```

## Technical Specifications

### Component Architecture
```
components/roster/
├── SquadRoster.jsx      # Main roster component
├── PlayerStats.jsx       # Player statistics
├── EventPlayerSelector.jsx # Player selection for events
└── RosterImport.jsx      # Import/export functionality
```

### State Management
```javascript
// Roster store structure
{
  roster: [
    {
      id: number,
      name: string,
      number: number | null,
      position: string | null,
      isActive: boolean
    }
  ],
  // Methods for CRUD operations
}
```

### Integration Points
- **Home Page**: Roster management
- **Active Game**: Player selection
- **Event Creation**: Player assignment
- **Statistics**: Player performance
- **Export**: Roster data

## Testing Requirements

### Functional Tests
- Add/edit/delete players
- Roster persistence
- Player selection in events
- Import/export functionality

### Integration Tests
- Roster integration with game flow
- Event creation with players
- Statistics calculation
- Cross-page functionality

### User Experience Tests
- Intuitive roster management
- Quick player selection
- Mobile responsiveness
- Accessibility compliance

## Success Metrics

### Functional Requirements
- ✅ Roster is fully editable
- ✅ Players can be selected in events
- ✅ Roster persists across sessions
- ✅ Import/export functionality works

### User Experience Requirements
- ✅ Intuitive roster management
- ✅ Quick player selection during games
- ✅ Mobile-friendly interface
- ✅ Clear visual feedback

### Integration Requirements
- ✅ Roster used in event creation
- ✅ Player statistics tracked
- ✅ Cross-page functionality
- ✅ Data persistence

## Risk Assessment

### Technical Risks
- **State Management**: Robust store implementation
- **Data Loss**: Proper persistence and backup
- **Performance**: Efficient rendering
- **Sync Issues**: Consistent state across components

### User Experience Risks
- **Complexity**: Simple, intuitive interface
- **Mobile Use**: Responsive design
- **Data Entry**: Efficient input methods
- **Learning Curve**: Clear instructions

## Implementation Timeline

### Week 1: Foundation
- Day 1-2: Roster store and basic component
- Day 3-4: Edit functionality
- Day 5: Persistence and testing

### Week 2: Integration
- Day 1-3: Game integration and player selection
- Day 4-5: Statistics and advanced features

### Week 3: Polish
- Day 1-2: Import/export functionality
- Day 3-5: Testing, optimization, and deployment

## Dependencies

### Required Components
- Roster management system
- Player selection components
- State management store
- Import/export utilities

### External Dependencies
- Zustand for state management
- File handling APIs
- Local storage persistence
- CSV parsing library

## Alternatives Considered

### Option 1: Read-Only Roster
- **Pros**: Simple implementation
- **Cons**: No user value
- **Rejected**: Doesn't solve core problem

### Option 2: Basic Edit Only
- **Pros**: Quick implementation
- **Cons**: Limited functionality
- **Rejected**: Insufficient integration

### Option 3: Full Integration (Chosen)
- **Pros**: Complete solution, high value
- **Cons**: Complex implementation
- **Accepted**: Best user experience

## Conclusion

This ADR transforms the pointless squad roster into a valuable, integrated feature that enhances the entire app experience. The editable roster with game integration provides real utility while maintaining simplicity and ease of use. The systematic approach ensures robust functionality with comprehensive testing.

**Status**: Ready for implementation
**Priority**: Medium
**Expected Timeline**: 2-3 weeks
**Success Criteria**: Fully functional roster system that enhances game tracking and provides real value to users.
