import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GameModeProvider } from '@/components/GameModeContext';
import { ReportView } from '@/components/ReportView';

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
    expect(spiralBtn).not.toHaveClass('font-bold');
    // Click spiral mode
    await userEvent.click(spiralBtn);
    // Spiral mode should now be selected
    expect(spiralBtn).toHaveClass('font-bold');
    expect(simpleBtn).not.toHaveClass('font-bold');
    // Click simple mode
    await userEvent.click(simpleBtn);
    expect(simpleBtn).toHaveClass('font-bold');
    expect(spiralBtn).not.toHaveClass('font-bold');
  });
});
