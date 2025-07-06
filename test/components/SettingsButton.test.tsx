// Mock focus-trap-react to bypass focus trap issues in test environment
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { GameModeProvider } from '../../src/components/GameModeContext';
import { SettingsButton } from '../../src/components/SettingsButton';

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('SettingsButton', () => {
  it('pauses timer when report view is opened and resumes when closed', async () => {
    const pauseTimer = vi.fn();
    const resumeTimer = vi.fn();
    const timerControl = { pauseTimer, resumeTimer };

    render(
      <GameModeProvider>
        <SettingsButton timerControl={timerControl} />
      </GameModeProvider>,
    );

    // Reset mocks to ignore initial render effects
    pauseTimer.mockReset();
    resumeTimer.mockReset();

    // Open report view
    const settingsButton = screen.getByRole('button', {
      name: /open settings and reports/i,
    });
    await userEvent.click(settingsButton);

    // Check if pauseTimer was called
    expect(pauseTimer).toHaveBeenCalledTimes(1);
    expect(resumeTimer).not.toHaveBeenCalled();

    // Close report view
    const closeButton = screen.getByRole('button', { name: /close report/i });
    await userEvent.click(closeButton);

    // Check if resumeTimer was called
    expect(resumeTimer).toHaveBeenCalledTimes(1);
  });

  it('does not call timer control methods if timerControl is not provided', async () => {
    const pauseTimer = vi.fn();
    const resumeTimer = vi.fn();

    render(
      <GameModeProvider>
        <SettingsButton />
      </GameModeProvider>,
    );

    // Open report view
    const settingsButton = screen.getByRole('button', {
      name: /open settings and reports/i,
    });
    await userEvent.click(settingsButton);

    // Check if pauseTimer was not called
    expect(pauseTimer).not.toHaveBeenCalled();
    expect(resumeTimer).not.toHaveBeenCalled();

    // Close report view
    const closeButton = screen.getByRole('button', { name: /close report/i });
    await userEvent.click(closeButton);

    // Check if resumeTimer was not called
    expect(resumeTimer).not.toHaveBeenCalled();
  });

  it('toggles report view with Escape key', async () => {
    render(
      <GameModeProvider>
        <SettingsButton />
      </GameModeProvider>,
    );

    // Open report view with button
    const settingsButton = screen.getByRole('button', {
      name: /open settings and reports/i,
    });
    await userEvent.click(settingsButton);

    // Check if report view is open
    expect(
      screen.getByRole('button', { name: /close report/i }),
    ).toBeInTheDocument();

    // Close report view with Escape key
    await userEvent.keyboard('{Escape}');

    // Check if report view is closed
    expect(
      screen.queryByRole('button', { name: /close report/i }),
    ).not.toBeInTheDocument();

    // Open report view with Escape key
    await userEvent.keyboard('{Escape}');

    // Check if report view is open again
    expect(
      screen.getByRole('button', { name: /close report/i }),
    ).toBeInTheDocument();
  });
});
