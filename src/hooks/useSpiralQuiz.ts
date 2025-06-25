import { useCallback, useEffect, useState } from 'react';
import { useQuizGame } from '@/hooks/useQuizGame';
import { getWeightedRandomCharacter } from '@/lib/characterLoading';
import type {
  PracticeCharacter,
  SimpleQuizModeState,
  TimerConfig,
} from '@/types';

export type SpiralCharacter = {
  char: PracticeCharacter;
  id: string;
  position: number;
};

type UseSpiralQuizParams = {
  timerConfig: TimerConfig;
};

type UseSpiralQuizReturn = SimpleQuizModeState & {
  spiralCharacters: SpiralCharacter[];
  getCharacterStyle: (spiralChar: SpiralCharacter) => React.CSSProperties;
};

function calculateCharacterCount(): number {
  const viewportArea = window.innerWidth * window.innerHeight;
  const baseArea = 1920 * 1080;
  const maxCharacters = 30;
  const minCharacters = 15;
  const areaRatio = Math.min(1, viewportArea / baseArea);
  return Math.max(
    minCharacters,
    Math.floor(minCharacters + (maxCharacters - minCharacters) * areaRatio),
  );
}

export const useSpiralQuiz = ({
  timerConfig,
}: UseSpiralQuizParams): UseSpiralQuizReturn => {
  const quizGame = useQuizGame({
    timerConfig,
    onCharacterComplete: advanceCharacters,
  });
  const [spiralCharacters, setSpiralCharacters] = useState<SpiralCharacter[]>(
    [],
  );

  // Sync spiralCharacters[0].char with currentChar
  useEffect(() => {
    if (quizGame.characterState.currentChar) {
      setSpiralCharacters((prev) => {
        if (prev.length === 0) return prev;
        const updated = [
          { ...prev[0], char: quizGame.characterState.currentChar },
          ...prev.slice(1),
        ];
        return updated;
      });
    }
  }, [quizGame.characterState.currentChar]);

  const initializeSpiral = useCallback(() => {
    const characterCount = calculateCharacterCount();
    const initialSpiral: SpiralCharacter[] = [];
    // Use the currentChar as the head
    initialSpiral.push({
      char: quizGame.characterState.currentChar,
      id: `spiral-0-${Date.now()}`,
      position: 0,
    });
    for (let i = 1; i < characterCount; i++) {
      initialSpiral.push({
        char: getWeightedRandomCharacter(quizGame.characterState.characters),
        id: `spiral-${i}-${Date.now()}`,
        position: i,
      });
    }
    setSpiralCharacters(initialSpiral);
  }, [quizGame.characterState.characters, quizGame.characterState.currentChar]);

  const getSpiralCoordinates = useCallback(
    (position: number, totalCharacters: number) => {
      if (position === 0) {
        return { x: 0, y: 0 };
      }
      const maxRadius = Math.min(
        window.innerWidth * 0.35,
        window.innerHeight * 0.25,
      );
      const minCharSpacing = 48; // px, estimated min character size
      const totalTurns = 3;
      const maxAngle = totalTurns * 2 * Math.PI;
      // Calculate the minimum number of steps needed to avoid overlap
      const minSteps = Math.ceil(maxRadius / minCharSpacing);
      const steps = Math.max(totalCharacters - 1, minSteps);
      const angleStep = maxAngle / steps;
      const radiusStep = maxRadius / steps;
      const angle = position * angleStep;
      const radius = position * radiusStep;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { x, y };
    },
    [],
  );

  const getCharacterStyle = useCallback(
    (spiralChar: SpiralCharacter) => {
      const { position } = spiralChar;
      const totalCharacters = spiralCharacters.length;
      const { x, y } = getSpiralCoordinates(position, totalCharacters);
      const isHead = position === 0;
      let fontSize: string;
      let opacity: number;
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
        fontSize = `clamp(3rem, 8vw, 6rem)`;
        opacity = 1.0;
      } else {
        const normalizedPosition = position / (totalCharacters - 1);
        const sizeMultiplier = 1 - normalizedPosition * 0.6;
        if (position === 1) {
          opacity = 0.3;
        } else {
          opacity = Math.max(0.2, 0.3 - (position - 1) * 0.05);
        }
        fontSize = `clamp(1.5rem, ${6 * sizeMultiplier}vw, ${4 * sizeMultiplier}rem)`;
      }
      return {
        position: 'absolute' as const,
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        fontSize,
        opacity,
        fontWeight: isHead ? 'bold' : 'normal',
        color: 'rgb(107 114 128)',
        textShadow: isHead ? '0 0 20px rgba(217, 70, 239, 0.8)' : 'none',
        zIndex: isHead ? 1000 : 1,
        transition: isHead
          ? 'transform 0.1s ease-out'
          : 'opacity 0.3s ease-out',
        pointerEvents: 'none' as const,
      };
    },
    [
      spiralCharacters.length,
      quizGame.timerState.timeLeft,
      quizGame.timerState.currentTimeMs,
      getSpiralCoordinates,
    ],
  );

  function advanceCharacters() {
    setSpiralCharacters((prev) => {
      const advanced = prev.map((char) => ({
        ...char,
        position: Math.max(0, char.position - 1),
      }));
      const maxPosition = Math.max(...advanced.map((c) => c.position), 0);
      const newChar: SpiralCharacter = {
        char: getWeightedRandomCharacter(quizGame.characterState.characters),
        id: `spiral-${Date.now()}`,
        position: maxPosition + 1,
      };
      const updated = [...advanced, newChar];
      return updated;
    });
  }

  useEffect(() => {
    initializeSpiral();
  }, [initializeSpiral]);

  return {
    ...quizGame,
    spiralCharacters,
    getCharacterStyle,
  };
};
