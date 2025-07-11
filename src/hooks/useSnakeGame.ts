import { useEffect, useReducer, useRef, useState } from 'react';
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

export type GameState = {
  snake: SnakePosition[];
  food: SnakePosition;
  direction: Direction;
  gameOver: boolean;
  movementInterval: number;
  paused: boolean;
};

type GameAction =
  | { type: 'MOVE_SNAKE'; newDirection?: Direction }
  | { type: 'SET_DIRECTION'; direction: Direction }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' };

export const initialState: GameState = {
  snake: [[9, 9]],
  food: [5, 5],
  direction: 'RIGHT',
  gameOver: false,
  movementInterval: 750,
  paused: false,
};

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'MOVE_SNAKE': {
      if (state.gameOver || state.paused) return state;
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
        newSnake.length > state.snake.length ? 350 : state.movementInterval;
      return {
        ...state,
        snake: newSnake,
        food: newFood,
        direction,
        movementInterval: newInterval,
      };
    }
    case 'SET_DIRECTION':
      return state.gameOver ? state : { ...state, direction: action.direction };
    case 'GAME_OVER':
      return { ...state, gameOver: true };
    case 'RESTART':
      return initialState;
    case 'PAUSE':
      return { ...state, paused: true };
    case 'RESUME':
      return { ...state, paused: false };
    default:
      return state;
  }
};

const getValidDirections = (dir: Direction): Direction[] => {
  switch (dir) {
    case 'UP':
    case 'DOWN':
      return ['LEFT', 'RIGHT'];
    case 'LEFT':
    case 'RIGHT':
      return ['UP', 'DOWN'];
  }
};

const generateDirectionMap = (
  direction: Direction,
): Record<Direction, PracticeCharacter | null> => {
  const newChars = getMultipleRandomCharacters(2);
  const validDirections = getValidDirections(direction);
  const newMap: Record<Direction, PracticeCharacter | null> = {
    UP: null,
    DOWN: null,
    LEFT: null,
    RIGHT: null,
  };
  newMap[validDirections[0]] = newChars[0];
  newMap[validDirections[1]] = newChars[1];
  return newMap;
};

export const useSnakeGame = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const [directionCharacterMap, setDirectionCharacterMap] = useState(() =>
    generateDirectionMap(initialState.direction),
  );
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (
        !lastUpdateTime ||
        timestamp - lastUpdateTime >= gameState.movementInterval
      ) {
        setLastUpdateTime(timestamp);
        dispatch({ type: 'MOVE_SNAKE' });
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    if (!gameState.gameOver && !gameState.paused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    gameState.gameOver,
    gameState.paused,
    gameState.movementInterval,
    lastUpdateTime,
  ]);

  useEffect(() => {
    if (gameState.paused) return;
    let matchedDirection: Direction | undefined;

    for (const directionKey in directionCharacterMap) {
      const charForDirection = directionCharacterMap[directionKey as Direction];
      if (checkAnswerMatch(inputValue, charForDirection?.validAnswers)) {
        matchedDirection = directionKey as Direction;
        break;
      }
    }

    if (matchedDirection) {
      const isOpposite =
        (gameState.direction === 'UP' && matchedDirection === 'DOWN') ||
        (gameState.direction === 'DOWN' && matchedDirection === 'UP') ||
        (gameState.direction === 'LEFT' && matchedDirection === 'RIGHT') ||
        (gameState.direction === 'RIGHT' && matchedDirection === 'LEFT');

      if (matchedDirection !== gameState.direction && !isOpposite) {
        dispatch({ type: 'SET_DIRECTION', direction: matchedDirection });
        setInputValue('');
        setDirectionCharacterMap(generateDirectionMap(matchedDirection));
      }
    } else if (inputValue) {
      const allDirectionValidAnswers = Object.values(
        directionCharacterMap,
      ).flatMap((char) => char?.validAnswers || []);

      const isInputPartialMatchForAnyDirection = allDirectionValidAnswers.some(
        (answer) => checkValidStart(inputValue, [answer]),
      );

      if (!isInputPartialMatchForAnyDirection) {
        setIsInvalidInput(true);
        setInputValue('');
        setTimeout(() => {
          setIsInvalidInput(false);
        }, 300);
      }
    }
  }, [
    inputValue,
    directionCharacterMap,
    gameState.direction,
    gameState.paused,
    dispatch,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
    setInputValue('');
    setDirectionCharacterMap(generateDirectionMap(initialState.direction));
  };

  const isMatchingCharacter = (char: string): boolean => {
    const practiceCharForIndicator = Object.values(directionCharacterMap).find(
      (pc) => pc?.char === char,
    );

    if (!practiceCharForIndicator) {
      return false;
    }

    return checkValidStart(inputValue, practiceCharForIndicator.validAnswers);
  };

  const getCharForDirectionString = (dir: Direction): string => {
    return directionCharacterMap[dir]?.char ?? '';
  };

  const pauseTimer = () => dispatch({ type: 'PAUSE' });
  const resumeTimer = () => dispatch({ type: 'RESUME' });

  return {
    gameState,
    inputValue,
    isInvalidInput,
    directionCharacterMap,
    actions: {
      handleInputChange,
      handleRestart,
    },
    helpers: {
      isMatchingCharacter,
      getCharForDirectionString,
    },
    timerControl: {
      pauseTimer,
      resumeTimer,
    },
  };
};
