# ADR-017: Documentation Stack Refactoring

## Status
Proposed

## Context
The current documentation structure has grown organically and lacks systematic organization, skill integration, and context optimization for Windsurf AI assistance. The documentation needs to be refactored to provide the best possible context for AI agents while leveraging all available skills for consistent, high-quality documentation maintenance.

### Current Documentation Issues
1. **Scattered Structure**: Documentation spread across multiple directories without clear hierarchy
2. **Missing Skill Integration**: No explicit @skills: directives for Windsurf AI assistance
3. **Inconsistent Formatting**: Mixed documentation styles and templates
4. **Context Gaps**: Important architectural decisions not easily discoverable
5. **Maintenance Overhead**: Difficult to keep documentation synchronized with code changes
6. **Skill Underutilization**: Available .windsurf skills not leveraged for documentation tasks

### Available Skills Analysis
Based on .windsurf/skills/skills_index.json analysis, the following skills are relevant for documentation:

**Primary Documentation Skills:**
- `architecture` - Architectural decision-making framework
- `doc-coauthoring` - Structured documentation workflow
- `documentation-templates` - Template and structure guidelines
- `content-creator` - SEO-optimized content creation
- `context-window-management` - Context optimization strategies

**Supporting Skills:**
- `typescript-expert` - Technical documentation precision
- `ui-ux-pro-max` - Documentation design and user experience
- `javascript-mastery` - Code documentation best practices
- `agent-memory-mcp` - Persistent knowledge management

## Decision
Implement a **comprehensive documentation refactoring** that creates a hierarchical, skill-integrated documentation system optimized for Windsurf AI assistance with explicit @skills: directives and context optimization.

### Documentation Architecture Strategy

#### 1. Hierarchical Documentation Structure
```
.context/
├── README.md (Main entry point with @skills: directives)
├── 00-PROJECT-OVERVIEW/
│   ├── mission.md (@skills: content-creator)
│   ├── architecture.md (@skills: architecture)
│   └── tech-stack.md (@skills: typescript-expert)
├── 01-ARCHITECTURE-DECISIONS/
│   ├── README.md (@skills: doc-coauthoring)
│   ├── adr-index.md (@skills: documentation-templates)
│   └── [ADRs].md (@skills: architecture)
├── 02-IMPLEMENTATION-GUIDES/
│   ├── coding-standards.md (@skills: typescript-expert)
│   ├── component-patterns.md (@skills: ui-ux-pro-max)
│   └── state-management.md (@skills: javascript-mastery)
├── 03-USER-GUIDES/
│   ├── getting-started.md (@skills: content-creator)
│   ├── feature-guides.md (@skills: doc-coauthoring)
│   └── troubleshooting.md (@skills: documentation-templates)
├── 04-SKILLS-INTEGRATION/
│   ├── skills-mapping.md (@skills: agent-memory-mcp)
│   ├── context-optimization.md (@skills: context-window-management)
│   └── prompt-templates.md (@skills: content-creator)
└── 05-REFERENCE/
    ├── api-reference.md (@skills: documentation-templates)
    ├── component-library.md (@skills: ui-ux-pro-max)
    └── deployment-guide.md (@skills: architecture)
```

#### 2. Skill Integration Framework
Each documentation file will include explicit @skills: directives:

```markdown
---
@skills: architecture, doc-coauthoring, typescript-expert
context_priority: high
last_updated: 2024-01-26
maintainers: [ai-assistant, human-reviewer]
---

# Document Title

## AI Assistant Instructions
When working with this document, leverage:
- @skills:architecture for architectural decisions
- @skills:doc-coauthoring for structured content
- @skills:typescript-expert for technical accuracy

## Context Optimization
This document provides primary context for:
- System architecture understanding
- Implementation decision rationale
- Technical specification details
```

#### 3. Context Optimization Strategy
```javascript
// Context priority system
const CONTEXT_PRIORITIES = {
    'mission.md': 'critical',      // Core project purpose
    'architecture.md': 'critical', // System design foundation
    'adr-index.md': 'high',        // Decision history
    'coding-standards.md': 'high', // Implementation rules
    'component-patterns.md': 'medium', // UI patterns
    'troubleshooting.md': 'low'     // Support information
};

// Skill mapping for document types
const SKILL_MAPPING = {
    'architectural': ['architecture', 'typescript-expert'],
    'implementation': ['javascript-mastery', 'ui-ux-pro-max'],
    'user-facing': ['content-creator', 'doc-coauthoring'],
    'reference': ['documentation-templates', 'agent-memory-mcp']
};
```

### Implementation Plan

#### Phase 1: Structure Reorganization (Week 1)
1. **Create New Hierarchy**: Implement the 5-tier documentation structure
2. **Migrate Existing Content**: Move and categorize all existing documentation
3. **Establish Templates**: Create standardized templates with @skills: directives
4. **Context Mapping**: Define priority levels and skill mappings

#### Phase 2: Skill Integration (Week 2)
1. **Add @skills: Directives**: Update all files with explicit skill references
2. **Create Prompt Templates**: Standardize AI assistance prompts
3. **Context Optimization**: Implement priority-based context loading
4. **Skill Validation**: Ensure all referenced skills are available

#### Phase 3: Content Enhancement (Week 3)
1. **Apply Documentation Templates**: Use @skills:documentation-templates
2. **Improve Content Quality**: Leverage @skills:content-creator
3. **Add Visual Elements**: Use @skills:ui-ux-pro-max for better UX
4. **Technical Accuracy**: Apply @skills:typescript-expert precision

#### Phase 4: Maintenance System (Week 4)
1. **Automated Updates**: Create scripts for documentation synchronization
2. **Context Monitoring**: Implement @skills:context-window-management
3. **Quality Assurance**: Set up documentation review workflows
4. **Skill Integration Testing**: Validate @skills: directive functionality

## Consequences
- ✅ **Improved AI Context**: Better Windsurf assistance with explicit skill usage
- ✅ **Systematic Organization**: Clear hierarchy and discoverability
- ✅ **Consistent Quality**: Standardized templates and skill application
- ✅ **Maintainable Structure**: Clear maintenance and update workflows
- ✅ **Skill Optimization**: Full utilization of available .windsurf skills
- ⚠️ **Migration Effort**: Significant content reorganization required
- ⚠️ **Learning Curve**: Team needs to learn new documentation practices
- ⚠️ **Tool Dependencies**: Reliance on specific skill availability

## Success Metrics
- **Context Quality**: 90% of AI interactions use appropriate @skills: directives
- **Documentation Discoverability**: 80% reduction in time to find relevant information
- **Content Consistency**: 95% adherence to standardized templates
- **Skill Utilization**: All relevant .windsurf skills actively used in documentation

## Implementation Priority
**Priority**: HIGH
**Effort**: 4 weeks (1 week per phase)
**Dependencies**: None (can be implemented incrementally)
**Timeline**: Q1 2024 Documentation Overhaul

## Technical Requirements

### File Structure Standards
```markdown
---
@skills: [primary-skill, secondary-skill]
context_priority: [critical|high|medium|low]
document_type: [adr|guide|reference|overview]
last_updated: YYYY-MM-DD
reviewers: [human, ai-assistant]
---

# Document Title

## AI Assistant Instructions
[Specific instructions for AI assistants using @skills: directives]

## Context Scope
[What this document provides context for]

## Related Documents
[Links to related documentation with @skills: references]
```

### Skill Integration Template
```markdown
## Available Skills for This Document
- **@skills:architecture** - Use for architectural decisions and system design
- **@skills:doc-coauthoring** - Use for content structure and review
- **@skills:typescript-expert** - Use for technical accuracy and code examples

## AI Workflow
1. Analyze request using @skills:architecture for system impact
2. Structure content using @skills:doc-coauthoring framework
3. Validate technical details using @skills:typescript-expert
4. Review and optimize using @skills:content-creator
```

### Context Optimization Rules
```javascript
// Context loading priority
const LOAD_ORDER = [
    'critical',   // Mission, architecture
    'high',       // ADRs, standards
    'medium',     // Guides, patterns
    'low'         // Reference, troubleshooting
];

// Skill-based context enhancement
const enhanceContext = (document, skills) => {
    return skills.map(skill => ({
        ...document,
        skill_context: loadSkillContext(skill),
        enhanced_content: applySkillPatterns(document, skill)
    }));
};
```

## Testing Requirements
- **Skill Integration**: Verify all @skills: directives work correctly
- **Context Loading**: Test priority-based context system
- **Template Compliance**: Ensure all documents follow standards
- **AI Assistance**: Validate Windsurf AI can use skill directives effectively
- **Maintenance**: Test automated update and review workflows

## Future Enhancements
- **Dynamic Skill Loading**: Automatically load relevant skills based on content
- **Context Analytics**: Track which documentation provides most value
- **AI Collaboration**: Enable multi-skill AI assistance for complex tasks
- **Version Integration**: Link documentation to code versions automatically
- **Interactive Guides**: Create step-by-step guided documentation experiences

---

*This ADR establishes a comprehensive documentation refactoring approach that maximizes the value of available .windsurf skills while creating an optimal context system for AI-assisted development and maintenance.*
