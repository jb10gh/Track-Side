---
@skills: architecture, doc-coauthoring, ui-ux-pro-max, content-creator
context_priority: critical
document_type: adr
status: proposed
implementation_date: 2024-01-27
reviewers: [human, ai-assistant]
---

# ADR-022: Critical Workflow Assessment & ADR Restructuring

## Status
Proposed

## Context
Critical issues have been identified that require immediate attention:

1. **Emergency Incident**: Users starting new games are immediately taken into share workflow, blocking app usage
2. **ADR Structure Issues**: Current ADRs should have been split into multiple, more focused ADRs
3. **Documentation Gaps**: Need comprehensive assessment of all ADRs against implemented features
4. **Testing Requirements**: Full app testing needed to ensure workflow integrity
5. **Sharing Balance**: Need to entice/force sharing without blocking app functionality

### Critical Issues
- **Workflow Block**: Share workflow appears immediately on new game start
- **User Experience**: Users cannot actually use the app for tracking
- **ADR Granularity**: Current ADRs are too broad and should be split
- **Documentation Accuracy**: Need precise mapping between ADRs and actual implementation
- **Testing Coverage**: Full testing required to validate all workflows

### User Requirements
- **Fix Critical Workflow**: Ensure users can actually track games when starting new games
- **Restructure ADRs**: Split broad ADRs into focused, specific ADRs
- **Comprehensive Assessment**: Full review of all ADRs vs implemented features
- **Balanced Sharing**: Entice sharing without blocking core functionality
- **Crisp Documentation**: Clear, precise documentation that matches implementation

## 🤖 AI Assistant Instructions
**Primary Skills:**
- @skills:architecture for workflow analysis and ADR restructuring
- @skills:ui-ux-pro-max for user experience assessment and sharing strategy
- @skills:doc-coauthoring for comprehensive documentation review
- @skills:content-creator for precise, actionable documentation

## Decision
Conduct **comprehensive workflow assessment**, **restructure ADRs into focused documents**, **fix critical workflow issues**, and **create crisp documentation** that accurately reflects the implemented features.

### **Assessment Strategy**
1. **Full App Testing**: Test all workflows to identify issues
2. **ADR Audit**: Review all existing ADRs against implementation
3. **Workflow Analysis**: Map user journeys and identify blockers
4. **Feature Mapping**: Create precise feature-to-ADR mapping
5. **Documentation Review**: Ensure all docs match actual implementation

### **ADR Restructuring Strategy**
1. **Split Broad ADRs**: Break down complex ADRs into focused topics
2. **Create Specific ADRs**: Individual ADRs for specific features/workflows
3. **Maintain Traceability**: Ensure clear mapping between old and new ADRs
4. **Update References**: Update all documentation references
5. **Version Control**: Maintain ADR version history

### **Workflow Fix Strategy**
1. **Identify Root Cause**: Find why share workflow appears immediately
2. **Fix State Management**: Ensure proper state transitions
3. **Balance Sharing**: Entice sharing without blocking functionality
4. **User Testing**: Validate fixes with real user scenarios
5. **Performance Testing**: Ensure no performance regressions

## Consequences
- ✅ **Critical Issues Fixed**: Users can actually use the app for tracking
- ✅ **ADR Structure Improved**: Focused, specific ADRs for better maintainability
- ✅ **Documentation Accuracy**: Precise documentation matching implementation
- ✅ **User Experience**: Balanced sharing that doesn't block functionality
- ✅ **Testing Coverage**: Comprehensive testing of all workflows
- ⚠️ **Breaking Changes**: ADR restructuring may affect references
- ⚠️ **Documentation Updates**: Extensive documentation updates required
- ⚠️ **Testing Effort**: Comprehensive testing requires significant effort

## Success Metrics
- **100%** of users can start and track games without workflow blockers
- **0%** premature share workflow appearances
- **95%** ADR documentation accuracy with implementation
- **90%** user adoption of sharing features (when appropriate)
- **100%** workflow testing coverage

## Technical Implementation

### **Assessment Framework**
```typescript
interface WorkflowAssessment {
  criticalIssues: CriticalIssue[];
  adrMapping: ADRToFeatureMap;
  workflowAnalysis: WorkflowAnalysis;
  testingResults: TestResults;
}

interface CriticalIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  resolution: ResolutionPlan;
}

interface ADRToFeatureMap {
  [adrNumber: string]: {
    implemented: boolean;
    features: string[];
    gaps: string[];
    status: 'complete' | 'partial' | 'missing' | 'incorrect';
  };
}
```

### **ADR Restructuring Plan**
```typescript
// Current broad ADRs to split
const ADR_SPLITS = {
  'ADR-018': [
    'ADR-018-A: Match Screen Flow Fix',
    'ADR-018-B: Auto Email Export',
    'ADR-018-C: End Match Workflow'
  ],
  'ADR-019': [
    'ADR-019-A: Share Options Architecture',
    'ADR-019-B: Social Media Integration',
    'ADR-019-C: Email Sharing Enhancement',
    'ADR-019-D: File Export Options'
  ],
  'ADR-020': [
    'ADR-020-A: TrackSide Brand Identity',
    'ADR-020-B: Hot Pink Theme Implementation',
    'ADR-020-C: Dynamic Color System'
  ],
  'ADR-021': [
    'ADR-021-A: Theme Enhancement',
    'ADR-021-B: Workflow Fix',
    'ADR-021-C: Sharing Simplification',
    'ADR-021-D: Brand Integration'
  ]
};
```

### **Testing Strategy**
```typescript
interface TestSuite {
  workflowTests: WorkflowTest[];
  integrationTests: IntegrationTest[];
  userScenarioTests: UserScenarioTest[];
  performanceTests: PerformanceTest[];
}

interface WorkflowTest {
  name: string;
  scenario: string;
  expected: string;
  actual: string;
  status: 'pass' | 'fail' | 'pending';
}
```

---

*ADR maintained with @skills:architecture, @skills:ui-ux-pro-max, @skills:doc-coauthoring, and @skills:content-creator*
