import '../src/index.css';
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock the window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock requestAnimationFrame and cancelAnimationFrame
let animationFrameId = 0;
const animationFrameCallbacks = new Map<number, FrameRequestCallback>();

global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  animationFrameId++;
  animationFrameCallbacks.set(animationFrameId, callback);
  // Don't actually call the callback automatically to prevent infinite loops
  return animationFrameId;
});

global.cancelAnimationFrame = vi.fn((id: number) => {
  animationFrameCallbacks.delete(id);
});
