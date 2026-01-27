---
@skills: typescript-expert, javascript-mastery, doc-coauthoring
context_priority: high
document_type: standards
technical_depth: expert
audience: [developers, code-reviewers]
last_updated: 2024-01-26
reviewers: [human, ai-assistant]
---

# 📝 Coding Standards

## 🤖 AI Assistant Instructions
**Primary Skills:**
- @skills:typescript-expert for TypeScript precision and best practices
- @skills:javascript-mastery for JavaScript patterns and fundamentals
- @skills:doc-coauthoring for structured documentation and review workflows

## 📋 Overview (@skills:typescript-expert)
This document defines the coding standards and best practices for Track Side development. All code should follow these guidelines to ensure consistency, maintainability, and type safety.

## 🎯 **Core Principles**

### **1. Type Safety First** (@skills:typescript-expert)
- **Strict TypeScript**: Always use strict mode
- **No Implicit Any**: Avoid `any` type unless absolutely necessary
- **Explicit Types**: Define interfaces for all data structures
- **Type Inference**: Leverage TypeScript's type inference where appropriate

### **2. Clean Code Practices** (@skills:javascript-mastery)
- **Single Responsibility**: Each function/class has one purpose
- **Descriptive Names**: Use clear, meaningful names
- **Consistent Formatting**: Follow established patterns
- **Error Handling**: Proper error handling and logging

### **3. React Best Practices**
- **Functional Components**: Prefer functional components with hooks
- **Props Interfaces**: Define interfaces for all component props
- **State Management**: Use appropriate state management patterns
- **Performance**: Optimize re-renders with memoization

## 📝 **TypeScript Standards** (@skills:typescript-expert)

### **Configuration**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedParameters": true
  }
}
```

### **Interface Definitions**
```typescript
// Use descriptive interface names
interface GameEvent {
  id: string;
  type: EventType;
  team: Team;
  label: string;
  gameTime: string;
  timestamp: number;
  meta?: EventMeta;
}

// Use union types for enums
type EventType = 'goal' | 'penalty' | 'card';
type Team = 'us' | 'them';

// Use generic types for reusability
interface ComponentProps<T> {
  data: T;
  onUpdate: (data: T) => void;
  className?: string;
}

// Use readonly for immutable data
interface GameState {
  readonly activeGameId: string | null;
  readonly events: readonly GameEvent[];
  readonly myScore: number;
  readonly opponentScore: number;
}
```

### **Type Guards**
```typescript
// Use type guards for runtime type checking
const isGoal = (event: GameEvent): event is GoalEvent => {
  return event.type === 'goal';
};

// Use predicate types for complex checks
type GoalEvent = GameEvent & {
  type: 'goal';
};

// Use discriminated unions
const getEventIcon = (event: GameEvent) => {
  switch (event.type) {
    case 'goal': return '⚽';
    case 'penalty': return '🟨';
    case 'card': return '📝';
    default: return '📋';
  }
};
```

## 🧩 **JavaScript Standards** (@skills:javascript-mastery)

### **Modern JavaScript Features**
```typescript
// Use destructuring for clean code
const { activeGameId, events, myScore } = useGameStore();

// Use template literals for strings
const summary = `Match: Us vs ${opponentName}
Score: ${myScore}-${opponentScore}`;

// Use arrow functions for callbacks
const handleEvent = (type: EventType, team: Team) => {
  addEvent(type, team, label, meta);
};

// Use async/await for promises
const exportData = async (data: GameData) => {
  const csv = generateCSV(data);
  await downloadFile(csv, filename);
};
```

### **Array Methods**
```typescript
// Use functional array methods
const activeEvents = events.filter(e => e.type === 'goal');
const eventCount = events.length;

// Use map for transformations
const eventSummaries = events.map(e => ({
  id: e.id,
  summary: `${e.type}: ${e.label}`
}));

// Use reduce for aggregations
const totalGoals = events.reduce((sum, e) => 
  e.type === 'goal' ? sum + 1 : sum, 0
);
```

### **Error Handling**
```typescript
// Use proper error types
class GameError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: string
  ) {
    super(message);
    this.name = 'GameError';
  }
}

// Use try-catch for error handling
const handleExport = async (data: GameData) => {
  try {
    await exportData(data);
    return { success: true };
  } catch (error) {
    if (error instanceof GameError) {
      return { success: false, error: error.message };
    }
    throw error;
  }
};
```

## ⚛️ **React Standards**

### **Component Structure**
```typescript
// Use functional components with hooks
export const ScoreBoard = ({ myScore, opponentScore }: ScoreBoardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Use useEffect for side effects
  useEffect(() => {
    if (myScore !== opponentScore) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [myScore, opponentScore]);

  return (
    <div className={`score-board ${isAnimating ? 'animate' : ''}`}>
      <span className="score-our">{myScore}</span>
      <span className="score-separator">-</span>
      <span className="score-their">{opponentScore}</span>
    </div>
  );
};

// Define props interface
interface ScoreBoardProps {
  myScore: number;
  opponentScore: number;
  className?: string;
}
```

### **Hooks Usage**
```typescript
// Custom hooks for complex logic
export const useGameTimer = () => {
  const [time, setTime] = useState(0);
  const { isRunning, getElapsedTime, formatTime } = useGameStore();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(getElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, getElapsedTime]);

  return formatTime(time);
};

// Use memoization for performance
export const EventItem = React.memo<EventItemProps>(({ event, onEdit }) => {
  const handleClick = () => {
    onEdit(event);
  };

  return (
    <div onClick={handleClick} className="event-item">
      {/* Event content */}
    </div>
  );
});
```

### **State Management**
```typescript
// Use Zustand for state management
export const useGameStore = create<GameState>((set, get) => ({
  // State
  activeGameId: null,
  events: [],
  myScore: 0,
  opponentScore: 0,
  isRunning: false,

  // Actions
  addEvent: (type: EventType, team: Team, label: string, meta?: EventMeta) => {
    const newEvent: GameEvent = {
      id: crypto.randomUUID(),
      type,
      team,
      label,
      timestamp: Date.now(),
      gameTime: get().formatTime(get().getElapsedTime()),
      meta
    };

    set(state => ({
      ...state,
      events: [...state.events, newEvent]
    }));
  },

  // Computed values
  getOurGoals: () => get().events.filter(e => e.type === 'goal' && e.team === 'us').length,
  getTheirGoals: () => get().events.filter(e => e.type === 'goal' && e.team === 'them').length
}));
```

## 🎨 **CSS & Styling Standards**

### **Tailwind CSS Usage**
```typescript
// Use utility classes for styling
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => (
  <button
    className={`
      ${variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}
      ${size === 'sm' ? 'px-3 py-1.5' : size === 'md' ? 'px-4 py-2' : 'px-6 py-3'}
      rounded-lg font-semibold transition-colors
    `}
    {...props}
  >
    {children}
  </button>
);

// Use CSS-in-JS for dynamic styles
const ScoreDisplay = ({ score, color }: { score: number; color: string }) => (
  <div
    style={{
      color,
      fontSize: '2rem',
      fontWeight: 'bold'
    }}
  >
    {score}
  </div>
);
```

### **Component Styling**
```css
/* Use consistent naming conventions */
.score-board {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 0.75rem;
}

.score-our {
  color: var(--team-our-primary);
  font-weight: bold;
}

.score-their {
  color: var(--team-their-primary);
  font-weight: bold;
}

/* Use responsive design */
@media (min-width: 768px) {
  .score-board {
    padding: 2rem;
  }
}
```

## 🧪 **Testing Standards**

### **Unit Testing**
```typescript
// Use descriptive test names
describe('ScoreBoard', () => {
  // Use arrange-act-assert pattern
  describe('when scores are displayed', () => {
    const mockProps = { myScore: 3, opponentScore: 1 };
    
    render(<ScoreBoard {...mockProps} />);
    
    // Use getByRole for accessibility
    expect(screen.getByRole('score-our')).toHaveTextContent('3');
    expect(screen.getByRole('score-their')).toHaveTextContent('1');
  });

  // Use user-event for interactions
  it('calls onEdit when event is clicked', async () => {
    const mockOnEdit = jest.fn();
    const mockEvent = { id: '1', type: 'goal', team: 'us', label: 'Test' };
    
    render(<EventItem event={mockEvent} onEdit={mockOnEdit} />);
    
    await userEvent.click(screen.getByRole('event-item'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
  });
});
```

### **Component Testing**
```typescript
// Test component behavior
describe('EventItem Component', () => {
  it('renders event information correctly', () => {
    const event: GameEvent = {
      id: '1',
      type: 'goal',
      team: 'us',
      label: 'Test Goal',
      gameTime: '15:30',
      timestamp: Date.now()
    };

    render(<EventItem event={event} onEdit={jest.fn()} />);
    
    expect(screen.getByText('Test Goal')).toBeInTheDocument();
    expect(screen.getByText('15:30')).toBeInTheDocument();
  });
});
```

## 📝 **Documentation Standards** (@skills:doc-coauthoring)

### **Code Comments**
```typescript
/**
 * Enhanced game store with timer invocation and historical editing
 * 
 * Features:
 * - Smart timer invocation with multiple triggers
 * - Historical match editing capabilities
 * - Enhanced export functionality
 * 
 * @example
 * ```typescript
 * const { startTimerWithConfirmation } = useGameStore();
 * await startTimerWithConfirmation();
 * ```
 * 
 * @since 1.0.0
 */
export const useGameStore = create<GameState>((set, get) => ({
  // Store implementation
}));
```

### **Function Documentation**
```typescript
/**
 * Calculates match statistics from event data
 * 
 * @param events - Array of game events
 * @returns Object containing calculated statistics
 * 
 * @example
 * ```typescript
 * const stats = calculateMatchStats(events);
 * console.log(stats.ourGoals); // 3
 * ```
 */
export const calculateMatchStats = (events: GameEvent[]) => {
  const ourGoals = events.filter(e => e.type === 'goal' && e.team === 'us').length;
  const theirGoals = events.filter(e => e.type === 'goal' && e.team === 'them').length;
  
  return {
    ourGoals,
    theirGoals,
    goalDifference: ourGoals - theirGoals,
    totalEvents: events.length
  };
};
```

## 🔧 **File Organization**

### **Directory Structure**
```
src/
├── components/
│   ├── game/
│   │   ├── ScoreBoard.tsx
│   │   ├── EventItem.tsx
│   │   └── ActionGrid.tsx
│   ├── layout/
│   │   ├── Shell.tsx
│   │   └── Header.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Modal.tsx
├── hooks/
│   ├── useGameTimer.ts
│   ├── useGestureDetection.ts
│   └── useGameStore.ts
├── store/
│   ├── gameStore.ts
│   └── types.ts
├── utils/
│   ├── export.ts
│   └── date.ts
└── constants/
    ├── events.js
    └── teams.js
```

### **File Naming**
- **Components**: PascalCase (ScoreBoard.tsx)
- **Hooks**: camelCase with use prefix (useGameTimer.ts)
- **Utilities**: camelCase (exportUtils.ts)
- **Constants**: UPPER_SNAKE_CASE (EVENT_TYPES.js)
- **Types**: PascalCase (GameEvent.ts)

## 🚀 **Performance Standards**

### **React Optimization**
```typescript
// Use React.memo for expensive components
export const EventList = React.memo<EventListProps>(({ events, onEdit }) => {
  return (
    <div className="event-list">
      {events.map(event => (
        <EventItem key={event.id} event={event} onEdit={onEdit} />
      ))}
    </div>
  );
});

// Use useMemo for expensive calculations
const processedEvents = useMemo(() => {
  return events.map(event => ({
    ...event,
    processed: processEventData(event)
  }));
}, [events]);

// Use useCallback for stable function references
const handleEventEdit = useCallback((event: GameEvent) => {
  onEdit(event);
}, [onEdit]);
```

### **Bundle Optimization**
```typescript
// Lazy load heavy components
const LazyAnalytics = React.lazy(() => import('./Analytics'));

// Code splitting for routes
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<ActiveGame />} />
      <Route path="/analytics" element={<LazyAnalytics />} />
    </Routes>
  </Router>
);
```

## 📊 **Quality Assurance**

### **Code Review Checklist**
- [ ] TypeScript strict mode compliance
- [ ] No implicit any types
- [ ] Proper error handling
- [ ] Descriptive variable names
- [ ] Single responsibility principle
- [ ] Consistent formatting
- [ ] Unit tests for critical logic
- [ ] Accessibility compliance

### **ESLint Configuration**
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/exhaustive-deps": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

---

*Standards maintained with @skills:typescript-expert, @skills:javascript-mastery, and @skills:doc-coauthoring*
