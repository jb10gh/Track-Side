/**
 * Test utilities for validation functions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { validateOpponentName, validateEventLabel, validateGameTime } from '../src/utils/validation.js';

describe('Validation Utilities', () => {
    describe('validateOpponentName', () => {
        it('should accept valid opponent names', () => {
            expect(validateOpponentName('Team A')).toBe('Team A');
            expect(validateOpponentName('  Team B  ')).toBe('Team B');
        });

        it('should reject empty names', () => {
            expect(() => validateOpponentName('')).toThrow('Opponent name cannot be empty');
            expect(() => validateOpponentName('   ')).toThrow('Opponent name cannot be empty');
        });

        it('should reject non-string inputs', () => {
            expect(() => validateOpponentName(null)).toThrow('must be a string');
            expect(() => validateOpponentName(123)).toThrow('must be a string');
        });

        it('should reject names that are too long', () => {
            const longName = 'a'.repeat(51);
            expect(() => validateOpponentName(longName)).toThrow('50 characters or less');
        });
    });

    describe('validateEventLabel', () => {
        it('should accept valid event labels', () => {
            expect(validateEventLabel('Goal')).toBe('Goal');
            expect(validateEventLabel('  Penalty  ')).toBe('Penalty');
        });

        it('should reject empty labels', () => {
            expect(() => validateEventLabel('')).toThrow('Event label cannot be empty');
            expect(() => validateEventLabel('   ')).toThrow('Event label cannot be empty');
        });

        it('should reject labels that are too long', () => {
            const longLabel = 'a'.repeat(101);
            expect(() => validateEventLabel(longLabel)).toThrow('100 characters or less');
        });
    });

    describe('validateGameTime', () => {
        it('should accept valid game times', () => {
            expect(validateGameTime(0)).toBe(0);
            expect(validateGameTime(1000)).toBe(1000);
        });

        it('should reject negative times', () => {
            expect(() => validateGameTime(-1)).toThrow('non-negative number');
        });

        it('should reject non-number inputs', () => {
            expect(() => validateGameTime('1000')).toThrow('non-negative number');
            expect(() => validateGameTime(null)).toThrow('non-negative number');
        });
    });
});
