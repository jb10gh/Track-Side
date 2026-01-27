---
@skills: architecture, doc-coauthoring, context-window-management
context_priority: critical
document_type: overview
last_updated: 2024-01-26
reviewers: [human, ai-assistant]
---

# 🗺️ Sideline Stats Documentation Index

## 🤖 AI Assistant Instructions
**Priority Skills:**
- Use @skills:architecture for system design decisions
- Apply @skills:doc-coauthoring for structured content creation
- Leverage @skills:context-window-management for optimal context loading

## 📂 Documentation Structure
When AI assistance is requested, load context in this priority order:

### 🎯 **Critical Context** (Load First)
- [**Mission & Vision**](00-PROJECT-OVERVIEW/mission.md) @skills:content-creator
- [**System Architecture**](00-PROJECT-OVERVIEW/architecture.md) @skills:architecture
- [**Technology Stack**](00-PROJECT-OVERVIEW/tech-stack.md) @skills:typescript-expert

### 📋 **High Priority Context**
- [**ADR Index**](01-ARCHITECTURE-DECISIONS/adr-index.md) @skills:documentation-templates
- [**All ADRs**](01-ARCHITECTURE-DECISIONS/) @skills:architecture
- [**Coding Standards**](02-IMPLEMENTATION-GUIDES/coding-standards.md) @skills:typescript-expert
- [**Component Patterns**](02-IMPLEMENTATION-GUIDES/component-patterns.md) @skills:ui-ux-pro-max
- [**State Management**](02-IMPLEMENTATION-GUIDES/state-management.md) @skills:javascript-mastery

### 📚 **Medium Priority Context**
- [**Getting Started**](03-USER-GUIDES/getting-started.md) @skills:content-creator
- [**Feature Guides**](03-USER-GUIDES/feature-guides.md) @skills:doc-coauthoring
- [**Implementation Guides**](02-IMPLEMENTATION-GUIDES/) @skills:typescript-expert
- [**Skills Integration**](04-SKILLS-INTEGRATION/) @skills:agent-memory-mcp

### 📖 **Low Priority Context**
- [**API Reference**](05-REFERENCE/api-reference.md) @skills:documentation-templates
- [**Component Library**](05-REFERENCE/component-library.md) @skills:ui-ux-pro-max
- [**Troubleshooting**](03-USER-GUIDES/troubleshooting.md) @skills:content-creator

## 🔍 Context Loading Strategy (@skills:context-window-management)
Use priority-based loading to optimize AI assistance:

1. **Critical** (0-2 tokens): Mission, Architecture, Tech Stack
2. **High** (3-5 tokens): ADRs, Standards, Patterns
3. **Medium** (6-8 tokens): Guides, Implementation Details
4. **Low** (9+ tokens): Reference, Troubleshooting

## 🤖 Skill Application Guidelines

### **@skills:architecture** Usage
- System design decisions and trade-offs
- Architectural pattern documentation
- Technology selection rationale
- Performance and scalability considerations

### **@skills:doc-coauthoring** Usage
- Structured documentation creation
- Review and iteration workflows
- Multi-stakeholder collaboration
- Quality assurance processes

### **@skills:typescript-expert** Usage
- Technical documentation precision
- Type safety and pattern examples
- Performance optimization
- Code examples and implementations

### **@skills:ui-ux-pro-max** Usage
- Design system documentation
- User experience guidelines
- Mobile optimization strategies
- Accessibility considerations

### **@skills:content-creator** Usage
- SEO-optimized content creation
- User engagement optimization
- Brand voice consistency
- Content strategy implementation

### **@skills:context-window-management** Usage
- Context optimization strategies
- Token management and prioritization
- Loading efficiency improvements
- Context quality validation

## 📋 Document Maintenance

### **Quality Standards**
- All documents must include @skills: directives
- Context priority must be clearly defined
- Content must follow established templates
- AI instructions must be specific and actionable

### **Update Procedures**
- Review @skills: directives when content changes
- Validate context priority when document purpose shifts
- Update skill mappings when new skills become available
- Maintain consistency across all documentation

### **AI Collaboration**
- Use @skills:doc-coauthoring for structured workflows
- Apply @skills:content-creator for user-facing content
- Leverage @skills:architecture for technical decisions
- Optimize with @skills:context-window-management

---

*Last updated: January 26, 2024*  
*Document maintained with @skills:architecture, @skills:doc-coauthoring, and @skills:context-window-management*
