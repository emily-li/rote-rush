import React, { useEffect, useRef } from 'react';
import { QuizInput } from '@/components/QuizInput';
import { SettingsButton } from '@/components/SettingsButton';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import DirectionIndicator from './DirectionIndicator';
import { SnakeGameBoard } from './SnakeGameBoard';

const SnakeQuizMode: React.FC = () => {
  const { gameState, inputValue, isInvalidInput, actions, helpers, timerControl } =
    useSnakeGame();
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
    <div className="snake-game-container">
      <div className="snake-settings-button">
        <SettingsButton timerControl={timerControl} />
      </div>

      <SnakeGameBoard
        gameState={gameState}
        handleRestart={actions.handleRestart}
      />

      <div className="snake-controls-container">
        <div className="snake-direction-grid">
          <div className="snake-direction-indicator-up">
            <DirectionIndicator
              direction="UP"
              getCharForDirection={helpers.getCharForDirectionString}
              isMatchingCharacter={helpers.isMatchingCharacter}
              currentDirection={gameState.direction}
            />
          </div>
          <div className="snake-direction-indicator-left">
            <DirectionIndicator
              direction="LEFT"
              getCharForDirection={helpers.getCharForDirectionString}
              isMatchingCharacter={helpers.isMatchingCharacter}
              currentDirection={gameState.direction}
            />
          </div>
          <div className="snake-direction-indicator-right">
            <DirectionIndicator
              direction="RIGHT"
              getCharForDirection={helpers.getCharForDirectionString}
              isMatchingCharacter={helpers.isMatchingCharacter}
              currentDirection={gameState.direction}
            />
          </div>
          <div className="snake-direction-indicator-down">
            <DirectionIndicator
              direction="DOWN"
              getCharForDirection={helpers.getCharForDirectionString}
              isMatchingCharacter={helpers.isMatchingCharacter}
              currentDirection={gameState.direction}
            />
          </div>
        </div>
        <div className="snake-input-container" ref={inputContainerRef}>
          <QuizInput
            value={inputValue}
            onChange={actions.handleInputChange}
            isWrongAnswer={false}
            isInvalid={isInvalidInput}
            disabled={gameState.gameOver || gameState.paused}
            ariaLabel="Enter kana to control snake direction"
          />
          <div className="snake-input-label">Use kana to control direction</div>
        </div>
      </div>
      <div
        className="snake-sr-live-region"
        aria-live="polite"
        aria-atomic="true"
      >
        {gameState.gameOver
          ? 'Game over. Press Restart to play again.'
          : `Snake moving ${gameState.direction}.`}
        {gameState.snake.length > 1 ? 'Food collected, snake grew longer.' : ''}
      </div>
    </div>
  );
};

export default SnakeQuizMode;
