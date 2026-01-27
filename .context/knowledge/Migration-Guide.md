---
@skills: content-creator, doc-coauthoring, ui-ux-pro-max, typescript-expert, architecture
context_priority: critical
document_type: migration-guide
execution_date: 2024-01-28
reviewers: [human, ai-assistant]
---

# 🔄 Theme System Migration Guide

## 📚 Overview

This guide provides comprehensive instructions for migrating existing components and styles to the unified Track Side theme system. Whether you're updating legacy components or creating new ones, this guide will help you ensure consistency and maintainability.

## 🎯 Migration Objectives

### **Primary Goals**
1. **Eliminate Hardcoded Values**: Replace all hardcoded colors and styles
2. **Unify Theme System**: Use consistent theming across all components
3. **Improve Maintainability**: Make styling easier to update and maintain
4. **Enhance Developer Experience**: Provide better IntelliSense and tooling
5. **Ensure Visual Consistency**: Maintain consistent appearance across the app

### **Success Metrics**
- **100%** elimination of hardcoded colors
- **100%** theme system integration
- **95%** reduction in styling inconsistencies
- **100%** TypeScript type safety
- **100%** developer tooling support

## 🏗️ Migration Strategy

### **Phase 1: Preparation**
1. **Inventory Components**: List all components needing migration
2. **Identify Patterns**: Find common styling patterns
3. **Create Migration Plan**: Prioritize components by importance
4. **Set Up Tools**: Configure development environment

### **Phase 2: Core Components**
1. **Critical Components**: ScoreBoard, SimplifiedExport, MatchDetailView
2. **High Priority**: MatchCard, ActionGrid
3. **Medium Priority**: Modal components, Shell
4. **Low Priority**: Utility components, forms

### **Phase 3: Validation**
1. **Visual Testing**: Ensure visual consistency
2. **Functionality Testing**: Verify all features work
3. **Performance Testing**: Check for performance impact
4. **Accessibility Testing**: Ensure compliance

## 🔄 Migration Patterns

### **1. Hardcoded Colors → Theme Variables**

#### **Before**
```jsx
<div style={{
  backgroundColor: '#FF1493',
  color: '#FFFFFF',
  borderColor: '#FF69B4'
}}>
  Content
</div>
```

#### **After**
```jsx
import { useTheme } from '../../theme/useTheme';

export const MyComponent = () => {
  return (
    <div style={{
      backgroundColor: 'var(--trackside-hot-pink)',
      color: 'var(--text-primary)',
      borderColor: 'var(--trackside-neon-pink)'
    }}>
      Content
    </div>
  );
};
```

#### **Alternative with Theme Hook**
```jsx
import { useTheme } from '../../theme/useTheme';

export const MyComponent = () => {
  const { colors } = useTheme();
  
  return (
    <div style={{
      backgroundColor: colors.primary,
      color: colors.text,
      borderColor: colors.secondary
    }}>
      Content
    </div>
  );
};
```

### **2. CSS Classes → Theme Styles**

#### **Before**
```jsx
<div className="bg-gradient-to-r from-[#FF1493] to-[#FF007F] text-white px-4 py-2 rounded-lg shadow-lg">
  Button
</div>
```

#### **After**
```jsx
import { useTheme } from '../../theme/useTheme';

export const MyButton = () => {
  const { createButtonStyles } = useTheme();
  
  return (
    <button style={createButtonStyles('primary')}>
      Button
    </button>
  );
};
```

### **3. Mixed Theme Variables → Unified Theme**

#### **Before**
```jsx
<div style={{
  backgroundColor: 'var(--bg-secondary)',
  borderColor: 'var(--color-border)',
  color: 'var(--text-primary)',
  padding: '16px',
  borderRadius: '8px'
}}>
  Content
</div>
```

#### **After**
```jsx
import { useTheme } from '../../theme/useTheme';

export const MyComponent = () => {
  const { createCardStyles, getSpacingValue } = useTheme();
  
  return (
    <div style={{
      ...createCardStyles(),
      padding: getSpacingValue('md')
    }}>
      Content
    </div>
  );
};
```

### **4. Team Colors → Team Theme Hook**

#### **Before**
```jsx
<div style={{
  color: 'var(--score-our-color)',
  textShadow: 'var(--score-our-shadow)'
}}>
  {ourScore}
</div>
```

#### **After**
```jsx
import { useTeamTheme } from '../../theme/useTheme';

export const ScoreDisplay = ({ ourScore }) => {
  const ourTeam = useTeamTheme('our');
  
  return (
    <span style={{ 
      color: ourTeam.colors.primary, 
      textShadow: ourTeam.colors.shadow 
    }}>
      {ourScore}
    </span>
  );
};
```

### **5. Spacing Values → Semantic Spacing**

#### **Before**
```jsx
<div style={{
  padding: '16px',
  margin: '24px',
  gap: '8px'
}}>
  Content
</div>
```

#### **After**
```jsx
import { useTheme } from '../../theme/useTheme';

export const MyComponent = () => {
  const { getSpacingValue } = useTheme();
  
  return (
    <div style={{
      padding: getSpacingValue('md'),
      margin: getSpacingValue('lg'),
      gap: getSpacingValue('sm')
    }}>
      Content
    </div>
  );
};
```

## 📋 Component Migration Checklist

### **Pre-Migration Checklist**
- [ ] **Component Inventory**: List all components to migrate
- [ ] **Dependency Check**: Identify theme dependencies
- [ ] **Test Coverage**: Ensure existing tests pass
- [ ] **Backup**: Create backup of original files
- [ ] **Branch**: Create migration branch

### **Migration Checklist**
- [ ] **Import Theme Hooks**: Add useTheme/useTeamTheme imports
- [ ] **Replace Colors**: Update all color references
- [ ] **Update Spacing**: Replace hardcoded spacing values
- [ ] **Apply Style Generators**: Use createCardStyles, createButtonStyles
- [ ] **Update Typography**: Use theme font sizes and weights
- [ ] **Add Team Colors**: Apply team-specific colors where needed
- [ ] **Test Functionality**: Verify all features work
- [ ] **Update Tests**: Modify tests to work with new theme

### **Post-Migration Checklist**
- [ ] **Visual Testing**: Ensure visual consistency
- [ ] **Performance Testing**: Check for performance impact
- [ ] **Accessibility Testing**: Verify compliance
- [ ] **Code Review**: Get code review from team
- [ ] **Documentation**: Update component documentation
- [ ] **Integration Testing**: Test with other components

## 🎯 Specific Migration Examples

### **Example 1: Simple Card Component**

#### **Before**
```jsx
import React from 'react';

export const SimpleCard = ({ title, content }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {content}
      </p>
    </div>
  );
};
```

#### **After**
```jsx
import React from 'react';
import { useTheme } from '../../theme/useTheme';

export const SimpleCard = ({ title, content }) => {
  const { createCardStyles, getSpacingValue } = useTheme();
  
  return (
    <div style={{
      ...createCardStyles(),
      padding: getSpacingValue('md')
    }}>
      <h3 style={{
        color: 'var(--text-primary)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-semibold)',
        marginBottom: getSpacingValue('sm')
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: 'var(--text-base)'
      }}>
        {content}
      </p>
    </div>
  );
};
```

### **Example 2: Button Component**

#### **Before**
```jsx
import React from 'react';

export const MyButton = ({ children, onClick, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#FF1493] to-[#FF007F] text-white hover:from-[#FF69B4] hover:to-[#FF1493]',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};
```

#### **After**
```jsx
import React from 'react';
import { useTheme } from '../../theme/useTheme';

export const MyButton = ({ children, onClick, variant = 'primary' }) => {
  const { createButtonStyles } = useTheme();
  
  return (
    <button
      onClick={onClick}
      style={createButtonStyles(variant)}
    >
      {children}
    </button>
  );
};
```

### **Example 3: Score Display Component**

#### **Before**
```jsx
import React from 'react';

export const ScoreDisplay = ({ ourScore, theirScore }) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-black mb-2">
        <span style={{ color: 'var(--score-our-color)', textShadow: 'var(--score-our-shadow)' }}>
          {ourScore}
        </span>
        <span className="mx-2 text-gray-400">-</span>
        <span style={{ color: 'var(--score-their-color)', textShadow: 'var(--score-their-shadow)' }}>
          {theirScore}
        </span>
      </div>
    </div>
  );
};
```

#### **After**
```jsx
import React from 'react';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

export const ScoreDisplay = ({ ourScore, theirScore }) => {
  const { getSpacingValue } = useTheme();
  const ourTeam = useTeamTheme('our');
  const theirTeam = useTeamTheme('their');
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 'var(--text-4xl)',
        fontWeight: 'var(--font-black)',
        marginBottom: getSpacingValue('sm')
      }}>
        <span style={{ 
          color: ourTeam.colors.primary, 
          textShadow: ourTeam.colors.shadow 
        }}>
          {ourScore}
        </span>
        <span style={{ 
          color: 'var(--text-muted)',
          margin: `0 ${getSpacingValue('sm')}`
        }}>
          -
        </span>
        <span style={{ 
          color: theirTeam.colors.primary, 
          textShadow: theirTeam.colors.shadow 
        }}>
          {theirScore}
        </span>
      </div>
    </div>
  );
};
```

### **Example 4: Modal Component**

#### **Before**
```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MyModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```

#### **After**
```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme/useTheme';

export const MyModal = ({ isOpen, onClose, children }) => {
  const { createModalStyles, getSpacingValue } = useTheme();
  
  if (!isOpen) return null;
  
  const modalStyles = createModalStyles();
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 modal-overlay"
          onClick={onClose}
          style={{ background: 'var(--modal-overlay)' }}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative rounded-2xl p-6 max-w-md w-full"
          style={{
            ...modalStyles,
            padding: getSpacingValue('lg'),
            maxWidth: '28rem'
          }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```

## 🔧 Migration Tools

### **1. Automated Migration Script**
```bash
#!/bin/bash
# migrate-theme.sh - Automated theme migration helper

echo "Starting theme migration..."

# Find all React components
find src/components -name "*.jsx" -type f | while read file; do
  echo "Processing $file..."
  
  # Replace common hardcoded colors
  sed -i '' 's/#FF1493/var(--trackside-hot-pink)/g' "$file"
  sed -i '' 's/#FF69B4/var(--trackside-neon-pink)/g' "$file"
  sed -i '' 's/#FF007F/var(--trackside-electric-pink)/g' "$file"
  sed -i '' 's/#C71585/var(--trackside-deep-pink)/g' "$file"
  
  # Replace common spacing values
  sed -i '' 's/padding: 4px/padding: var(--spacing-xs)/g' "$file"
  sed -i '' 's/padding: 8px/padding: var(--spacing-sm)/g' "$file"
  sed -i '' 's/padding: 16px/padding: var(--spacing-md)/g' "$file"
  sed -i '' 's/padding: 24px/padding: var(--spacing-lg)/g' "$file"
  sed -i '' 's/padding: 32px/padding: var(--spacing-xl)/g' "$file"
  
  echo "Completed $file"
done

echo "Migration complete! Please review changes and test thoroughly."
```

### **2. Theme Validation Script**
```javascript
// validate-theme.js - Theme validation utility
const fs = require('fs');
const path = require('path');

const hardcodedColors = [
  /#[0-9A-Fa-f]{6}/g,
  /rgb\([^)]+\)/g,
  /rgba\([^)]+\)/g
];

const hardcodedSpacing = [
  /padding:\s*\d+px/g,
  /margin:\s*\d+px/g,
  /gap:\s*\d+px/g
];

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for hardcoded colors
  hardcodedColors.forEach(regex => {
    const matches = content.match(regex);
    if (matches) {
      issues.push(`Hardcoded colors found: ${matches.join(', ')}`);
    }
  });
  
  // Check for hardcoded spacing
  hardcodedSpacing.forEach(regex => {
    const matches = content.match(regex);
    if (matches) {
      issues.push(`Hardcoded spacing found: ${matches.join(', ')}`);
    }
  });
  
  return issues;
}

function validateDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  const allIssues = {};
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      allIssues[file] = validateDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const issues = validateFile(filePath);
      if (issues.length > 0) {
        allIssues[file] = issues;
      }
    }
  });
  
  return allIssues;
}

// Validate components directory
const issues = validateDirectory('src/components');
console.log('Theme validation results:');
console.log(JSON.stringify(issues, null, 2));
```

### **3. Migration Helper Functions**
```javascript
// migration-helpers.js - Helper functions for migration

/**
 * Convert hardcoded color to theme variable
 */
function convertColor(color) {
  const colorMap = {
    '#FF1493': 'var(--trackside-hot-pink)',
    '#FF69B4': 'var(--trackside-neon-pink)',
    '#FF007F': 'var(--trackside-electric-pink)',
    '#C71585': 'var(--trackside-deep-pink)',
    '#FFFFFF': 'var(--text-primary)',
    '#000000': 'var(--bg-primary)',
    '#10B981': 'var(--status-success)',
    '#F59E0B': 'var(--status-warning)',
    '#EF4444': 'var(--status-error)',
    '#3B82F6': 'var(--status-info)'
  };
  
  return colorMap[color.toUpperCase()] || color;
}

/**
 * Convert hardcoded spacing to theme variable
 */
function convertSpacing(value) {
  const spacingMap = {
    '4px': 'var(--spacing-xs)',
    '8px': 'var(--spacing-sm)',
    '16px': 'var(--spacing-md)',
    '24px': 'var(--spacing-lg)',
    '32px': 'var(--spacing-xl)',
    '48px': 'var(--spacing-2xl)',
    '64px': 'var(--spacing-3xl)'
  };
  
  return spacingMap[value] || value;
}

/**
 * Generate theme import statement
 */
function generateThemeImport() {
  return `import { useTheme } from '../../theme/useTheme';`;
}

/**
 * Generate theme hook usage
 */
function generateThemeUsage() {
  return `const { createCardStyles, createButtonStyles, getSpacingValue } = useTheme();`;
}

module.exports = {
  convertColor,
  convertSpacing,
  generateThemeImport,
  generateThemeUsage
};
```

## 🧪 Testing Migration

### **1. Visual Regression Testing**
```bash
# Install visual regression testing tools
npm install --save-dev jest-image-snapshot

# Run visual tests
npm run test:visual
```

### **2. Theme Integration Tests**
```jsx
// theme-integration.test.js
import { render, screen } from '@testing-library/react';
import { useTheme } from '../../theme/useTheme';

// Mock theme hook
jest.mock('../../theme/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#FF1493',
      secondary: '#FF69B4',
      text: '#FFFFFF'
    },
    spacing: {
      md: '1rem',
      lg: '1.5rem'
    },
    createCardStyles: () => ({
      backgroundColor: '#000000',
      border: '1px solid #FF1493',
      borderRadius: '8px'
    }),
    getSpacingValue: (size) => {
      const spacing = { md: '1rem', lg: '1.5rem' };
      return spacing[size] || size;
    }
  })
}));

describe('Theme Integration', () => {
  test('component uses theme colors correctly', () => {
    const TestComponent = () => {
      const { colors } = useTheme();
      return <div style={{ backgroundColor: colors.primary }}>Test</div>;
    };
    
    render(<TestComponent />);
    const div = screen.getByText('Test');
    expect(div).toHaveStyle({
      backgroundColor: '#FF1493'
    });
  });
});
```

### **3. Performance Testing**
```javascript
// performance.test.js
import { render, measurePerformance } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('Performance Tests', () => {
  test('component renders within performance budget', () => {
    const { endTime } = measurePerformance(() => {
      render(<MyComponent />);
    });
    
    // Should render within 16ms (60fps)
    expect(endTime).toBeLessThan(16);
  });
});
```

## 🚨 Common Migration Issues

### **Issue 1: Theme Hook Not Imported**
```jsx
// Problem
export const MyComponent = () => {
  const { createCardStyles } = useTheme(); // useTheme not defined
  // ...
};

// Solution
import { useTheme } from '../../theme/useTheme';

export const MyComponent = () => {
  const { createCardStyles } = useTheme();
  // ...
};
```

### **Issue 2: Team Theme Hook Not Used**
```jsx
// Problem
<span style={{ color: '#FF1493' }}>Our Score</span>

// Solution
import { useTeamTheme } from '../../theme/useTheme';

export const ScoreDisplay = () => {
  const ourTeam = useTeamTheme('our');
  return (
    <span style={{ color: ourTeam.colors.primary }}>Our Score</span>
  );
};
```

### **Issue 3: Mixed Styling Approaches**
```jsx
// Problem
<div style={{
  backgroundColor: 'var(--trackside-hot-pink)',
  padding: '16px' // Hardcoded spacing
}}>

// Solution
import { useTheme } from '../../theme/useTheme';

export const MyComponent = () => {
  const { getSpacingValue } = useTheme();
  return (
    <div style={{
      backgroundColor: 'var(--trackside-hot-pink)',
      padding: getSpacingValue('md')
    }}>
  );
};
```

### **Issue 4: Missing TypeScript Types**
```jsx
// Problem
const theme = useTheme(); // No type information

// Solution
import { useTheme } from '../../theme/useTheme';
import type { TrackSideTheme } from '../../theme/theme-config';

export const MyComponent = () => {
  const theme = useTheme();
  // theme now has full TypeScript support
};
```

## 📋 Migration Timeline

### **Week 1: Preparation**
- **Day 1**: Inventory components and create migration plan
- **Day 2**: Set up migration tools and scripts
- **Day 3**: Create backup branch and backup files
- **Day 4**: Test migration tools on sample components
- **Day 5**: Refine migration process and documentation

### **Week 2: Core Components**
- **Day 1-2**: Migrate critical components (ScoreBoard, SimplifiedExport)
- **Day 3-4**: Migrate high priority components (MatchCard, ActionGrid)
- **Day 5**: Test and validate migrated components

### **Week 3: Extended Components**
- **Day 1-2**: Migrate medium priority components (Modal, Shell)
- **Day 3-4**: Migrate remaining components
- **Day 5**: Comprehensive testing and validation

### **Week 4: Finalization**
- **Day 1-2**: Performance optimization and testing
- **Day 3**: Documentation updates
- **Day 4**: Code review and final validation
- **Day 5**: Deployment preparation

## 🎯 Success Criteria

### **Technical Success**
- [ ] **100%** of components use theme system
- [ ] **0** hardcoded colors in components
- [ ] **100%** TypeScript type safety
- [ ] **95%** test coverage maintained
- [ ] **No** performance regression

### **Visual Success**
- [ ] **Consistent** appearance across all components
- [ ] **Proper** team color application
- [ ] **Responsive** design maintained
- [ ] **Accessibility** compliance maintained
- [ ] **Cross-browser** compatibility

### **Developer Experience**
- [ ] **Full** IntelliSense support
- [ ] **Comprehensive** documentation
- [ ] **Easy** to use and maintain
- [ ] **Clear** migration patterns
- [ ] **Helpful** error messages

## 📞 Support

### **Getting Help**
- **Documentation**: This migration guide and theme system docs
- **Code Examples**: Migrated component examples
- **Tools**: Migration scripts and validation tools
- **Troubleshooting**: Common issues and solutions

### **Community Support**
- **GitHub Issues**: Report migration problems
- **Discussions**: Ask migration questions
- **Code Reviews**: Get feedback on migrated components
- **Pair Programming**: Work with team on complex migrations

---

## 🎯 Quick Reference

### **Common Replacements**
```javascript
// Colors
'#FF1493' → 'var(--trackside-hot-pink)'
'#FF69B4' → 'var(--trackside-neon-pink)'
'#FF007F' → 'var(--trackside-electric-pink)'
'#FFFFFF' → 'var(--text-primary)'
'#000000' → 'var(--bg-primary)'

// Spacing
'4px' → getSpacingValue('xs')
'8px' → getSpacingValue('sm')
'16px' → getSpacingValue('md')
'24px' → getSpacingValue('lg')
'32px' → getSpacingValue('xl')

// Styles
className="bg-white text-black" → style={createCardStyles()}
className="btn-primary" → style={createButtonStyles('primary')}
```

### **Import Patterns**
```jsx
// Theme hooks
import { useTheme } from '../../theme/useTheme';
import { useTeamTheme } from '../../theme/useTheme';

// Common usage
const { createCardStyles, createButtonStyles, getSpacingValue } = useTheme();
const ourTeam = useTeamTheme('our');
const theirTeam = useTeamTheme('their');
```

---

*Migration guide maintained with comprehensive patterns, examples, tools, and best practices for successful theme system migration.*
