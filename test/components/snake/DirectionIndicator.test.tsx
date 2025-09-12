import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DirectionIndicator from '@/components/snake/DirectionIndicator';
import { Direction, SnakePosition } from '@/lib/snakeUtils';

const mockGetCharForDirection = (dir: Direction): string => {
  const charMap: Record<Direction, string> = {
    UP: 'あ',
    DOWN: 'い', 
    LEFT: 'う',
    RIGHT: 'え',
  };
  return charMap[dir];
};

const mockIsMatchingCharacter = (char: string): boolean => false;

describe('DirectionIndicator', () => {
  it('should hide character when direction would hit top edge', () => {
    const snakeHeadPosition: SnakePosition = [12, 0]; // Top edge
    const { container } = render(
      <DirectionIndicator
        direction="UP"
        getCharForDirection={mockGetCharForDirection}
        isMatchingCharacter={mockIsMatchingCharacter}
        currentDirection="RIGHT"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    const directionDiv = container.firstChild as HTMLElement;
    expect(directionDiv.textContent).toBe(''); // Should be empty
  });

  it('should hide character when direction would hit bottom edge', () => {
    const snakeHeadPosition: SnakePosition = [12, 23]; // Bottom edge
    const { container } = render(
      <DirectionIndicator
        direction="DOWN"
        getCharForDirection={mockGetCharForDirection}
        isMatchingCharacter={mockIsMatchingCharacter}
        currentDirection="RIGHT"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    const directionDiv = container.firstChild as HTMLElement;
    expect(directionDiv.textContent).toBe(''); // Should be empty
  });

  it('should hide character when direction would hit left edge', () => {
    const snakeHeadPosition: SnakePosition = [0, 12]; // Left edge
    const { container } = render(
      <DirectionIndicator
        direction="LEFT"
        getCharForDirection={mockGetCharForDirection}
        isMatchingCharacter={mockIsMatchingCharacter}
        currentDirection="RIGHT"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    const directionDiv = container.firstChild as HTMLElement;
    expect(directionDiv.textContent).toBe(''); // Should be empty
  });

  it('should hide character when direction would hit right edge', () => {
    const snakeHeadPosition: SnakePosition = [23, 12]; // Right edge
    const { container } = render(
      <DirectionIndicator
        direction="RIGHT"
        getCharForDirection={mockGetCharForDirection}
        isMatchingCharacter={mockIsMatchingCharacter}
        currentDirection="UP"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    const directionDiv = container.firstChild as HTMLElement;
    expect(directionDiv.textContent).toBe(''); // Should be empty
  });

  it('should show character when direction is safe from edge', () => {
    const snakeHeadPosition: SnakePosition = [12, 12]; // Center position
    const { container } = render(
      <DirectionIndicator
        direction="UP"
        getCharForDirection={mockGetCharForDirection}
        isMatchingCharacter={mockIsMatchingCharacter}
        currentDirection="RIGHT"
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    const directionDiv = container.firstChild as HTMLElement;
    expect(directionDiv.textContent).toBe('あ'); // Should show character
  });

  it('should still hide character when it is current direction (existing behavior)', () => {
    const snakeHeadPosition: SnakePosition = [12, 12]; // Center position
    const { container } = render(
      <DirectionIndicator
        direction="UP"
        getCharForDirection={mockGetCharForDirection}
        isMatchingCharacter={mockIsMatchingCharacter}
        currentDirection="UP" // Same as direction
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    const directionDiv = container.firstChild as HTMLElement;
    expect(directionDiv.textContent).toBe(''); // Should be empty
  });

  it('should still hide character when it is opposite direction (existing behavior)', () => {
    const snakeHeadPosition: SnakePosition = [12, 12]; // Center position
    const { container } = render(
      <DirectionIndicator
        direction="UP"
        getCharForDirection={mockGetCharForDirection}
        isMatchingCharacter={mockIsMatchingCharacter}
        currentDirection="DOWN" // Opposite of UP
        snakeHeadPosition={snakeHeadPosition}
      />
    );
    
    const directionDiv = container.firstChild as HTMLElement;
    expect(directionDiv.textContent).toBe(''); // Should be empty
  });
});