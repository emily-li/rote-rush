import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DirectionPad from '@/components/snake/DirectionPad';
import { Direction, SnakePosition } from '@/lib/snakeUtils';

const mockHelpers = {
  getCharForDirectionString: (dir: Direction): string => {
    const charMap: Record<Direction, string> = {
      UP: 'あ',
      DOWN: 'い', 
      LEFT: 'う',
      RIGHT: 'え',
    };
    return charMap[dir];
  },
  isMatchingCharacter: (char: string): boolean => false,
};

describe('DirectionPad edge behavior', () => {
  it('should hide RIGHT direction when snake is at right edge', () => {
    const snakeHeadPosition: SnakePosition = [23, 12]; // Right edge
    const { container } = render(
      <DirectionPad
        helpers={mockHelpers}
        currentDirection="UP"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    // UP should NOT show (current direction)
    expect(container.textContent).not.toContain('あ');
    // DOWN should NOT show (opposite direction)
    expect(container.textContent).not.toContain('い');
    // LEFT should show (safe direction)
    expect(container.textContent).toContain('う');
    // RIGHT should NOT show because it would hit edge
    expect(container.textContent).not.toContain('え');
  });

  it('should hide LEFT direction when snake is at left edge', () => {
    const snakeHeadPosition: SnakePosition = [0, 12]; // Left edge
    const { container } = render(
      <DirectionPad
        helpers={mockHelpers}
        currentDirection="UP"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    // UP should NOT show (current direction)
    expect(container.textContent).not.toContain('あ');
    // DOWN should NOT show (opposite direction)
    expect(container.textContent).not.toContain('い');
    // LEFT should NOT show because it would hit edge
    expect(container.textContent).not.toContain('う');
    // RIGHT should show (safe direction)
    expect(container.textContent).toContain('え');
  });

  it('should hide UP direction when snake is at top edge', () => {
    const snakeHeadPosition: SnakePosition = [12, 0]; // Top edge
    const { container } = render(
      <DirectionPad
        helpers={mockHelpers}
        currentDirection="RIGHT"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    // UP should NOT show because it would hit edge
    expect(container.textContent).not.toContain('あ');
    // DOWN should show (safe direction)
    expect(container.textContent).toContain('い');
    // LEFT should NOT show (opposite of current direction)
    expect(container.textContent).not.toContain('う');
    // RIGHT is current direction, so should not show
    expect(container.textContent).not.toContain('え');
  });

  it('should hide DOWN direction when snake is at bottom edge', () => {
    const snakeHeadPosition: SnakePosition = [12, 23]; // Bottom edge
    const { container } = render(
      <DirectionPad
        helpers={mockHelpers}
        currentDirection="RIGHT"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    // UP should show (safe direction)
    expect(container.textContent).toContain('あ');
    // DOWN should NOT show because it would hit edge
    expect(container.textContent).not.toContain('い');
    // LEFT should NOT show (opposite of current direction)
    expect(container.textContent).not.toContain('う');
    // RIGHT is current direction, so should not show
    expect(container.textContent).not.toContain('え');
  });

  it('should hide multiple directions when snake is at corner', () => {
    const snakeHeadPosition: SnakePosition = [0, 0]; // Top-left corner
    const { container } = render(
      <DirectionPad
        helpers={mockHelpers}
        currentDirection="RIGHT"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    // UP should NOT show because it would hit edge
    expect(container.textContent).not.toContain('あ');
    // DOWN should show
    expect(container.textContent).toContain('い');
    // LEFT should NOT show because it would hit edge
    expect(container.textContent).not.toContain('う');
    // RIGHT is current direction, so should not show
    expect(container.textContent).not.toContain('え');
  });

  it('should show all available directions when snake is in center', () => {
    const snakeHeadPosition: SnakePosition = [12, 12]; // Center
    const { container } = render(
      <DirectionPad
        helpers={mockHelpers}
        currentDirection="RIGHT"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    // UP should show
    expect(container.textContent).toContain('あ');
    // DOWN should show
    expect(container.textContent).toContain('い');
    // LEFT should NOT show because it's opposite to current direction
    expect(container.textContent).not.toContain('う');
    // RIGHT is current direction, so should not show
    expect(container.textContent).not.toContain('え');
  });
});