import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GameModeProvider } from '../../src/components/GameModeContext';
import { ReportView } from '../../src/components/ReportView';

// Mock focus-trap-react to bypass focus trap issues in test environment
vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

function setupReportView() {
  const onClose = vi.fn();
  render(
    <GameModeProvider>
      <ReportView onClose={onClose} />
    </GameModeProvider>,
  );
  return { onClose };
}

describe('ReportView', () => {
  it('switches game mode when buttons are clicked', async () => {
    setupReportView();
    const simpleBtn = screen.getByRole('button', { name: /simple mode/i });
    const spiralBtn = screen.getByRole('button', { name: /spiral mode/i });
    // Spiral mode should not be selected initially
    expect(spiralBtn.className).not.toMatch(/font-bold/);
    // Click spiral mode
    await userEvent.click(spiralBtn);
    // Spiral mode should now be selected
    expect(spiralBtn.className).toMatch(/font-bold/);
    expect(simpleBtn.className).not.toMatch(/font-bold/);
    // Click simple mode
    await userEvent.click(simpleBtn);
    expect(simpleBtn.className).toMatch(/font-bold/);
    expect(spiralBtn.className).not.toMatch(/font-bold/);
  });

  it('renders character stats without duplicates', () => {
    vi.mock('../../src/lib/characterStats', () => ({
      getCharacterStatsWithRates: () => [
        { char: 'あ', attempts: 5, correct: 4, successRate: 80 },
        { char: 'い', attempts: 3, correct: 2, successRate: 66.7 },
        { char: 'あ', attempts: 2, correct: 1, successRate: 50 },
      ],
    }));

    setupReportView();

    const characterElements = screen.getAllByText('あ');
    expect(characterElements.length).toBe(1);
  });

  it('traps focus within the component when active', async () => {
    setupReportView();
    const firstFocusable = screen.getByRole('button', { name: /simple mode/i });
    const lastFocusable = screen.getByRole('button', { name: /close/i });

    firstFocusable.focus();
    expect(document.activeElement).toBe(firstFocusable);

    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(lastFocusable);

    await userEvent.tab();
    expect(document.activeElement).toBe(firstFocusable);
  });
});
