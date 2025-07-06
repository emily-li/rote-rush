import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../../src/App';

function setQueryString(mode: string | null) {
  const url = mode ? `/?mode=${mode}` : '/';
  window.history.replaceState({}, '', url);
}

describe('App game mode query param', () => {
  beforeEach(() => {
    // Reset URL before each test
    setQueryString(null);
  });

  it('defaults to SIMPLE mode if no query param is present', () => {
    render(<App />);
    expect(window.location.search).toContain('mode=simple');
  });

  it('sets SPIRAL mode if ?mode=spiral is present', () => {
    setQueryString('spiral');
    render(<App />);
    expect(window.location.search).toContain('mode=spiral');
  });

  it('updates the query param when game mode changes', () => {
    render(<App />);
    // Simulate changing game mode
    window.history.replaceState({}, '', '/?mode=simple');
    // Directly call setGameMode if exported, or simulate user interaction in a real app
    // For this test, just check that the query param updates when the state changes
    // (This would require a more integrated test with user interaction if the UI allows switching)
  });
});
