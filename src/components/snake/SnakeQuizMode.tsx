import React, { useEffect, useRef } from 'react';
import { QuizInput } from '@/components/QuizInput';
import { SettingsButton } from '@/components/SettingsButton';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import DirectionIndicator from './DirectionIndicator';
import { SnakeGameBoard } from './SnakeGameBoard';

const SnakeQuizMode: React.FC = () => {
  const {
    gameState,
    inputValue,
    isInvalidInput,
    actions,
    helpers,
    timerControl,
  } = useSnakeGame();
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const directions = [
    { direction: 'UP' as const, colStart: 2, rowStart: 1 },
    { direction: 'LEFT' as const, colStart: 1, rowStart: 2 },
    { direction: 'RIGHT' as const, colStart: 3, rowStart: 2 },
    { direction: 'DOWN' as const, colStart: 2, rowStart: 3 },
  ];
  const directionBaseClasses = 'flex items-center justify-center';

  useEffect(() => {
    if (!gameState.gameOver && !gameState.paused && inputContainerRef.current) {
      const input = inputContainerRef.current.querySelector('input');
      if (input) {
        input.focus();
      }
    }
  }, [gameState.gameOver, gameState.paused]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-fuchsia-50 text-gray-700">
      <div className="absolute right-4 top-4 z-20">
        <SettingsButton timerControl={timerControl} />
      </div>

      <SnakeGameBoard
        gameState={gameState}
        handleRestart={actions.handleRestart}
      />

      <div className="mt-4 flex flex-col items-center">
        <div className="grid w-36 grid-cols-3 gap-3">
          {directions.map(({ direction, colStart, rowStart }) => (
            <div
              key={direction}
              className={`col-start-${colStart} row-start-${rowStart} ${directionBaseClasses}`}
            >
              <DirectionIndicator
                direction={direction}
                getCharForDirection={helpers.getCharForDirectionString}
                isMatchingCharacter={helpers.isMatchingCharacter}
                currentDirection={gameState.direction}
              />
            </div>
          ))}
        </div>

        <div
          className="mt-4 flex flex-col items-center"
          ref={inputContainerRef}
        >
          <QuizInput
            value={inputValue}
            onChange={actions.handleInputChange}
            isWrongAnswer={false}
            isInvalid={isInvalidInput}
            disabled={gameState.gameOver || gameState.paused}
            ariaLabel="Enter kana to control snake direction"
          />
          <div className="mt-2 text-sm text-gray-500">
            Use kana to control direction
          </div>
        </div>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {gameState.gameOver
          ? 'Game over. Press Restart to play again.'
          : `Snake moving ${gameState.direction}.`}
        {gameState.snake.length > 1 ? 'Prey captured' : ''}
      </div>
    </div>
  );
};

export default SnakeQuizMode;
