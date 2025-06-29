import { useCallback, useEffect, useState } from 'react';
import { useQuizGame } from '@/hooks/useQuizGame';
import { getWeightedRandomCharacter } from '@/lib/characterLoading';
import type {
  PracticeCharacter,
  SimpleQuizModeState,
  TimerConfig,
} from '@/types';

export type SpiralCharacter = {
  readonly char: PracticeCharacter;
  readonly id: string;
};

type UseSpiralQuizParams = {
  timerConfig: TimerConfig;
};

type UseSpiralQuizReturn = SimpleQuizModeState & {
  spiralCharacters: SpiralCharacter[];
  getCharacterStyle: (spiralChar: SpiralCharacter) => React.CSSProperties;
};

// --- Constants for magic numbers ---
const MAX_RADIUS_WIDTH_RATIO = 0.35;
const MAX_RADIUS_HEIGHT_RATIO = 0.25;
const MIN_CHAR_SPACING = 48;
const TOTAL_TURNS = 3;
const MAX_CHARACTERS = 30;
const MIN_CHARACTERS = 15;
const BASE_AREA = 1920 * 1080;

// --- SSR-safe window size hook ---
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : BASE_AREA ** 0.5,
    height:
      typeof window !== 'undefined' ? window.innerHeight : BASE_AREA ** 0.5,
  });
  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

// --- Unique ID generator ---
let spiralIdCounter = 0;
function getUniqueSpiralId(prefix = 'spiral') {
  spiralIdCounter += 1;
  return `${prefix}-${spiralIdCounter}`;
}

function calculateCharacterCount(width: number, height: number): number {
  const viewportArea = width * height;
  const areaRatio = Math.min(1, viewportArea / BASE_AREA);
  return Math.max(
    MIN_CHARACTERS,
    Math.floor(MIN_CHARACTERS + (MAX_CHARACTERS - MIN_CHARACTERS) * areaRatio),
  );
}

export const useSpiralQuiz = ({
  timerConfig,
}: UseSpiralQuizParams): UseSpiralQuizReturn => {
  const { width, height } = useWindowSize();
  const [spiralCharacters, setSpiralCharacters] = useState<SpiralCharacter[]>(
    [],
  );

  // --- Helper for division by zero ---
  function safeDivide(numerator: number, denominator: number, fallback = 0) {
    return denominator === 0 ? fallback : numerator / denominator;
  }

  // --- Helper for font size and opacity ---
  function getFontSize(
    isHead: boolean,
    position: number,
    totalCharacters: number,
  ): string {
    if (isHead) return 'clamp(3rem, 8vw, 6rem)';
    const normalizedPosition = safeDivide(position, totalCharacters - 1, 0);
    const sizeMultiplier = 1 - normalizedPosition * 0.6;
    return `clamp(1.5rem, ${6 * sizeMultiplier}vw, ${4 * sizeMultiplier}rem)`;
  }
  function getOpacity(isHead: boolean, position: number): number {
    if (isHead) return 1.0;
    if (position === 1) return 0.3;
    return Math.max(0.2, 0.3 - (position - 1) * 0.05);
  }

  // --- Stable advanceCharacters ---
  const advanceCharacters = useCallback(() => {
    setSpiralCharacters((prev) => {
      // Remove the first character (head), shift all others forward, add a new one at the end
      const newChars = prev.slice(1);
      const newChar: SpiralCharacter = {
        char: getWeightedRandomCharacter(quizGame.characterState.characters),
        id: getUniqueSpiralId(),
      };
      return [...newChars, newChar];
    });
  }, []);

  const quizGame = useQuizGame({
    timerConfig,
    onCharacterComplete: advanceCharacters,
  });

  // Sync spiralCharacters[0].char with currentChar, but only on correct answer
  useEffect(() => {
    if (
      quizGame.characterState.currentChar &&
      !quizGame.scoreState.isWrongAnswer
    ) {
      setSpiralCharacters((prev) => {
        if (prev.length === 0) return prev;
        const updated = [
          { ...prev[0], char: quizGame.characterState.currentChar },
          ...prev.slice(1),
        ];
        return updated;
      });
    }
  }, [quizGame.characterState.currentChar, quizGame.scoreState.isWrongAnswer]);

  const initializeSpiral = useCallback(() => {
    const characterCount = calculateCharacterCount(width, height);
    const initialSpiral: SpiralCharacter[] = [];
    initialSpiral.push({
      char: quizGame.characterState.currentChar,
      id: getUniqueSpiralId('spiral-0'),
    });
    for (let i = 1; i < characterCount; i++) {
      initialSpiral.push({
        char: getWeightedRandomCharacter(quizGame.characterState.characters),
        id: getUniqueSpiralId(`spiral-${i}`),
      });
    }
    setSpiralCharacters(initialSpiral);
  }, [
    quizGame.characterState.characters,
    quizGame.characterState.currentChar,
    width,
    height,
  ]);

  const getSpiralCoordinates = useCallback(
    (position: number, totalCharacters: number) => {
      if (position === 0) {
        return { x: 0, y: 0 };
      }
      const maxRadius = Math.min(
        width * MAX_RADIUS_WIDTH_RATIO,
        height * MAX_RADIUS_HEIGHT_RATIO,
      );
      const minSteps = Math.ceil(maxRadius / MIN_CHAR_SPACING);
      const steps = Math.max(totalCharacters - 1, minSteps);
      const angleStep = (TOTAL_TURNS * 2 * Math.PI) / steps;
      const radiusStep = maxRadius / steps;
      const angle = position * angleStep;
      const radius = position * radiusStep;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { x, y };
    },
    [width, height],
  );

  const getCharacterStyle = useCallback(
    (spiralChar: SpiralCharacter, position?: number) => {
      // position is now always passed in from the array index
      const totalCharacters = spiralCharacters.length;
      const pos =
        position ?? spiralCharacters.findIndex((c) => c.id === spiralChar.id);
      const { x, y } = getSpiralCoordinates(pos, totalCharacters);
      const isHead = pos === 0;
      let scale = 1;
      if (isHead) {
        const timerProgress =
          1 - quizGame.timerState.timeLeft / quizGame.timerState.currentTimeMs;
        const baseScale = 1.0;
        const maxScale = 2.0;
        scale = baseScale + (maxScale - baseScale) * timerProgress;
        if (
          quizGame.timerState.timeLeft <=
          quizGame.timerState.currentTimeMs * 0.1
        ) {
          const whooshProgress =
            1 -
            quizGame.timerState.timeLeft /
              (quizGame.timerState.currentTimeMs * 0.1);
          scale *= 1 + whooshProgress * 0.5;
        }
      }
      return {
        position: 'absolute' as const,
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        fontSize: getFontSize(isHead, pos, totalCharacters),
        opacity: getOpacity(isHead, pos),
        zIndex: isHead ? 1000 : 1,
      };
    },
    [
      spiralCharacters.length,
      quizGame.timerState.timeLeft,
      quizGame.timerState.currentTimeMs,
      getSpiralCoordinates,
    ],
  );

  useEffect(() => {
    initializeSpiral();
  }, [initializeSpiral]);

  return {
    ...quizGame,
    spiralCharacters,
    getCharacterStyle,
  };
};
