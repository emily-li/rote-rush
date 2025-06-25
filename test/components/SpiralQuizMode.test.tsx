/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import SpiralQuizMode from '@/components/spiral/SpiralQuizMode';
import { useSpiralQuiz } from '@/hooks/useSpiralQuiz';
import { GameMode } from '@/types';

vi.mock('@/hooks/useSpiralQuiz', () => {
  return {
    useSpiralQuiz: vi.fn(),
  };
});

describe('SpiralQuizMode', () => {
  it('renders the head spiral character matching the currentChar', () => {
    const mockChar = { char: 'あ', validAnswers: ['a'] };
    (useSpiralQuiz as unknown as { mockReturnValue: Function }).mockReturnValue(
      {
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
        actions: {
          handleInputChange: vi.fn(),
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

    render(
      <SpiralQuizMode
        currentGameMode={GameMode.SPIRAL}
        onGameModeChange={() => {}}
      />,
    );

    const headChar = screen.getAllByText('あ')[0];
    expect(headChar).toBeInTheDocument();
    expect(screen.getByText('い')).toBeInTheDocument();
  });
});
