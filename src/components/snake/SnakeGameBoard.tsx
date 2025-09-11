import React from 'react';
import { SNAKE_CONFIG } from '@/config/snake';
import { GameState } from '@/hooks/useSnakeGame';
import { useWindowSize } from '@/hooks/useWindowSize';

const { GRID_SIZE, GRID_PADDING, GRID_MARGIN_BOTTOM } = SNAKE_CONFIG;

type SnakeGameBoardProps = {
  gameState: GameState;
  handleRestart: () => void;
};

export const SnakeGameBoard: React.FC<SnakeGameBoardProps> = ({
  gameState,
  handleRestart,
}) => {
  const windowSize = useWindowSize();

  const visualGridSize = GRID_SIZE * 2;
  const gridStyle = {
    gridTemplateColumns: `repeat(${visualGridSize}, 1fr)`,
    gridTemplateRows: `repeat(${visualGridSize}, 1fr)`,
    width: '100%',
    aspectRatio: '1 / 1',
    maxWidth:
      2 *
      Math.min(
        windowSize.width - GRID_PADDING,
        windowSize.height - GRID_MARGIN_BOTTOM,
      ),
    maxHeight:
      2 *
      Math.min(
        windowSize.width - GRID_PADDING,
        windowSize.height - GRID_MARGIN_BOTTOM,
      ),
  };

  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center">
      <div
        className="grid border-none bg-gray-800"
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
              style={{
                gridColumnStart: x * 2 + 1,
                gridColumnEnd: x * 2 + 3,
                gridRowStart: y * 2 + 1,
                gridRowEnd: y * 2 + 3,
              }}
              role="gridcell"
              aria-label={`${cellLabel} at position ${x}, ${y}`}
            />
          );
        })}
      </div>
      {gameState.gameOver && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75"
          style={{
            top: 0,
            left: 0,
            width: gridStyle.maxWidth,
            height: gridStyle.maxHeight,
          }}
        >
          <div className="rounded-lg bg-gray-200 p-6 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-700">Game Over</h2>
            <button
              onClick={handleRestart}
              className="rounded bg-fuchsia-800 px-4 py-2 text-white hover:bg-fuchsia-700"
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
