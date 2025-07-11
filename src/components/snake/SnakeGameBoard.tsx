import React from 'react';
import { SNAKE_CONFIG } from '@/config/snake';
import { GameState } from '@/hooks/useSnakeGame';
import { useWindowSize } from '@/hooks/useWindowSize';

const { GRID_SIZE, CELL_SIZE, GRID_PADDING, GRID_MARGIN_BOTTOM } = SNAKE_CONFIG;

type SnakeGameBoardProps = {
  gameState: GameState;
  handleRestart: () => void;
};

export const SnakeGameBoard: React.FC<SnakeGameBoardProps> = ({
  gameState,
  handleRestart,
}) => {
  const windowSize = useWindowSize();

  const gridStyle = {
    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    maxWidth: Math.min(windowSize.width - GRID_PADDING, GRID_SIZE * CELL_SIZE),
    maxHeight: Math.min(
      windowSize.height - GRID_MARGIN_BOTTOM,
      GRID_SIZE * CELL_SIZE,
    ),
  };

  const cellSizeStyle = {
    width: CELL_SIZE,
    height: CELL_SIZE,
    maxWidth:
      Math.min(windowSize.width - GRID_PADDING, GRID_SIZE * CELL_SIZE) /
      GRID_SIZE,
    maxHeight:
      Math.min(windowSize.height - GRID_MARGIN_BOTTOM, GRID_SIZE * CELL_SIZE) /
      GRID_SIZE,
  };

  return (
    <div className="snake-game-board-container">
      <div
        className="snake-grid"
        style={gridStyle}
        role="grid"
        aria-label="Snake game grid"
        tabIndex={-1}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnakeHead =
            gameState.snake[0][0] === x && gameState.snake[0][1] === y;
          const isSnakeBody = gameState.snake.some(
            ([sx, sy]) => sx === x && sy === y && !isSnakeHead,
          );
          const isFood = gameState.food[0] === x && gameState.food[1] === y;
          const cellLabel = isSnakeHead
            ? 'Snake head'
            : isSnakeBody
              ? 'Snake body'
              : isFood
                ? 'Food'
                : 'Empty cell';

          return (
            <div
              key={`${x}-${y}`}
              className={`border-none ${
              isSnakeHead
                  ? 'bg-fuchsia-700'
                  : isSnakeBody
                    ? 'bg-fuchsia-600'
                    : isFood
                      ? 'bg-green-500'
                      : 'bg-gray-800'
              }`}
              style={cellSizeStyle}
              role="gridcell"
              aria-label={`${cellLabel} at position ${x}, ${y}`}
            />
          );
        })}
      </div>
      {gameState.gameOver && (
        <div
          className="snake-game-over-overlay"
          style={{
            top: 0,
            left: 0,
            width: gridStyle.width,
            height: gridStyle.height,
          }}
        >
          <div className="snake-game-over-modal">
            <h2 className="snake-game-over-title">Game Over</h2>
            <button
              onClick={handleRestart}
              className="snake-restart-button"
              aria-label="Restart game"
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
