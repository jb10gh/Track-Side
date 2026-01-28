# 🏗️ Track Side Architecture

Comprehensive overview of Track Side's technical architecture, design patterns, and system organization.

---

## 🎯 **Architecture Overview**

Track Side follows a modern React architecture with emphasis on performance, maintainability, and mobile-first design.

### **Core Principles**
- **Mobile-First**: Designed for sideline use with touch optimization
- **Performance First**: Optimized bundle size and runtime performance
- **Component-Driven**: Reusable, testable component architecture
- **State Management**: Centralized state with Zustand
- **Progressive Enhancement**: PWA capabilities with graceful degradation

---

## 📱 **Application Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    Track Side App                        │
├─────────────────────────────────────────────────────────┤
│  🎨 UI Layer (React Components)                          │
│  ├── Pages (Home, ActiveGame)                           │
│  ├── Components (Game, Layout, UI)                      │
│  └── Hooks (useGameTimer, useAdvancedGestures)          │
├─────────────────────────────────────────────────────────┤
│  🔄 State Management (Zustand Store)                     │
│  ├── Game State (active game, events, scores)           │
│  ├── UI State (modals, loading, errors)                 │
│  └── Persistence (localStorage, history)                 │
├─────────────────────────────────────────────────────────┤
│  🛠️ Business Logic                                      │
│  ├── Game Engine (event processing, scoring)            │
│  ├── Timer System (game time, elapsed time)             │
│  └── Export Engine (CSV, email, reports)                │
├─────────────────────────────────────────────────────────┤
│  🔧 Utilities & Services                                │
│  ├── Performance Monitoring                              │
│  ├── Error Tracking                                      │
│  ├── Analytics                                           │
│  └── PWA Service Worker                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 **Component Architecture**

### **Component Hierarchy**

```
App
├── Router (React Router)
│   ├── Home
│   │   ├── NewMatchFormModern
│   │   └── MatchArchive
│   └── ActiveGame
│       ├── ShellModern
│       ├── ScoreBoardMobile
│       ├── ActionGridMobile
│       ├── EventTimelineMobile
│       └── Modals (GameModal, ExportModal, etc.)
```

### **Component Patterns**

#### **1. Modern Component Pattern**
```jsx
// Modern, mobile-responsive component
export const ComponentName = ({ prop1, prop2 }) => {
  // Hooks and state
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);
  
  // Render
  return (
    <div className="responsive-layout">
      {/* Component JSX */}
    </div>
  );
};
```

#### **2. State Management Pattern**
```jsx
// Zustand store integration
export const Component = () => {
  const { state, actions } = useGameStore();
  
  return (
    <div>
      {/* Use store state and actions */}
    </div>
  );
};
```

#### **3. Mobile-First Pattern**
```jsx
// Responsive design with Tailwind
<div className="flex flex-col sm:flex-row gap-4">
  {/* Mobile: stacked, Desktop: side-by-side */}
</div>
```

---

## 🔄 **State Management Architecture**

### **Zustand Store Structure**

```javascript
// Game Store (src/store/gameStore.js)
export const useGameStore = create(
  persist(
    (set, get) => ({
      // Game State
      activeGameId: null,
      opponentName: '',
      myScore: 0,
      opponentScore: 0,
      events: [],
      roster: [],
      isRunning: false,
      startTime: null,
      accumulatedTime: 0,
      history: [],
      
      // Actions
      startGame: (opponentName) => { /* ... */ },
      finishGame: () => { /* ... */ },
      addEvent: (type, team, label, meta) => { /* ... */ },
      undoLastEvent: () => { /* ... */ },
      deleteEvent: (eventId) => { /* ... */ },
      updateEvent: (eventId, updates) => { /* ... */ },
      
      // Timer Actions
      toggleTimer: () => { /* ... */ },
      formatTime: () => { /* ... */ },
      getElapsedTime: () => { /* ... */ },
    }),
    {
      name: 'track-side-game-storage',
      partialize: (state) => ({
        history: state.history,
        roster: state.roster,
      }),
    }
  )
);
```

### **State Patterns**

#### **1. Single Source of Truth**
- All game state in one store
- No prop drilling for game data
- Consistent state across components

#### **2. Persistence Strategy**
- Game history persisted to localStorage
- Active game state in memory only
- Automatic cleanup on game completion

#### **3. Performance Optimization**
- Shallow comparisons for re-renders
- Selective subscriptions in components
- Optimistic updates for better UX

---

## ⏱️ **Timer System Architecture**

### **Timer Components**

```
Timer System
├── useGameTimer Hook
│   ├── Time calculation logic
│   ├── Format utilities
│   └── Performance optimization
├── Game Store Timer Actions
│   ├── toggleTimer
│   ├── getElapsedTime
│   └── formatTime
└── UI Components
    ├── ScoreBoard display
    ├── Timer controls
    └── Time formatting
```

### **Timer Implementation**

```javascript
// Custom hook for timer management
export const useGameTimer = () => {
  const { isRunning, startTime, accumulatedTime } = useGameStore();
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100); // Update every 100ms for smooth display
    
    return () => clearInterval(interval);
  }, [isRunning, startTime]);
  
  const elapsedTime = useMemo(() => {
    if (!isRunning || !startTime) return accumulatedTime;
    return accumulatedTime + (currentTime - startTime);
  }, [isRunning, startTime, accumulatedTime, currentTime]);
  
  return formatTime(elapsedTime);
};
```

---

## 🎨 **Theme System Architecture**

### **Theme Structure**

```
Theme System
├── CSS Custom Properties
│   ├── Brand Colors (pink, blue, amber)
│   ├── Semantic Colors (success, warning, danger)
│   ├── Typography (fonts, sizes, weights)
│   └── Spacing (scale, layout)
├── Component Themes
│   ├── Buttons (primary, secondary, ghost)
│   ├── Cards (surface, elevated, glass)
│   └── Modals (overlay, backdrop)
└── Responsive Design
    ├── Mobile (<640px)
    ├── Tablet (640px-1024px)
    └── Desktop (>1024px)
```

### **Theme Implementation**

```css
/* CSS Custom Properties */
:root {
  /* Brand Colors */
  --brand-primary: #FF1493;
  --brand-primary-light: #FF69B4;
  --brand-primary-dark: #C71585;
  
  /* Team Colors */
  --team-our: var(--brand-primary);
  --team-opponent: #007ACC;
  
  /* Semantic Colors */
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  
  /* Typography */
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
}
```

---

## 📊 **Export System Architecture**

### **Export Pipeline**

```
Export System
├── Data Processing
│   ├── Event aggregation
│   ├── Score calculation
│   └── Time formatting
├── Format Generation
│   ├── CSV Export
│   ├── Email Templates
│   └── Summary Reports
└── Delivery Methods
    ├── File Download
    ├── Email Client
    └── Clipboard Copy
```

### **Export Implementation**

```javascript
// Export utilities (src/utils/export.js)
export const generateCSV = (gameData) => {
  const headers = ['Time', 'Event', 'Team', 'Player', 'Type'];
  const rows = gameData.events.map(event => [
    formatTime(event.gameTime),
    event.type,
    event.team,
    event.label,
    event.meta.isPK ? 'Penalty Kick' : 'Regular'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

export const generateEmailContent = (gameData) => {
  return {
    subject: `Match Report: ${gameData.myScore}-${gameData.opponentScore} vs ${gameData.opponentName}`,
    body: generateMatchSummary(gameData),
    attachment: {
      name: `match-report-${Date.now()}.csv`,
      content: generateCSV(gameData)
    }
  };
};
```

---

## 🔧 **Performance Architecture**

### **Performance Optimization**

#### **1. Bundle Optimization**
- **Code Splitting**: Lazy loading for large components
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Compressed images and fonts
- **Bundle Size**: 373KB gzipped (target <400KB)

#### **2. Runtime Performance**
- **React.memo**: Prevent unnecessary re-renders
- **useCallback/useMemo**: Optimize expensive operations
- **Virtual Scrolling**: For large event lists
- **Debounced Updates**: Smooth timer updates

#### **3. Mobile Performance**
- **Touch Optimization**: 44px minimum touch targets
- **Reduced Motion**: Respect user preferences
- **Battery Optimization**: Efficient timer updates
- **Network Awareness**: Offline functionality

---

## 🛡️ **Error Handling Architecture**

### **Error Boundaries**

```jsx
// Error boundary component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary', { error, errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

### **Error Tracking**

```javascript
// Logger utility (src/utils/logger.js)
class Logger {
  error(error, context = {}) {
    console.error(error, context);
    // Send to monitoring service in production
    this.sendToMonitoring('error', error, context);
  }
  
  info(message, context = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, context);
    }
    this.sendToMonitoring('info', message, context);
  }
}
```

---

## 🔍 **Testing Architecture**

### **Test Structure**

```
Testing
├── Unit Tests
│   ├── Component Tests (React Testing Library)
│   ├── Hook Tests (custom hooks)
│   └── Utility Tests (pure functions)
├── Integration Tests
│   ├── User Workflows
│   ├── State Management
│   └── API Integration
└── E2E Tests
    ├── Critical User Paths
    ├── Mobile Experience
    └── PWA Functionality
```

### **Test Implementation**

```javascript
// Component test example
describe('ScoreBoard Component', () => {
  test('displays current score', () => {
    const { getByText } = render(<ScoreBoard myScore={2} opponentScore={1} />);
    
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
  });
  
  test('handles timer toggle', () => {
    const mockToggle = vi.fn();
    const { getByRole } = render(
      <ScoreBoard 
        isRunning={false} 
        onToggleTimer={mockToggle} 
      />
    );
    
    fireEvent.click(getByRole('button'));
    expect(mockToggle).toHaveBeenCalled();
  });
});
```

---

## 🚀 **Deployment Architecture**

### **Build Process**

```
Build Pipeline
├── Development (npm run dev)
│   ├── Vite dev server
│   ├── Hot Module Replacement
│   └── Development optimizations
├── Production (npm run build)
│   ├── Code optimization
│   ├── Bundle analysis
│   ├── Asset optimization
│   └── PWA generation
└── Deployment (Vercel)
    ├── Automatic deployment
    ├── Edge caching
    └── SSL configuration
```

### **Environment Configuration**

```javascript
// Vite configuration (vite.config.js)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Track Side',
        short_name: 'Track Side',
        theme_color: '#FF1493',
        background_color: '#1a1a1a',
      }
    })
  ],
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          state: ['zustand']
        }
      }
    }
  }
});
```

---

## 📋 **Architecture Decisions**

For detailed architectural decisions and their rationale, see the [**Architecture Decision Records**](../06-ARCHITECTURE-DECISIONS/).

### **Key Decisions**
- **React + Zustand**: Chosen for performance and simplicity
- **Tailwind CSS**: For rapid development and consistency
- **Vite**: For fast development and optimized builds
- **PWA**: For mobile app-like experience
- **TypeScript**: For type safety and better developer experience

---

## 🔮 **Future Architecture Considerations**

### **Scalability**
- **Multi-sport Support**: Extensible event system
- **Team Collaboration**: Real-time sync capabilities
- **Advanced Analytics**: Data visualization components
- **API Integration**: Third-party service connections

### **Performance**
- **Service Workers**: Enhanced offline capabilities
- **WebAssembly**: For complex calculations
- **Edge Computing**: Global deployment optimization
- **Database Integration**: Persistent data storage

---

*Architecture Documentation • Track Side Professional Sports Analytics*  
*Last updated: January 27, 2026*
