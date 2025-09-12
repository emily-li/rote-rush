import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DirectionPad from '@/components/snake/DirectionPad';
import { Direction } from '@/lib/snakeUtils';

describe('DirectionPad', () => {
  const mockHelpers = {
    getCharForDirectionString: vi.fn((dir: Direction) => {
      const chars: { [key in Direction]: string } = {
        UP: 'あ',
        DOWN: 'い',
        LEFT: 'う',
        RIGHT: 'え',
      };
      return chars[dir];
    }),
    isMatchingCharacter: vi.fn(() => false),
  };

  it('renders four direction indicators', () => {
    render(<DirectionPad helpers={mockHelpers} currentDirection="UP" />);
    const indicators = screen.getAllByLabelText(/D-pad/);
    expect(indicators).toHaveLength(4);
  });

  it('renders direction indicators in the correct grid positions', () => {
    render(<DirectionPad helpers={mockHelpers} currentDirection="RIGHT" />);

    const upIndicator = screen.getByLabelText(/D-pad UP/);
    expect(upIndicator.parentElement?.className).toContain('col-start-2 row-start-1');

    const downIndicator = screen.getByLabelText(/D-pad DOWN/);
    expect(downIndicator.parentElement?.className).toContain('col-start-2 row-start-3');

    const leftIndicator = screen.getByLabelText(/D-pad LEFT/);
    expect(leftIndicator.parentElement?.className).toContain('col-start-1 row-start-2');

    const rightIndicator = screen.getByLabelText(/D-pad RIGHT/);
    expect(rightIndicator.parentElement?.className).toContain('col-start-3 row-start-2');
  });
});
