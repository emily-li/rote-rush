import React, { useEffect, useReducer, useRef, useState } from 'react';
import { QuizInput } from '@/components/QuizInput';
import { SettingsButton } from '@/components/SettingsButton';
import { SNAKE_CONFIG } from '@/config/snake';
import { useWindowSize } from '@/hooks/useWindowSize';
import { getMultipleRandomCharacters } from '@/lib/characterLoading';

import {
  checkCollision,
  Direction,
  getNextSnakeHead,
  getRandomPosition,
  getUpdatedSnake,
  SnakePosition,
} from '@/lib/snakeUtils';
import { checkAnswerMatch, checkValidStart } from '@/lib/validation';
import type { PracticeCharacter } from '@/types';
import DirectionIndicator from './DirectionIndicator';

const {
  GRID_SIZE,
  CELL_SIZE,
  INITIAL_MOVEMENT_INTERVAL,
  MOVEMENT_INTERVAL,
  GRID_PADDING,
  GRID_MARGIN_BOTTOM,
} = SNAKE_CONFIG;

type GameState = {
  snake: SnakePosition[];
  food: SnakePosition;
  direction: Direction;
  gameOver: boolean;
  movementInterval: number;
};

type GameAction =
  | { type: 'MOVE_SNAKE'; newDirection?: Direction }
  | { type: 'SET_DIRECTION'; direction: Direction }
  | { type: 'COLLECT_FOOD' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART' };

export const initialState: GameState = {
  snake: [[9, 9]],
  food: [5, 5],
  direction: 'RIGHT',
  gameOver: false,
  movementInterval: INITIAL_MOVEMENT_INTERVAL,
};

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'MOVE_SNAKE': {
      if (state.gameOver) return state;
      const direction = action.newDirection || state.direction;
      const head = getNextSnakeHead(state.snake[0], direction);
      if (checkCollision(head, state.snake)) {
        return { ...state, gameOver: true };
      }
      const newSnake = getUpdatedSnake(state.snake, head, state.food);
      const newFood =
        head[0] === state.food[0] && head[1] === state.food[1]
          ? getRandomPosition(newSnake)
          : state.food;
      const newInterval =
        newSnake.length > state.snake.length
          ? MOVEMENT_INTERVAL
          : state.movementInterval;
      return {
        ...state,
        snake: newSnake,
        food: newFood,
        direction,
        movementInterval: newInterval,
      };
    }
    case 'SET_DIRECTION':
      return state.gameOver
        ? state
        : { ...state, direction: action.direction };
    case 'GAME_OVER':
      return { ...state, gameOver: true };
    case 'RESTART':
      return initialState;
    default:
      return state;
  }
};

const initializeDirectionMap = (): Record<Direction, PracticeCharacter> => {
  const chars = getMultipleRandomCharacters(4);
  return {
    UP: chars[0],
    DOWN: chars[1],
    LEFT: chars[2],
    RIGHT: chars[3],
  };
};

const SnakeQuizMode: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const [inputValue, setInputValue] = useState('');
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const [directionCharacterMap, setDirectionCharacterMap] = useState<
    Record<Direction, PracticeCharacter>
  >(initializeDirectionMap());
  const windowSize = useWindowSize();
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!gameState.gameOver && inputContainerRef.current) {
      const input = inputContainerRef.current.querySelector('input');
      if (input) {
        input.focus();
      }
    }
  }, [gameState.gameOver]);

  useEffect(() => {
    if (gameState.gameOver) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      dispatch({ type: 'MOVE_SNAKE' });
    }, gameState.movementInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameState.gameOver, gameState.movementInterval]);

  useEffect(() => {
    // No need to convert inputValue to Kana here for direction matching
    // const convertedInput = convertRomajiToKana(inputValue, 'katakana');

    let matchedDirection: Direction | undefined;

    // Iterate through the directionCharacterMap to find a matching direction
    for (const directionKey in directionCharacterMap) {
      const charForDirection = directionCharacterMap[directionKey as Direction];
      if (
        // Check if the raw inputValue (Romaji) matches any of the validAnswers (Romaji)
        checkAnswerMatch(inputValue, charForDirection?.validAnswers)
      ) {
        matchedDirection = directionKey as Direction;
        break; // Found a match, no need to continue
      }
    }

    if (matchedDirection) {
      // Only change direction if it's different from the current one
      // and not the opposite of the current direction
      if (matchedDirection !== gameState.direction) {
        dispatch({ type: 'SET_DIRECTION', direction: matchedDirection });
        setInputValue('');
      }
    } else if (inputValue) {
      // This block handles invalid input or partial matches
      // It should check against all possible valid answers for all directions
      const allDirectionValidAnswers = Object.values(directionCharacterMap).flatMap(
        (char) => char?.validAnswers || [],
      );

      const isInputPartialMatchForAnyDirection = allDirectionValidAnswers.some(
        (answer) => checkValidStart(inputValue, [answer])
      );

      if (!isInputPartialMatchForAnyDirection) {
        setIsInvalidInput(true);
        setInputValue('');
        setTimeout(() => {
          setIsInvalidInput(false);
        }, 300);
      }
    }
  }, [inputValue, directionCharacterMap, gameState.direction, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const isMatchingCharacter = (char: string): boolean => {
    // Find the PracticeCharacter associated with the 'char' being displayed by the DirectionIndicator
    const practiceCharForIndicator = Object.values(directionCharacterMap).find(
      (pc) => pc.char === char,
    );

    if (!practiceCharForIndicator) {
      return false; // Should not happen if char comes from directionCharacterMap
    }

    // Check if the current inputValue is a valid start for any of the validAnswers of this character
    return checkValidStart(inputValue, practiceCharForIndicator.validAnswers);
  };

  const getCharForDirectionString = (dir: Direction): string => {
    return directionCharacterMap[dir]?.char ?? '';
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
    setInputValue('');
    setDirectionCharacterMap(initializeDirectionMap());
  };

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
    <div className="flex h-screen flex-col items-center justify-center bg-fuchsia-50 text-gray-700">
      <div className="relative flex w-full max-w-md flex-col items-center">
        <div className="absolute right-4 top-4 z-20">
          <SettingsButton />
        </div>
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
                style={cellSizeStyle}
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
              width: gridStyle.width,
              height: gridStyle.height,
            }}
          >
            <div className="rounded-lg bg-gray-200 p-6 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-700">
                Game Over
              </h2>
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
      <div className="mt-4 flex flex-col items-center">
        <div className="grid w-32 grid-cols-3 gap-1">
          <div className="col-start-2 row-start-1 flex items-center justify-center">
            <DirectionIndicator
              direction="UP"
              getCharForDirection={getCharForDirectionString}
              isMatchingCharacter={isMatchingCharacter}
              currentDirection={gameState.direction}
            />
          </div>
          <div className="col-start-1 row-start-2 flex items-center justify-center">
            <DirectionIndicator
              direction="LEFT"
              getCharForDirection={getCharForDirectionString}
              isMatchingCharacter={isMatchingCharacter}
              currentDirection={gameState.direction}
            />
          </div>
          <div className="col-start-3 row-start-2 flex items-center justify-center">
            <DirectionIndicator
              direction="RIGHT"
              getCharForDirection={getCharForDirectionString}
              isMatchingCharacter={isMatchingCharacter}
              currentDirection={gameState.direction}
            />
          </div>
          <div className="col-start-2 row-start-3 flex items-center justify-center">
            <DirectionIndicator
              direction="DOWN"
              getCharForDirection={getCharForDirectionString}
              isMatchingCharacter={isMatchingCharacter}
              currentDirection={gameState.direction}
            />
          </div>
        </div>
        <div
          className="mt-2 flex flex-col items-center"
          ref={inputContainerRef}
        >
          <QuizInput
            value={inputValue}
            onChange={handleInputChange}
            isWrongAnswer={false}
            isInvalid={isInvalidInput}
            disabled={gameState.gameOver}
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
        {gameState.snake.length > initialState.snake.length
          ? 'Food collected, snake grew longer.'
          : ''}
      </div>
    </div>
  );
};

export default SnakeQuizMode;
