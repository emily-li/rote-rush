import { describe, it, expect } from 'vitest';
import type { PracticeCharacter } from '../../src/types';

const WEIGHT_DECREASE = 1;
const WEIGHT_INCREASE = 2;
const MIN_WEIGHT = 1;

function decreaseWeight(characters: PracticeCharacter[], char: string) {
  return characters.map(c =>
    c.char === char ? { ...c, weight: Math.max(MIN_WEIGHT, (c.weight || 1) - WEIGHT_DECREASE) } : c
  );
}

function increaseWeight(characters: PracticeCharacter[], char: string) {
  return characters.map(c =>
    c.char === char ? { ...c, weight: (c.weight || 1) + WEIGHT_INCREASE } : c
  );
}

describe('weight adjustment helpers (from SimpleQuizMode)', () => {
  const base: PracticeCharacter[] = [
    { char: 'あ', validAnswers: ['a'], weight: 5 },
    { char: 'い', validAnswers: ['i'], weight: 3 },
  ];

  it('decreases weight for correct answer, but not below MIN_WEIGHT', () => {
    const result = decreaseWeight(base, 'あ');
    expect(result.find(c => c.char === 'あ')?.weight).toBe(4);
    expect(result.find(c => c.char === 'い')?.weight).toBe(3);
    // Should not go below MIN_WEIGHT
    const minTest = decreaseWeight([{ char: 'う', validAnswers: ['u'], weight: 1 }], 'う');
    expect(minTest[0].weight).toBe(1);
  });

  it('increases weight for incorrect answer', () => {
    const result = increaseWeight(base, 'い');
    expect(result.find(c => c.char === 'い')?.weight).toBe(5);
    expect(result.find(c => c.char === 'あ')?.weight).toBe(5);
  });
});
