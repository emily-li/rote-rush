import { useCallback, useEffect, useState } from 'react';
import {
  getWeightedRandomCharacter,
  loadPracticeCharacters,
} from '@/lib/characterLoading';
import { recordCharacterAttempt } from '@/lib/characterStats';
import { adjustWeight } from '@/lib/quizUtils';
import { checkAnswerMatch, checkValidStart, normalizeInput } from '@/lib/validation';
import type { PracticeCharacter } from '@/types';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const INITIAL_SPEED = 1000;
const SPEED_INCREMENT = 50;
const MIN_SPEED = 200;

export type Block = {
  char: PracticeCharacter;
  x: number;
  y: number;
  id: number;
};

const createEmptyGrid = (): (PracticeCharacter | null)[][] =>
  Array.from({ length: GRID_HEIGHT }, () =>
    Array.from({ length: GRID_WIDTH }, () => null),
  );

export type UseKanaDropGameReturn = {
  grid: (PracticeCharacter | null)[][];
  fallingBlock: Block | null;
  score: number;
  streak: number;
  comboMultiplier: number;
  isWrongAnswer: boolean;
  gameOver: boolean;
  gameRunning: boolean;
  startGame: () => void;
  validateAndHandleInput: (input: string) => void;
  userInput: string;
  setUserInput: (input: string) => void;
};

const useKanaDropGame = (): UseKanaDropGameReturn => {
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
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [userInput, setUserInput] = useState('');

  const spawnNewBlock = useCallback(() => {
    const char = getWeightedRandomCharacter(characters);
    if (!char) return;

    const newBlock: Block = {
      char,
      x: Math.floor(Math.random() * GRID_WIDTH),
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
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setGameRunning(true);
    spawnNewBlock();
  }, [spawnNewBlock]);

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
    setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
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
      } else if (checkValidStart(normalizedValue, fallingBlock.char.validAnswers)) {
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

        const newGrid = grid.map((row) => row.slice());
        let finalY = GRID_HEIGHT - 1;
        for (let y = fallingBlock.y + 1; y < GRID_HEIGHT; y++) {
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

        // Reset isWrongAnswer after a short delay for visual feedback
        setTimeout(() => setIsWrongAnswer(false), 500);
      }
    },
    [fallingBlock, gameRunning, handleCorrectAnswer, grid, spawnNewBlock],
  );

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      if (!fallingBlock) {
        spawnNewBlock();
        return;
      }

      const { x, y } = fallingBlock;
      const nextY = y + 1;

      if (nextY >= GRID_HEIGHT || grid[nextY][x]) {
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
        setFallingBlock(null);
        spawnNewBlock();
      } else {
        setFallingBlock({ ...fallingBlock, y: nextY });
      }
    }, speed);

    return () => clearInterval(gameLoop);
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
    validateAndHandleInput,
    userInput,
    setUserInput,
  };
};

export default useKanaDropGame;

