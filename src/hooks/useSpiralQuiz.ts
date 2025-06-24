import { useCallback, useEffect, useState } from 'react';
import { getWeightedRandomCharacter } from '@/lib/characterLoading';
import type { PracticeCharacter, TimerConfig } from '@/types';
import { SimpleQuizModeState, useQuizGame } from './useQuizGame';

interface SpiralCharacter {
  char: PracticeCharacter;
  id: string;
  position: number; // 0 = center/head, highest = tail
}

interface UseSpiralQuizParams {
  timerConfig: TimerConfig;
}

interface UseSpiralQuizReturn extends SimpleQuizModeState {
  spiralCharacters: SpiralCharacter[];
  getCharacterStyle: (spiralChar: SpiralCharacter) => React.CSSProperties;
}

// Calculate responsive character count based on viewport
function calculateCharacterCount(): number {
  const viewportArea = window.innerWidth * window.innerHeight;
  const baseArea = 1920 * 1080; // Base reference area
  const maxCharacters = 30;
  const minCharacters = 15;

  const areaRatio = Math.min(1, viewportArea / baseArea);
  return Math.max(
    minCharacters,
    Math.floor(minCharacters + (maxCharacters - minCharacters) * areaRatio),
  );
}

/**
 * Hook for Spiral Quiz mode specific functionality
 * Extends the base useQuizGame hook with spiral-specific features
 */
export const useSpiralQuiz = ({
  timerConfig,
}: UseSpiralQuizParams): UseSpiralQuizReturn => {
  // Use the base quiz game logic
  const quizGame = useQuizGame({
    timerConfig,
    onCharacterComplete: advanceCharacters,
  });
  // Spiral-specific state
  const [spiralCharacters, setSpiralCharacters] = useState<SpiralCharacter[]>(
    [],
  );

  // Initialize spiral with characters
  const initializeSpiral = useCallback(() => {
    const characterCount = calculateCharacterCount();
    const initialSpiral: SpiralCharacter[] = [];

    for (let i = 0; i < characterCount; i++) {
      initialSpiral.push({
        char: getWeightedRandomCharacter(quizGame.characters),
        id: `spiral-${i}-${Date.now()}`,
        position: i, // 0 = center/head, higher = further out
      });
    }

    setSpiralCharacters(initialSpiral);
  }, [quizGame.characters]);

  // Calculate spiral path coordinates for a character
  const getSpiralCoordinates = useCallback(
    (position: number, totalCharacters: number) => {
      if (position === 0) {
        // Head character is always at center
        return { x: 0, y: 0 };
      }

      const maxRadius = Math.min(
        window.innerWidth * 0.35,
        window.innerHeight * 0.25,
      );

      // Create a continuous spiral like the classic spiral shape
      // Start from center and wind outward with increasing radius and angle
      const totalTurns = 3; // Number of complete spirals from center to edge

      // Calculate spiral parameters
      const maxAngle = totalTurns * 2 * Math.PI;
      const angleStep = maxAngle / (totalCharacters - 1);
      const radiusStep = maxRadius / (totalCharacters - 1);

      // For this position, calculate angle and radius
      const angle = position * angleStep;
      const radius = position * radiusStep;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return { x, y };
    },
    [],
  );

  // Calculate character style based on position in spiral
  const getCharacterStyle = useCallback(
    (spiralChar: SpiralCharacter) => {
      const { position } = spiralChar;
      const totalCharacters = spiralCharacters.length;
      const { x, y } = getSpiralCoordinates(position, totalCharacters);

      const isHead = position === 0;

      // Calculate size and opacity gradients
      let fontSize: string;
      let opacity: number;
      let scale = 1;

      if (isHead) {
        // Head character scaling based on timer
        const timerProgress = 1 - quizGame.timeLeft / quizGame.currentTimeMs;
        const baseScale = 1.0;
        const maxScale = 2.0; // Responsive scaling limit

        // Gradual scaling throughout timer
        scale = baseScale + (maxScale - baseScale) * timerProgress;

        // Whoosh effect in final phase
        if (quizGame.timeLeft <= quizGame.currentTimeMs * 0.1) {
          // Final 10% of timer
          const whooshProgress =
            1 - quizGame.timeLeft / (quizGame.currentTimeMs * 0.1);
          scale *= 1 + whooshProgress * 0.5; // Additional dramatic scaling
        }

        fontSize = `clamp(3rem, 8vw, 6rem)`;
        opacity = 1.0;
      } else {
        // Background characters with dramatic opacity drop after head
        const normalizedPosition = position / (totalCharacters - 1);
        const sizeMultiplier = 1 - normalizedPosition * 0.6; // Decrease to 40% of original

        // Dramatic opacity drop: second character starts at 0.3, then gradual fade
        if (position === 1) {
          opacity = 0.3; // Much lower opacity for second character
        } else {
          opacity = Math.max(0.2, 0.3 - (position - 1) * 0.05); // Gradual fade from 0.3
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
        color: 'rgb(107 114 128)', // gray-500 for all characters
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
      quizGame.timeLeft,
      quizGame.currentTimeMs,
      getSpiralCoordinates,
    ],
  );

  // Character advancement logic
  function advanceCharacters() {
    setSpiralCharacters((prev) => {
      // Move all characters one position toward center
      const advanced = prev.map((char) => ({
        ...char,
        position: Math.max(0, char.position - 1),
      }));

      // Add new character at outermost position
      const maxPosition = Math.max(...advanced.map((c) => c.position), 0);
      const newChar: SpiralCharacter = {
        char: getWeightedRandomCharacter(quizGame.characters),
        id: `spiral-${Date.now()}`,
        position: maxPosition + 1,
      };

      const updated = [...advanced, newChar];

      return updated;
    });
  }

  // Initialize game
  useEffect(() => {
    initializeSpiral();
  }, [initializeSpiral]);

  return {
    ...quizGame,
    spiralCharacters,
    getCharacterStyle,
  };
};
