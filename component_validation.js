/**
 * Component Validation Script
 * Tests all implemented ADR components by checking their existence and structure
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();

function validateComponent(filePath, expectedContent) {
  try {
    const content = readFileSync(join(projectRoot, filePath), 'utf8');
    const missing = expectedContent.filter(item => !content.includes(item));
    return {
      exists: true,
      missing,
      valid: missing.length === 0
    };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

const tests = [
  {
    name: "ADR-011: ConsolidatedGameHeader Component",
    file: "src/components/game/ConsolidatedGameHeader.jsx",
    expected: [
      "ConsolidatedGameHeader",
      "TrackSideLogo",
      "opponentName",
      "export default ConsolidatedGameHeader"
    ]
  },
  {
    name: "ADR-012: Enhanced ScoreBoard Timer",
    file: "src/components/game/ScoreBoard.jsx",
    expected: [
      "Play, Pause",
      "Start Timer",
      "status-indicator",
      "Running",
      "Tap to Start"
    ]
  },
  {
    name: "ADR-013: Fixed EditableEventItem Import",
    file: "src/components/match/EditableEventItem.jsx",
    expected: [
      "from '../../constants/events.js'",
      "EVENT_TYPES",
      "TEAMS"
    ]
  },
  {
    name: "ADR-014: Enhanced Email Service",
    file: "src/services/nativeEmailService.ts",
    expected: [
      "📊 MATCH SUMMARY",
      "═══════════════════════════",
      "🏆 Match: Us vs",
      "⚡ Final Score:",
      "📋 EVENT TIMELINE"
    ]
  },
  {
    name: "ADR-015: StreamlinedExportModal Component",
    file: "src/components/game/StreamlinedExportModal.jsx",
    expected: [
      "StreamlinedExportModal",
      "nativeEmailService",
      "copyEnhancedSummary",
      "📧 Email to Coach",
      "📋 Copy Summary"
    ]
  },
  {
    name: "ADR-016: Refined Dark Theme",
    file: "src/theme/theme.css",
    expected: [
      "--bg-primary: #1a1a1a",
      "--text-primary: #E8E8E8",
      "--team-our-primary: #E91E63",
      "--team-their-primary: #9C27B0",
      "--glow-brand: 0 0 15px rgba(233, 30, 99, 0.2)"
    ]
  }
];

async function validateAllComponents() {
  console.log("🔍 Validating Implemented Components...\n");
  
  const results = [];
  for (const test of tests) {
    console.log(`🧪 ${test.name}`);
    const result = validateComponent(test.file, test.expected);
    
    if (result.exists) {
      if (result.valid) {
        console.log(`   ✅ All expected content found`);
      } else {
        console.log(`   ⚠️  Missing: ${result.missing.join(', ')}`);
      }
    } else {
      console.log(`   ❌ File not found: ${result.error}`);
    }
    
    results.push({ name: test.name, ...result });
    console.log("");
  }
  
  const validCount = results.filter(r => r.valid).length;
  const existCount = results.filter(r => r.exists).length;
  
  console.log(`📊 Validation Summary:`);
  console.log(`   Files exist: ${existCount}/${results.length}`);
  console.log(`   Components valid: ${validCount}/${results.length}`);
  
  return results;
}

// Run validation
validateAllComponents();
