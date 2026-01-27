/**
 * Test export utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { downloadCSV } from '../src/utils/export.js';

describe('Export Utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should generate CSV content correctly', () => {
        const mockGame = {
            opponentName: 'Test Team',
            events: [
                {
                    timestamp: '2023-01-01T10:00:00.000Z',
                    gameTime: 45000,
                    type: 'goal',
                    team: 'us',
                    label: 'Opening goal',
                    meta: { isPK: false }
                }
            ]
        };

        downloadCSV(mockGame);

        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(global.document.createElement).toHaveBeenCalledWith('a');
    });

    it('should handle events without labels', () => {
        const mockGame = {
            opponentName: 'Test Team',
            events: [
                {
                    timestamp: '2023-01-01T10:00:00.000Z',
                    gameTime: 45000,
                    type: 'goal',
                    team: 'them',
                    label: null,
                    meta: { isPK: true }
                }
            ]
        };

        downloadCSV(mockGame);

        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should generate correct filename', () => {
        const mockGame = {
            opponentName: 'Test Team',
            events: []
        };

        downloadCSV(mockGame);

        // Check that setAttribute was called with 'download' attribute
        const linkElement = global.document.createElement.mock.results[0].value;
        expect(linkElement.setAttribute).toHaveBeenCalledWith(
            'download',
            expect.stringMatching(/^match-Test Team-\d{4}-\d{2}-\d{2}\.csv$/)
        );
    });
});
