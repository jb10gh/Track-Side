# ADR-023: Integrated Testing Framework

## Status
**Medium** - Quality Assurance Enhancement

## Context
The app lacks robust testing infrastructure to prevent regression of core functionality. With the implementation of multiple ADRs, there's a critical need for comprehensive testing to ensure features work correctly and don't break existing functionality.

## Problem
- No automated testing for core functionality
- No regression prevention system
- Manual testing only, time-consuming
- No quality assurance metrics
- Risk of breaking features during updates

## Decision
Implement a comprehensive, integrated testing framework using Windsurf skills for automated testing, continuous validation, and regression prevention.

## Implementation Plan

### Phase 1: Testing Architecture
1. **Testing Framework Setup**
   ```javascript
   // tests/setup.js - Enhanced test setup
   import '@testing-library/jest-dom';
   import { configure } from '@testing-library/react';
   import { server } from './mocks/server';

   // Configure testing library
   configure({ testIdAttribute: 'data-testid' });

   // Mock API calls
   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());

   // Global test utilities
   global.testUtils = {
     createMockGame: () => ({
       id: 'test-game-1',
       opponentName: 'Test FC',
       myScore: 2,
       opponentScore: 1,
       events: [
         { id: 1, type: 'goal', team: 'us', gameTime: '00:25', label: 'John' },
         { id: 2, type: 'goal', team: 'them', gameTime: '00:45', label: 'Player' }
       ],
       status: 'active',
       timestamp: Date.now()
     }),
     
     createMockRoster: () => [
       { id: 1, name: 'John Doe', number: 10 },
       { id: 2, name: 'Jane Smith', number: 7 }
     ]
   };
   ```

2. **Test Categories Definition**
   ```javascript
   // tests/categories.js
   export const TEST_CATEGORIES = {
     // Critical functionality tests
     CRITICAL: {
       priority: 'high',
       timeout: 5000,
       retry: 3,
       tags: ['critical', 'regression']
     },
     
     // User interaction tests
     INTERACTION: {
       priority: 'medium',
       timeout: 3000,
       retry: 2,
       tags: ['ux', 'interaction']
     },
     
     // Visual regression tests
     VISUAL: {
       priority: 'medium',
       timeout: 10000,
       retry: 1,
       tags: ['visual', 'regression']
     },
     
     // Performance tests
     PERFORMANCE: {
       priority: 'low',
       timeout: 15000,
       retry: 1,
       tags: ['performance', 'metrics']
     }
   };
   ```

### Phase 2: Core Functionality Tests
1. **Game Flow Testing**
   ```javascript
   // tests/core/game-flow.test.js
   import { render, screen, fireEvent, waitFor } from '@testing-library/react';
   import { GameProvider } from '../../store/gameStore';
   import ActiveGame from '../../pages/ActiveGame';

   describe('Game Flow - Critical Functionality', () => {
     const mockGame = global.testUtils.createMockGame();
     
     test('should start new game successfully', async () => {
       render(
         <GameProvider>
           <ActiveGame />
         </GameProvider>
       );
       
       // Test game initialization
       expect(screen.getByTestId('game-header')).toBeInTheDocument();
       expect(screen.getByTestId('score-display')).toBeInTheDocument();
       expect(screen.getByTestId('timer-display')).toBeInTheDocument();
     });
     
     test('should add goal events correctly', async () => {
       render(
         <GameProvider>
           <ActiveGame />
         </GameProvider>
       );
       
       const addGoalButton = screen.getByTestId('add-goal-our-team');
       fireEvent.click(addGoalButton);
       
       await waitFor(() => {
         expect(screen.getByTestId('our-score')).toHaveTextContent('1');
       });
     });
     
     test('should end game functionality', async () => {
       render(
         <GameProvider>
           <ActiveGame />
         </GameProvider>
       );
       
       const endButton = screen.getByTestId('end-game-button');
       fireEvent.click(endButton);
       
       // Test confirmation modal
       expect(screen.getByTestId('end-game-confirmation')).toBeInTheDocument();
       
       const confirmButton = screen.getByTestId('confirm-end-game');
       fireEvent.click(confirmButton);
       
       await waitFor(() => {
         expect(screen.getByTestId('game-completed')).toBeInTheDocument();
       });
     });
     
     test('should delete events correctly', async () => {
       const { getByTestId, queryByTestId } = render(
         <GameProvider>
           <ActiveGame />
         </GameProvider>
       );
       
       // Add an event first
       const addGoalButton = getByTestId('add-goal-our-team');
       fireEvent.click(addGoalButton);
       
       // Find and delete the event
       const deleteButton = getByTestId('delete-event-1');
       fireEvent.click(deleteButton);
       
       // Confirm deletion
       const confirmDelete = getByTestId('confirm-delete-event');
       fireEvent.click(confirmDelete);
       
       await waitFor(() => {
         expect(queryByTestId('event-1')).not.toBeInTheDocument();
       });
     });
   });
   ```

2. **Export Functionality Tests**
   ```javascript
   // tests/core/export-functionality.test.js
   import { generateBeautifulExport, generateEnhancedCSV } from '../../utils/export';
   import { nativeEmailService } from '../../services/nativeEmailService';

   describe('Export Functionality - Critical Tests', () => {
     const mockGame = global.testUtils.createMockGame();
     const productionUrl = 'https://track-side.vercel.app';
     
     test('should generate beautiful export format', () => {
       const export = generateBeautifulExport(mockGame, null, productionUrl);
       
       // Test required elements
       expect(export).toContain('📊 MATCH SUMMARY');
       expect(export).toContain('═══════════════════════════');
       expect(export).toContain('🏆 Match: Our Team vs Test FC');
       expect(export).toContain('⚡ Our Team: 2, Opponent: 1');
       expect(export).toContain('📅 Date:');
       expect(export).toContain('⏱️ Duration:');
       expect(export).toContain('📝 Events: 2 total');
       expect(export).toContain('📋 EVENT TIMELINE');
       expect(export).toContain('🌐 View Live: https://track-side.vercel.app');
       expect(export).toContain('Generated by Track Side App');
     });
     
     test('should generate CSV with correct structure', () => {
       const csv = generateEnhancedCSV(mockGame, productionUrl);
       
       expect(csv).toContain('Match Summary');
       expect(csv).toContain('Opponent,Test FC');
       expect(csv).toContain('Final Score,2-1');
       expect(csv).toContain('Production URL,https://track-side.vercel.app');
       expect(csv).toContain('Event Timeline');
     });
     
     test('should send email with correct format', async () => {
       const emailContent = await nativeEmailService.generateEmail(mockGame);
       
       expect(emailContent.subject).toContain('Track Side: Our Team 2-1 Test FC');
       expect(emailContent.body).toContain('📊 MATCH SUMMARY');
       expect(emailContent.body).toContain('🌐 View Live: https://track-side.vercel.app');
     });
   });
   ```

### Phase 3: UI/UX Testing
1. **Component Integration Tests**
   ```javascript
   // tests/components/button-system.test.js
   import { render, screen } from '@testing-library/react';
   import { Button } from '../../components/ui/Button';
   import userEvent from '@testing-library/user-event';

   describe('Button Component - Visual Consistency', () => {
     test('should render consistent styles across variants', () => {
       const variants = ['primary', 'secondary', 'ghost', 'danger'];
       const sizes = ['sm', 'md', 'lg'];
       
       variants.forEach(variant => {
         sizes.forEach(size => {
           const { container } = render(
             <Button variant={variant} size={size}>
               Test Button
             </Button>
           );
           
           const button = container.firstChild;
           expect(button).toHaveClass(`btn-${variant}`);
           expect(button).toHaveClass(`btn-${size}`);
         });
       });
     });
     
     test('should handle click events consistently', async () => {
       const user = userEvent.setup();
       const handleClick = jest.fn();
       
       render(
         <Button onClick={handleClick}>Click me</Button>
       );
       
       const button = screen.getByRole('button');
       await user.click(button);
       
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
   });
   ```

2. **Roster Integration Tests**
   ```javascript
   // tests/components/roster-integration.test.js
   import { render, screen } from '@testing-library/react';
   import { useRosterStore } from '../../store/rosterStore';
   import SquadRoster from '../../components/roster/SquadRoster';

   describe('Roster Integration - Functionality Tests', () => {
     beforeEach(() => {
       useRosterStore.getState().setRoster([]);
     });
     
     test('should add player to roster', async () => {
       render(<SquadRoster />);
       
       const input = screen.getByPlaceholderText('Add player name...');
       const addButton = screen.getByRole('button', { name: /add/i });
       
       await userEvent.type(input, 'John Doe');
       await userEvent.click(addButton);
       
       expect(screen.getByText('John Doe')).toBeInTheDocument();
     });
     
     test('should edit player name', async () => {
       const { roster } = useRosterStore.getState();
       roster.push({ id: 1, name: 'John Doe' });
       
       render(<SquadRoster />);
       
       const editButton = screen.getByRole('button', { name: /edit/i });
       await userEvent.click(editButton);
       
       const input = screen.getByDisplayValue('John Doe');
       await userEvent.clear(input);
       await userEvent.type(input, 'Jane Smith');
       await userEvent.tab(); // Blur to save
       
       expect(screen.getByText('Jane Smith')).toBeInTheDocument();
     });
   });
   ```

### Phase 4: Automated Testing Pipeline
1. **Browser Automation Tests**
   ```javascript
   // tests/e2e/game-complete-flow.test.js
   import { test, expect } from '@playwright/test';

   test.describe('Complete Game Flow - E2E Tests', () => {
     test('should complete full game workflow', async ({ page }) => {
       await page.goto('http://localhost:5173');
       
       // Start new game
       await page.click('[data-testid="new-game-button"]');
       await page.fill('[data-testid="opponent-input"]', 'Test FC');
       await page.click('[data-testid="start-game-button"]');
       
       // Add some events
       await page.click('[data-testid="add-goal-our-team"]');
       await page.click('[data-testid="add-goal-opponent"]');
       await page.click('[data-testid="add-penalty-our-team"]');
       
       // Test timer functionality
       await page.click('[data-testid="start-timer"]');
       await page.waitForTimeout(2000);
       await page.click('[data-testid="pause-timer"]');
       
       // End game
       await page.click('[data-testid="end-game-button"]');
       await page.click('[data-testid="confirm-end-game"]');
       
       // Test export functionality
       await page.click('[data-testid="export-button"]');
       await page.click('[data-testid="copy-export"]');
       
       // Verify game completed
       await expect(page.locator('[data-testid="game-completed"]')).toBeVisible();
     });
   });
   ```

2. **Performance Testing**
   ```javascript
   // tests/performance/app-performance.test.js
   import { test, expect } from '@playwright/test';

   test.describe('Performance Tests', () => {
     test('should load within performance budgets', async ({ page }) => {
       const startTime = Date.now();
       await page.goto('http://localhost:5173');
       const loadTime = Date.now() - startTime;
       
       expect(loadTime).toBeLessThan(3000); // 3 second load budget
     });
     
     test('should handle large event lists efficiently', async ({ page }) => {
       await page.goto('http://localhost:5173');
       
       // Add many events
       for (let i = 0; i < 50; i++) {
         await page.click('[data-testid="add-goal-our-team"]');
       }
       
       // Test scrolling performance
       const startTime = Date.now();
       await page.evaluate(() => {
         document.querySelector('[data-testid="events-list"]').scrollTop = 1000;
       });
       const scrollTime = Date.now() - startTime;
       
       expect(scrollTime).toBeLessThan(100); // 100ms scroll budget
     });
   });
   ```

### Phase 5: Quality Assurance Dashboard
1. **Test Results Dashboard**
   ```jsx
   // components/testing/TestDashboard.jsx
   import React, { useState, useEffect } from 'react';
   
   const TestDashboard = () => {
     const [testResults, setTestResults] = useState({
       critical: { passed: 0, failed: 0, total: 0 },
       interaction: { passed: 0, failed: 0, total: 0 },
       visual: { passed: 0, failed: 0, total: 0 },
       performance: { passed: 0, failed: 0, total: 0 }
     });
     
     const runTests = async () => {
       // Run test suites and collect results
       const results = await fetch('/api/test-results').then(r => r.json());
       setTestResults(results);
     };
     
     useEffect(() => {
       runTests();
     }, []);
     
     return (
       <div className="test-dashboard">
         <h2>Quality Assurance Dashboard</h2>
         
         <div className="test-categories">
           <div className="test-category critical">
             <h3>Critical Tests</h3>
             <div className="test-metrics">
               <span className="passed">{testResults.critical.passed}</span>
               <span className="failed">{testResults.critical.failed}</span>
               <span className="total">/ {testResults.critical.total}</span>
             </div>
           </div>
           
           {/* Other categories */}
         </div>
         
         <button onClick={runTests} className="run-tests-btn">
           Run All Tests
         </button>
       </div>
     );
   };
   ```

2. **Continuous Monitoring**
   ```javascript
   // utils/test-monitoring.js
   export class TestMonitor {
     constructor() {
       this.metrics = {
         testCoverage: 0,
         criticalTestsPassing: 0,
         performanceScore: 0,
         lastRun: null
       };
     }
     
     async runHealthCheck() {
       const results = await this.runTestSuite();
       this.updateMetrics(results);
       this.alertOnFailures(results);
       
       return results;
     }
     
     updateMetrics(results) {
       this.metrics = {
         testCoverage: this.calculateCoverage(results),
         criticalTestsPassing: this.calculateCriticalPassRate(results),
         performanceScore: this.calculatePerformanceScore(results),
         lastRun: new Date()
       };
     }
     
     alertOnFailures(results) {
       const criticalFailures = results.critical.failed;
       if (criticalFailures > 0) {
         console.error(`🚨 Critical test failures: ${criticalFailures}`);
         // Send alert to monitoring system
       }
     }
   }
   ```

## Technical Specifications

### Testing Stack
```
Unit Tests: Jest + React Testing Library
E2E Tests: Playwright
Visual Tests: Playwright + Screenshots
Performance Tests: Lighthouse CI
Integration Tests: Jest + MSW
```

### Test Organization
```
tests/
├── unit/              # Component unit tests
├── integration/       # Component integration tests
├── e2e/              # End-to-end tests
├── visual/           # Visual regression tests
├── performance/      # Performance tests
├── mocks/            # Mock data and handlers
└── utils/            # Test utilities
```

### Quality Gates
```javascript
const QUALITY_GATES = {
  criticalTests: { minPassRate: 100 }, // All critical tests must pass
  overallTests: { minPassRate: 95 },   // 95% overall pass rate
  performance: { maxLoadTime: 3000 },  // 3 second max load time
  coverage: { minCoverage: 80 }        // 80% code coverage
};
```

## Testing Requirements

### Critical Functionality Tests
- Game start/end flow
- Event creation/deletion
- Score calculation
- Export functionality
- Data persistence

### User Experience Tests
- Button consistency
- Visual hierarchy
- Mobile responsiveness
- Accessibility compliance
- Performance metrics

### Regression Tests
- Visual consistency
- API integration
- State management
- Cross-browser compatibility
- Device compatibility

## Success Metrics

### Testing Coverage
- ✅ 95%+ overall test coverage
- ✅ 100% critical functionality coverage
- ✅ 80%+ component coverage
- ✅ 60%+ integration coverage

### Quality Metrics
- ✅ Zero critical test failures
- ✅ <5% overall test failure rate
- ✅ <3s page load time
- ✅ 100% accessibility compliance

### Automation Goals
- ✅ Automated test execution on PR
- ✅ Automated deployment on test success
- ✅ Continuous monitoring in production
- ✅ Automated regression detection

## Risk Assessment

### Technical Risks
- **Test Maintenance**: Regular updates needed
- **Performance Impact**: Optimize test execution
- **False Positives**: Reliable test assertions
- **Coverage Gaps**: Comprehensive test planning

### Operational Risks
- **Test Environment**: Stable test setup
- **CI/CD Integration**: Reliable pipeline
- **Monitoring**: Effective alerting
- **Team Adoption**: Training and documentation

## Implementation Timeline

### Week 1: Foundation
- Day 1-2: Test framework setup
- Day 3-4: Critical functionality tests
- Day 5: CI/CD integration

### Week 2: Expansion
- Day 1-3: UI/UX and integration tests
- Day 4-5: E2E and performance tests

### Week 3: Automation
- Day 1-3: Quality dashboard and monitoring
- Day 4-5: Documentation and team training

## Dependencies

### Required Tools
- Jest for unit/integration tests
- Playwright for E2E tests
- Lighthouse CI for performance
- MSW for API mocking
- Testing Library for component tests

### Infrastructure
- CI/CD pipeline integration
- Test environment setup
- Monitoring and alerting
- Documentation and training

## Alternatives Considered

### Option 1: Manual Testing Only
- **Pros**: No setup cost
- **Cons**: Time-consuming, error-prone
- **Rejected**: Insufficient for quality assurance

### Option 2: Basic Unit Tests
- **Pros**: Quick implementation
- **Cons**: Limited coverage
- **Rejected**: Doesn't prevent regression

### Option 3: Comprehensive Framework (Chosen)
- **Pros**: Complete quality assurance
- **Cons**: Implementation effort
- **Accepted**: Best long-term solution

## Conclusion

This ADR establishes a comprehensive testing framework that ensures robust quality assurance and prevents regression. The integrated approach using multiple testing strategies provides complete coverage of critical functionality while maintaining development velocity through automation and continuous monitoring.

**Status**: Ready for implementation
**Priority**: Medium
**Expected Timeline**: 2-3 weeks
**Success Criteria**: Comprehensive testing framework with 95%+ coverage, automated execution, and continuous monitoring to prevent regression.
