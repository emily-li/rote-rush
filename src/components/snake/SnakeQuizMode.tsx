import React, { useEffect, useRef } from 'react';
import { QuizInput } from '@/components/QuizInput';
import { SettingsButton } from '@/components/SettingsButton';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import DirectionPad from './DirectionPad';
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

  useEffect(() => {
    if (!gameState.gameOver && !gameState.paused && inputContainerRef.current) {
      const input = inputContainerRef.current.querySelector('input');
      if (input) {
        input.focus();
      }
    }
  }, [gameState.gameOver, gameState.paused]);

  return (
    <div className="flex h-screen flex-col items-center bg-fuchsia-50 pt-24 text-gray-700">
      <div className="absolute right-4 top-4 z-20">
        <SettingsButton timerControl={timerControl} />
      </div>

      <SnakeGameBoard
        gameState={gameState}
        handleRestart={actions.handleRestart}
      />

      <div className="mt-24 flex flex-col items-center">
        <DirectionPad
          helpers={helpers}
          currentDirection={gameState.direction}
        />

        <div
          className="mt-8 flex flex-col items-center"
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
