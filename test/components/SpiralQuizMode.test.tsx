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

const mockSpiralQuiz = {
  gameState: {
    characterState: {
      userInput: '',
      currentChar: { char: 'あ', validAnswers: ['a'] },
    },
    scoreState: {
      score: 0,
      streak: 0,
      highestStreak: 0,
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
    { char: { char: 'あ', validAnswers: ['a'] }, id: 'spiral-0', position: 0 },
    {
      char: { char: 'い', validAnswers: ['i'] },
      id: 'spiral-1',
      position: 1,
    },
  ],
  getCharacterStyle: () => ({}),
};

describe('SpiralQuizMode', () => {
  it('renders the head spiral character matching the currentChar', () => {
    (
      useSpiralQuiz as unknown as {
        mockReturnValue: (value: typeof mockSpiralQuiz) => void;
      }
    ).mockReturnValue(mockSpiralQuiz);

    render(<SpiralQuizMode />);

    const headChar = screen.getAllByText('あ')[0];
    expect(headChar).toBeInTheDocument();
    expect(screen.getByText('い')).toBeInTheDocument();
  });

  it('takes the full screen height to prevent layout bugs', () => {
    (
      useSpiralQuiz as unknown as {
        mockReturnValue: (value: typeof mockSpiralQuiz) => void;
      }
    ).mockReturnValue(mockSpiralQuiz);

    render(<SpiralQuizMode />);

    const backgroundElement = screen.getByRole('region');
    expect(backgroundElement).toHaveStyle({ height: '100vh', width: '100vw' });
  });
});
