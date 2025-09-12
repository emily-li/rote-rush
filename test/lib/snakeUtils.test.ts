import { describe, expect, it } from 'vitest';
import { wouldHitEdge, SnakePosition, Direction } from '@/lib/snakeUtils';

describe('wouldHitEdge', () => {
  it('should return true when moving UP from top edge', () => {
    const position: SnakePosition = [12, 0]; // Top edge
    expect(wouldHitEdge(position, 'UP')).toBe(true);
  });

  it('should return true when moving DOWN from bottom edge', () => {
    const position: SnakePosition = [12, 23]; // Bottom edge (grid size is 24)
    expect(wouldHitEdge(position, 'DOWN')).toBe(true);
  });

  it('should return true when moving LEFT from left edge', () => {
    const position: SnakePosition = [0, 12]; // Left edge
    expect(wouldHitEdge(position, 'LEFT')).toBe(true);
  });

  it('should return true when moving RIGHT from right edge', () => {
    const position: SnakePosition = [23, 12]; // Right edge (grid size is 24)
    expect(wouldHitEdge(position, 'RIGHT')).toBe(true);
  });

  it('should return false when moving away from edge', () => {
    const position: SnakePosition = [0, 12]; // Left edge
    expect(wouldHitEdge(position, 'RIGHT')).toBe(false); // Moving away from edge
  });

  it('should return false when in center of grid', () => {
    const position: SnakePosition = [12, 12]; // Center
    expect(wouldHitEdge(position, 'UP')).toBe(false);
    expect(wouldHitEdge(position, 'DOWN')).toBe(false);
    expect(wouldHitEdge(position, 'LEFT')).toBe(false);
    expect(wouldHitEdge(position, 'RIGHT')).toBe(false);
  });

  it('should return correct values when one position away from edge', () => {
    const position: SnakePosition = [1, 1]; // One away from top-left corner
    expect(wouldHitEdge(position, 'UP')).toBe(false); // Goes to [1,0] which is valid
    expect(wouldHitEdge(position, 'LEFT')).toBe(false); // Goes to [0,1] which is valid
    expect(wouldHitEdge(position, 'DOWN')).toBe(false);
    expect(wouldHitEdge(position, 'RIGHT')).toBe(false);
  });
});