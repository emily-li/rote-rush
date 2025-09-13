import { useCallback, useEffect, useState } from 'react';
import { RAIN_CONFIG } from '@/config/rain';
import {
  getWeightedRandomCharacter,
  loadPracticeCharacters,
} from '@/lib/characterLoading';
import { recordCharacterAttempt } from '@/lib/characterStats';
import { adjustWeight } from '@/lib/quizUtils';
import {
  checkAnswerMatch,
  checkValidStart,
  normalizeInput,
} from '@/lib/validation';
import type { PracticeCharacter } from '@/types';

export type Block = {
  char: PracticeCharacter;
  x: number;
  y: number;
  id: number;
};

const createEmptyGrid = (): (PracticeCharacter | null)[][] =>
  Array.from({ length: RAIN_CONFIG.GRID_HEIGHT }, () =>
    Array.from({ length: RAIN_CONFIG.GRID_WIDTH }, () => null),
  );

export type UseRainGameReturn = {
  grid: (PracticeCharacter | null)[][];
  fallingBlock: Block | null;
  score: number;
  streak: number;
  comboMultiplier: number;
  isWrongAnswer: boolean;
  isFlashingWrongAnswer: boolean;
  gameOver: boolean;
  gameRunning: boolean;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  validateAndHandleInput: (input: string) => void;
  userInput: string;
  setUserInput: (input: string) => void;
};

const useRainGame = (): UseRainGameReturn => {
  const [characters, setCharacters] = useState<PracticeCharacter[]>(() =>
    loadPracticeCharacters(),
  );
  const [grid, setGrid] =
    useState<(PracticeCharacter | null)[][]>(createEmptyGrid);
  const [fallingBlock, setFallingBlock] = useState<Block | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [isFlashingWrongAnswer, setIsFlashingWrongAnswer] = useState(false);
  const [speed, setSpeed] = useState<number>(RAIN_CONFIG.INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [userInput, setUserInput] = useState('');

  const spawnNewBlock = useCallback(() => {
    const char = getWeightedRandomCharacter(characters);
    if (!char) return;

    const newBlock: Block = {
      char,
      x: Math.floor(Math.random() * RAIN_CONFIG.GRID_WIDTH),
      y: 0,
      id: Date.now(),
    };

    if (grid[newBlock.y][newBlock.x]) {
      setGameOver(true);
      setGameRunning(false);
      return;
    }

    setFallingBlock(newBlock);
  }, [characters, grid]);

  const startGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setScore(0);
    setStreak(0);
    setComboMultiplier(1);
    setIsWrongAnswer(false);
    setIsFlashingWrongAnswer(false);
    setSpeed(RAIN_CONFIG.INITIAL_SPEED);
    setGameOver(false);
    setGameRunning(true);
    spawnNewBlock();
  }, [spawnNewBlock]);

  const pauseGame = useCallback(() => {
    setGameRunning(false);
  }, []);

  const resumeGame = useCallback(() => {
    setGameRunning(true);
  }, []);

  const handleCorrectAnswer = useCallback(() => {
    if (!fallingBlock) return;

    recordCharacterAttempt(fallingBlock.char.char, true);
    setCharacters((prev) =>
      adjustWeight(prev, fallingBlock.char.char, -0.1, 0.1),
    );
    const newMultiplier = 1 + Math.floor((streak + 1) / 10) * 0.1;
    setComboMultiplier(newMultiplier);
    setScore((prev) => prev + 10 * newMultiplier);
    setStreak((prev) => prev + 1);
    setIsWrongAnswer(false);
    setSpeed((prev) =>
      Math.max(RAIN_CONFIG.MIN_SPEED, prev - RAIN_CONFIG.SPEED_INCREMENT),
    );
    setFallingBlock(null);
    spawnNewBlock();
  }, [fallingBlock, spawnNewBlock, streak]);

  const validateAndHandleInput = useCallback(
    (value: string) => {
      if (!fallingBlock || !gameRunning) return;

      const normalizedValue = normalizeInput(value);

      if (checkAnswerMatch(normalizedValue, fallingBlock.char.validAnswers)) {
        handleCorrectAnswer();
        setUserInput('');
      } else if (
        checkValidStart(normalizedValue, fallingBlock.char.validAnswers)
      ) {
        setUserInput(normalizedValue);
      } else {
        // Invalid input: drop the block immediately
        recordCharacterAttempt(fallingBlock.char.char, false);
        setCharacters((prev) =>
          adjustWeight(prev, fallingBlock.char.char, 0.1, 0.1),
        );
        setStreak(0);
        setComboMultiplier(1);
        setIsWrongAnswer(true);
        setIsFlashingWrongAnswer(true); // Start flashing

        const newGrid = grid.map((row) => row.slice());
        let finalY = RAIN_CONFIG.GRID_HEIGHT - 1;
        for (let y = fallingBlock.y + 1; y < RAIN_CONFIG.GRID_HEIGHT; y++) {
          if (newGrid[y][fallingBlock.x]) {
            finalY = y - 1;
            break;
          }
        }
        newGrid[finalY][fallingBlock.x] = fallingBlock.char;
        setGrid(newGrid);

        setFallingBlock(null);
        spawnNewBlock();
        setUserInput('');

        // Reset isWrongAnswer and flashing after a short delay for visual feedback
        setTimeout(() => {
          setIsWrongAnswer(false);
          setIsFlashingWrongAnswer(false); // Stop flashing
        }, 500);
      }
    },
    [fallingBlock, gameRunning, handleCorrectAnswer, grid, spawnNewBlock],
  );

  useEffect(() => {
    let gameLoop: ReturnType<typeof setInterval> | undefined;

    if (gameRunning && !gameOver) {
      gameLoop = setInterval(() => {
        if (!fallingBlock) {
          spawnNewBlock();
          return;
        }

        const { x, y } = fallingBlock;
        const nextY = y + 1;

        if (nextY >= RAIN_CONFIG.GRID_HEIGHT || grid[nextY][x]) {
          const newGrid = grid.map((row) => row.slice());
          newGrid[y][x] = fallingBlock.char;
          setGrid(newGrid);
          recordCharacterAttempt(fallingBlock.char.char, false);
          setCharacters((prev) =>
            adjustWeight(prev, fallingBlock.char.char, 0.1, 0.1),
          );
          setStreak(0);
          setComboMultiplier(1);
          setIsWrongAnswer(true);
          setIsFlashingWrongAnswer(true); // Start flashing
          setFallingBlock(null);
          spawnNewBlock();
          // Reset isWrongAnswer and flashing after a short delay for visual feedback
          setTimeout(() => {
            setIsWrongAnswer(false);
            setIsFlashingWrongAnswer(false); // Stop flashing
          }, 500);
        } else {
          setFallingBlock({ ...fallingBlock, y: nextY });
        }
      }, speed);
    }

    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
    };
  }, [fallingBlock, grid, gameOver, gameRunning, speed, spawnNewBlock]);

  return {
    grid,
    fallingBlock,
    score,
    streak,
    comboMultiplier,
    isWrongAnswer,
    gameOver,
    gameRunning,
    startGame,
    pauseGame,
    resumeGame,
    validateAndHandleInput,
    userInput,
    setUserInput,
    isFlashingWrongAnswer,
  };
};

export default useRainGame;
