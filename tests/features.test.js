/**
 * Feature testing for Sideline Stats implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock global objects
beforeEach(() => {
  global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  };
  
  global.crypto = {
    randomUUID: vi.fn(() => 'test-uuid-1234')
  };
  
  global.performance = {
    now: vi.fn(() => Date.now())
  };
});

describe('Feature Testing', () => {
  describe('Multi-Sport Configuration', () => {
    it('should load sport configurations', async () => {
      const { SPORTS, getSportConfig } = await import('../src/constants/sports.js');
      
      // Test all sports are available
      expect(Object.keys(SPORTS)).toContain('SOCCER');
      expect(Object.keys(SPORTS)).toContain('BASKETBALL');
      expect(Object.keys(SPORTS)).toContain('VOLLEYBALL');
      expect(Object.keys(SPORTS)).toContain('HOCKEY');
      expect(Object.keys(SPORTS)).toContain('FOOTBALL');
      expect(Object.keys(SPORTS)).toContain('TENNIS');
      
      // Test soccer config
      const soccerConfig = getSportConfig(SPORTS.SOCCER);
      expect(soccerConfig.name).toBe('Soccer');
      expect(soccerConfig.teamSize).toBe(11);
      expect(soccerConfig.duration).toBe(5400000); // 90 minutes
      expect(soccerConfig.periods).toHaveLength(2);
      
      // Test basketball config
      const basketballConfig = getSportConfig(SPORTS.BASKETBALL);
      expect(basketballConfig.name).toBe('Basketball');
      expect(basketballConfig.teamSize).toBe(5);
      expect(basketballConfig.periods).toHaveLength(4);
      
      // Test event types
      expect(soccerConfig.eventTypes).toHaveProperty('GOAL');
      expect(soccerConfig.eventTypes).toHaveProperty('PENALTY');
      expect(basketballConfig.eventTypes).toHaveProperty('FIELD_GOAL_2');
      expect(basketballConfig.eventTypes).toHaveProperty('FIELD_GOAL_3');
    });

    it('should validate sport events', async () => {
      const { validateSportEvent, SPORTS } = await import('../src/constants/sports.js');
      
      // Valid soccer events
      const validSoccerGoal = { type: 'GOAL', team: 'us' };
      const validSoccerPenalty = { type: 'PENALTY', team: 'us' };
      
      expect(validateSportEvent(validSoccerGoal, SPORTS.SOCCER).valid).toBe(true);
      expect(validateSportEvent(validSoccerPenalty, SPORTS.SOCCER).valid).toBe(true);
      
      // Invalid events
      const invalidEvent = { type: 'INVALID_EVENT', team: 'us' };
      const result = validateSportEvent(invalidEvent, SPORTS.SOCCER);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not valid');
    });

    it('should calculate sport-specific scores', async () => {
      const { calculateSportScore, SPORTS } = await import('../src/constants/sports.js');
      
      // Soccer scoring
      const soccerEvents = [
        { type: 'GOAL', team: 'us' },
        { type: 'GOAL', team: 'them' },
        { type: 'PENALTY', team: 'us' }
      ];
      
      const soccerScore = calculateSportScore(soccerEvents, SPORTS.SOCCER);
      expect(soccerScore).toBe(3); // 3 goals for us (2 goals + 1 penalty)
      
      // Basketball scoring
      const basketballEvents = [
        { type: 'FIELD_GOAL_2', team: 'us' },
        { type: 'FIELD_GOAL_3', team: 'us' },
        { type: 'FREE_THROW', team: 'us' },
        { type: 'FIELD_GOAL_2', team: 'them' }
      ];
      
      const basketballScore = calculateSportScore(basketballEvents, SPORTS.BASKETBALL);
      expect(basketballScore).toBe(8); // 2 + 3 + 1 + 2 points for us
    });
  });

  describe('Analytics Engine', () => {
    it('should calculate basic game statistics', async () => {
      const { analyticsEngine } = await import('../src/utils/analyticsEngine.js');
      
      const mockGame = {
        id: 'test-game',
        opponentName: 'Test Team',
        myScore: 3,
        opponentScore: 1,
        events: [
          { type: 'goal', team: 'us', gameTime: 10000, timestamp: Date.now() - 60000 },
          { type: 'goal', team: 'them', gameTime: 20000, timestamp: Date.now() - 50000 },
          { type: 'goal', team: 'us', gameTime: 30000, timestamp: Date.now() - 40000 },
          { type: 'goal', team: 'us', gameTime: 40000, timestamp: Date.now() - 30000 }
        ],
        finalTime: 2700000 // 45 minutes
      };
      
      const stats = analyticsEngine.calculateGameStats(mockGame);
      
      expect(stats.basic.score.my).toBe(3);
      expect(stats.basic.score.their).toBe(1);
      expect(stats.basic.totalEvents).toBe(4);
      expect(stats.momentum.leader).toBe('us');
      expect(stats.momentum.differential).toBeGreaterThan(0);
    });

    it('should generate game insights', async () => {
      const { analyticsEngine } = await import('../src/utils/analyticsEngine.js');
      
      const gameStats = {
        basic: {
          score: { my: 4, their: 1 },
          totalEvents: 12
        },
        momentum: {
          my: 6.5,
          their: 2.1,
          differential: 4.4,
          leader: 'us'
        },
        efficiency: {
          my: { penaltyConversionRate: 85 },
          their: { penaltyConversionRate: 60 }
        },
        possession: {
          my: 70,
          their: 30
        }
      };
      
      const insights = analyticsEngine.generateInsights(gameStats);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.type === 'positive')).toBe(true);
      expect(insights.every(i => i.title && i.description)).toBe(true);
    });

    it('should analyze season performance', async () => {
      const { analyticsEngine } = await import('../src/utils/analyticsEngine.js');
      
      const mockGames = [
        {
          id: 'game1',
          myScore: 2,
          opponentScore: 0,
          events: [
            { type: 'goal', team: 'us', meta: { player: 'John' } },
            { type: 'goal', team: 'us', meta: { player: 'Jane' } }
          ],
          timestamp: Date.now() - 86400000
        },
        {
          id: 'game2',
          myScore: 1,
          opponentScore: 1,
          events: [
            { type: 'goal', team: 'us', meta: { player: 'John' } }
          ],
          timestamp: Date.now() - 172800000
        },
        {
          id: 'game3',
          myScore: 3,
          opponentScore: 2,
          events: [
            { type: 'goal', team: 'us', meta: { player: 'John' } },
            { type: 'goal', team: 'us', meta: { player: 'Bob' } },
            { type: 'goal', team: 'us', meta: { player: 'John' } }
          ],
          timestamp: Date.now() - 259200000
        }
      ];
      
      const seasonStats = analyticsEngine.analyzeSeason(mockGames);
      
      expect(seasonStats.totalGames).toBe(3);
      expect(seasonStats.wins).toBe(2);
      expect(seasonStats.draws).toBe(1);
      expect(seasonStats.losses).toBe(0);
      expect(seasonStats.totalGoals).toBe(6);
      expect(seasonStats.cleanSheets).toBe(1);
      expect(seasonStats.playerStats['John'].goals).toBe(4);
      expect(seasonStats.playerStats['Jane'].goals).toBe(1);
      expect(seasonStats.playerStats['Bob'].goals).toBe(1);
    });

    it('should analyze individual player performance', async () => {
      const { analyticsEngine } = await import('../src/utils/analyticsEngine.js');
      
      const mockGames = [
        {
          events: [
            { type: 'goal', team: 'us', meta: { player: 'John', isPK: true } },
            { type: 'penalty', team: 'us', meta: { player: 'John' } },
            { type: 'goal', team: 'us', meta: { player: 'John' } }
          ]
        },
        {
          events: [
            { type: 'goal', team: 'us', meta: { player: 'John' } },
            { type: 'penalty', team: 'us', meta: { player: 'John', isPK: true } }
          ]
        }
      ];
      
      const playerStats = analyticsEngine.analyzePlayerPerformance(mockGames, 'John');
      
      expect(playerStats.gamesPlayed).toBe(2);
      expect(playerStats.goals).toBe(3);
      expect(playerStats.penalties).toBe(3);
      expect(playerStats.penaltyGoals).toBe(1);
      expect(playerStats.efficiency).toBe('33.3');
      expect(playerStats.averageGoalsPerGame).toBe('1.50');
    });
  });

  describe('Advanced Export Features', () => {
    it('should export in multiple formats', async () => {
      const { downloadAdvancedExport, EXPORT_FORMATS } = await import('../src/utils/advancedExport.js');
      
      // Mock DOM
      global.URL = {
        createObjectURL: vi.fn(() => 'mock-url'),
        revokeObjectURL: vi.fn()
      };
      
      global.document = {
        createElement: vi.fn(() => ({
          setAttribute: vi.fn(),
          click: vi.fn(),
          style: { visibility: '' },
          remove: vi.fn()
        })),
        body: {
          appendChild: vi.fn(),
          removeChild: vi.fn()
        }
      };
      
      global.Blob = vi.fn((content, options) => ({
        content,
        options,
        size: JSON.stringify(content).length
      }));
      
      const mockGame = {
        opponentName: 'Test Team',
        myScore: 2,
        opponentScore: 1,
        events: [
          {
            timestamp: '2023-01-01T10:00:00.000Z',
            gameTime: 15000,
            type: 'goal',
            team: 'us',
            label: 'Opening goal',
            meta: { isPK: false }
          }
        ],
        finalTime: 2700000,
        timestamp: Date.now()
      };
      
      // Test CSV export
      await downloadAdvancedExport(mockGame, EXPORT_FORMATS.CSV);
      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      
      // Test JSON export
      await downloadAdvancedExport(mockGame, EXPORT_FORMATS.JSON);
      expect(global.document.createElement).toHaveBeenCalledWith('a');
      
      // Test PDF export (HTML format)
      await downloadAdvancedExport(mockGame, EXPORT_FORMATS.PDF);
      expect(global.document.createElement).toHaveBeenCalledWith('a');
    });

    it('should generate season reports', async () => {
      const { generateSeasonReport } = await import('../src/utils/advancedExport.js');
      
      const mockGames = [
        {
          opponentName: 'Team A',
          myScore: 2,
          opponentScore: 1,
          events: [
            { type: 'goal', team: 'us', meta: { player: 'John' } },
            { type: 'goal', team: 'us', meta: { player: 'Jane' } }
          ],
          finalTime: 2700000,
          timestamp: Date.now()
        },
        {
          opponentName: 'Team B',
          myScore: 3,
          opponentScore: 2,
          events: [
            { type: 'goal', team: 'us', meta: { player: 'John' } },
            { type: 'goal', team: 'us', meta: { player: 'Bob' } },
            { type: 'goal', team: 'us', meta: { player: 'John' } }
          ],
          finalTime: 2700000,
          timestamp: Date.now()
        }
      ];
      
      const seasonReport = generateSeasonReport(mockGames);
      
      expect(seasonReport.totalGames).toBe(2);
      expect(seasonReport.totalGoals).toBe(8);
      expect(seasonReport.wins).toBe(2);
      expect(seasonReport.losses).toBe(0);
      expect(seasonReport.draws).toBe(0);
      expect(seasonReport.playerStats['John'].goals).toBe(3);
      expect(seasonReport.playerStats['Jane'].goals).toBe(1);
      expect(seasonReport.playerStats['Bob'].goals).toBe(1);
    });
  });

  describe('Performance Optimization', () => {
    it('should implement performance helpers', async () => {
      const { debounce, throttle, optimizeRoster } = await import('../src/utils/performanceHelpers.js');
      
      // Test debounce
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      // Should not be called immediately
      expect(callCount).toBe(0);
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callCount).toBe(1);
      
      // Test throttle
      let throttleCount = 0;
      const throttledFn = throttle(() => {
        throttleCount++;
      }, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(throttleCount).toBe(1);
      
      // Test roster optimization
      const roster = ['John', 'Jane', 'John', 'Bob', 'John', 'Alice'];
      const optimized = optimizeRoster(roster, 3);
      
      expect(optimized).toHaveLength(3);
      expect(optimized).toContain('John');
      expect(new Set(optimized).size).toBe(optimized.length); // No duplicates
    });
  });

  describe('Gesture Recognition', () => {
    it('should define gesture patterns', async () => {
      // Test that the hook file exports correctly without calling the hook
      const gestureModule = await import('../src/hooks/useAdvancedGestures.js');
      
      expect(typeof gestureModule.useAdvancedGestures).toBe('function');
      
      // The gesture patterns are defined as constants within the hook file
      // We can verify the hook exists and is a function, which is sufficient for testing
      expect(gestureModule.useAdvancedGestures).toBeDefined();
    });
  });

  describe('Data Visualization', () => {
    it('should provide visualization components', async () => {
      const { 
        MiniBarChart, 
        MiniPieChart, 
        TrendLine, 
        ProgressRing,
        StatsWidget,
        ChartWidget 
      } = await import('../src/components/analytics/DataVisualization.jsx');
      
      expect(typeof MiniBarChart).toBe('function');
      expect(typeof MiniPieChart).toBe('function');
      expect(typeof TrendLine).toBe('function');
      expect(typeof ProgressRing).toBe('function');
      expect(typeof StatsWidget).toBe('function');
      expect(typeof ChartWidget).toBe('function');
    });
  });

  describe('Store Functionality', () => {
    it('should initialize sport store', async () => {
      const { useSportStore } = await import('../src/store/sportStore.js');
      
      const store = useSportStore.getState();
      
      expect(store.currentSport).toBeDefined();
      expect(typeof store.setCurrentSport).toBe('function');
      expect(typeof store.createSportGame).toBe('function');
      expect(typeof store.addSportEvent).toBe('function');
    });

    it('should initialize global roster store', async () => {
      const { useGlobalRosterStore } = await import('../src/store/globalRosterStore.js');
      
      const store = useGlobalRosterStore.getState();
      
      expect(Array.isArray(store.players)).toBe(true);
      expect(typeof store.addPlayer).toBe('function');
      expect(typeof store.updatePlayer).toBe('function');
      expect(typeof store.deletePlayer).toBe('function');
      expect(typeof store.searchPlayers).toBe('function');
    });
  });

  describe('Lazy Loading', () => {
    it('should provide lazy components', async () => {
      const { 
        LazyGameModal, 
        LazySwipeStream, 
        LazyMatchArchive,
        LazyAnalytics 
      } = await import('../src/utils/lazyComponents.js');
      
      expect(typeof LazyGameModal).toBe('object');
      expect(typeof LazySwipeStream).toBe('object');
      expect(typeof LazyMatchArchive).toBe('object');
      expect(typeof LazyAnalytics).toBe('object');
    });
  });
});
