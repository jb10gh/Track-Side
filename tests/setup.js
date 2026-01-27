/**
 * Test setup file for Vitest
 */

import { expect, afterEach, vi } from 'vitest';

// Mock window methods
Object.defineProperty(global, 'document', {
    value: {
        createElement: vi.fn(() => ({
            setAttribute: vi.fn(),
            style: { visibility: '' },
            click: vi.fn()
        })),
        body: {
            appendChild: vi.fn(),
            removeChild: vi.fn()
        }
    },
    writable: true
});

Object.defineProperty(global, 'URL', {
    value: {
        createObjectURL: vi.fn(() => 'mock-url'),
        revokeObjectURL: vi.fn()
    },
    writable: true
});

Object.defineProperty(global, 'Blob', {
    value: vi.fn(() => ({})),
    writable: true
});

// Mock window.matchMedia
Object.defineProperty(global, 'window', {
    value: {
        matchMedia: vi.fn(() => ({
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
    },
    writable: true
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9))
    },
    writable: true
});
