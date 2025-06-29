import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import SpiralQuizMode from '../../src/components/spiral/SpiralQuizMode';
import { useSpiralQuiz } from '../../src/hooks/useSpiralQuiz';

vi.mock('../../src/hooks/useSpiralQuiz', () => {
  return {
    useSpiralQuiz: vi.fn(),
  };
});

describe('SpiralQuizMode', () => {
  it('renders the head spiral character matching the currentChar', () => {
    const mockChar = { char: 'あ', validAnswers: ['a'] };
    (useSpiralQuiz as unknown as { mockReturnValue: Function }).mockReturnValue(
      {
        gameState: {
          characterState: {
            userInput: '',
            currentChar: mockChar,
          },
          scoreState: {
            score: 0,
            streak: 0,
            comboMultiplier: 1,
            isWrongAnswer: false,
          },
          timerState: {
            timeLeft: 1000,
            currentTimeMs: 1000,
            isPaused: false,
            timeRemainingPct: 100,
          },
          actions: {
            handleInputChange: vi.fn(),
            nextCharacter: vi.fn(),
            validateAndHandleInput: vi.fn(),
            handleTimeout: vi.fn(),
          },
        },
        spiralCharacters: [
          { char: mockChar, id: 'spiral-0', position: 0 },
          {
            char: { char: 'い', validAnswers: ['i'] },
            id: 'spiral-1',
            position: 1,
          },
        ],
        getCharacterStyle: () => ({}),
      },
    );

    render(<SpiralQuizMode />);

    const headChar = screen.getAllByText('あ')[0];
    expect(headChar).toBeInTheDocument();
    expect(screen.getByText('い')).toBeInTheDocument();
  });
});
