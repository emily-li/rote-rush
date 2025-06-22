import { useCallback, useEffect, useRef, useState } from 'react';
import { SPIRAL_CONFIG } from '@/config/spiral';
import { WEIGHT_CONFIG } from '@/config/weights';
import { useComboAnimation } from '@/hooks/useComboAnimation';
import {
  getWeightedRandomCharacter,
  loadPracticeCharacters,
  saveCharacterWeights,
} from '@/lib/characterLoading';
import { recordCharacterAttempt } from '@/lib/characterStats';
import {
  checkAnswerMatch,
  checkValidStart,
  clamp,
  normalizeInput,
} from '@/lib/validation';
import type { PracticeCharacter } from '@/types';
import { ScoreDisplay } from './ui/ScoreDisplay';
import { SettingsButton } from './ui/SettingsButton';

const { DEFAULT_TIME_MS, MIN_TIME_MS, TIMER_STEP } = SPIRAL_CONFIG;
const { WEIGHT_DECREASE, WEIGHT_INCREASE, MIN_WEIGHT } = WEIGHT_CONFIG;

interface SpiralCharacter {
  char: PracticeCharacter;
  id: string;
  position: number; // 0 = center/head, highest = tail
}

function getComboMultiplier(streak: number): number {
  if (streak >= 100) return 3.0;
  if (streak >= 50) return 2.0;
  if (streak >= 10) return 1.5;
  return 1.0;
}

function adjustWeight(
  characters: PracticeCharacter[],
  char: string,
  delta: number,
) {
  return characters.map((c) =>
    c.char === char
      ? { ...c, weight: Math.max(MIN_WEIGHT, (c.weight || 1) + delta) }
      : c,
  );
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

// Calculate spiral turns based on viewport size
function calculateSpiralTurns(): number {
  const viewportArea = window.innerWidth * window.innerHeight;
  const baseArea = 1920 * 1080;
  const minTurns = 3;
  const maxTurns = 5;

  const areaRatio = Math.min(1, viewportArea / baseArea);
  return minTurns + (maxTurns - minTurns) * areaRatio;
}

interface SpiralQuizModeProps {
  readonly currentGameMode: 'simple' | 'spiral';
  readonly onGameModeChange: (mode: 'simple' | 'spiral') => void;
}

const SpiralQuizMode = ({
  currentGameMode,
  onGameModeChange,
}: SpiralQuizModeProps): JSX.Element => {
  // Character and game state
  const [characters, setCharacters] = useState(() => loadPracticeCharacters());
  const [spiralCharacters, setSpiralCharacters] = useState<SpiralCharacter[]>(
    [],
  );
  const [currentChar, setCurrentChar] = useState<PracticeCharacter | null>(
    null,
  );
  const [userInput, setUserInput] = useState('');

  // Score and progress state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1.0);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_MS);
  const [currentTimeMs, setCurrentTimeMs] = useState(DEFAULT_TIME_MS);
  const [nextTimeMs, setNextTimeMs] = useState(DEFAULT_TIME_MS);
  const [isGamePaused, setIsGamePaused] = useState(false);

  // Refs for cleanup and state tracking
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Animation state
  const { shouldAnimateCombo, shouldAnimateStreak, shouldAnimateComboReset } =
    useComboAnimation(comboMultiplier, streak);

  // Initialize spiral with characters
  const initializeSpiral = useCallback(() => {
    const characterCount = calculateCharacterCount();
    const initialSpiral: SpiralCharacter[] = [];

    for (let i = 0; i < characterCount; i++) {
      initialSpiral.push({
        char: getWeightedRandomCharacter(characters),
        id: `spiral-${i}-${Date.now()}`,
        position: i, // 0 = center/head, higher = further out
      });
    }

    setSpiralCharacters(initialSpiral);
    setCurrentChar(initialSpiral[0]?.char || null);
  }, [characters]);

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
        const timerProgress = 1 - timeLeft / currentTimeMs;
        const baseScale = 1.0;
        const maxScale = 2.0; // Responsive scaling limit

        // Gradual scaling throughout timer
        scale = baseScale + (maxScale - baseScale) * timerProgress;

        // Whoosh effect in final phase
        if (timeLeft <= currentTimeMs * 0.1) {
          // Final 10% of timer
          const whooshProgress = 1 - timeLeft / (currentTimeMs * 0.1);
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
    [spiralCharacters.length, timeLeft, currentTimeMs, getSpiralCoordinates],
  );

  // Character advancement logic
  const advanceCharacters = useCallback(() => {
    setSpiralCharacters((prev) => {
      // Move all characters one position toward center
      const advanced = prev.map((char) => ({
        ...char,
        position: Math.max(0, char.position - 1),
      }));

      // Add new character at outermost position
      const maxPosition = Math.max(...advanced.map((c) => c.position), 0);
      const newChar: SpiralCharacter = {
        char: getWeightedRandomCharacter(characters),
        id: `spiral-${Date.now()}`,
        position: maxPosition + 1,
      };

      const updated = [...advanced, newChar];

      // Set new head character
      const headChar = updated.find((c) => c.position === 0);
      setCurrentChar(headChar?.char || null);

      return updated;
    });
  }, [characters]);

  // Timer management
  const updateTimerOnComboThreshold = useCallback(
    (newMultiplier: number): void => {
      if (newMultiplier > comboMultiplier) {
        setNextTimeMs(
          clamp(currentTimeMs - TIMER_STEP, MIN_TIME_MS, DEFAULT_TIME_MS),
        );
      }
    },
    [comboMultiplier, currentTimeMs],
  );

  const clearAllTimeouts = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Handle correct answer
  const handleCorrectAnswer = useCallback(() => {
    if (!currentChar) return;

    recordCharacterAttempt(currentChar.char, true);

    const newStreak = streak + 1;
    setStreak(newStreak);
    const newMultiplier = getComboMultiplier(newStreak);
    setComboMultiplier(newMultiplier);
    setScore((prev) => prev + Math.floor(10 * newMultiplier));

    updateTimerOnComboThreshold(newMultiplier);
    setCharacters((prevChars) =>
      adjustWeight(prevChars, currentChar.char, WEIGHT_DECREASE),
    );

    // Advance characters and reset timer
    advanceCharacters();
    setUserInput('');
    setIsWrongAnswer(false);
    setIsGamePaused(false);

    setCurrentTimeMs(nextTimeMs);
    setTimeLeft(nextTimeMs > 0 ? nextTimeMs : DEFAULT_TIME_MS);
  }, [
    currentChar,
    streak,
    nextTimeMs,
    updateTimerOnComboThreshold,
    advanceCharacters,
  ]);

  // Handle incorrect answer or timeout
  const handleIncorrectAnswer = useCallback(() => {
    if (!currentChar) return;

    recordCharacterAttempt(currentChar.char, false);

    setStreak(0);
    setComboMultiplier(1.0);
    setIsWrongAnswer(true);
    setIsGamePaused(true);
    setUserInput('');

    setCharacters((prevChars) =>
      adjustWeight(prevChars, currentChar.char, WEIGHT_INCREASE),
    );

    // Reset timer
    setCurrentTimeMs(DEFAULT_TIME_MS);
    setTimeLeft(DEFAULT_TIME_MS);
    setNextTimeMs(DEFAULT_TIME_MS);
  }, [currentChar]);

  // Input validation and handling
  const validateAndHandleInput = useCallback(
    (value: string) => {
      if (!value || !currentChar || isGamePaused) return;

      if (checkAnswerMatch(value, currentChar.validAnswers)) {
        handleCorrectAnswer();
      } else if (!checkValidStart(value, currentChar.validAnswers)) {
        handleIncorrectAnswer();
      }
    },
    [currentChar, isGamePaused, handleCorrectAnswer, handleIncorrectAnswer],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (isWrongAnswer && !isGamePaused) return;

      const value = normalizeInput(e.target.value);
      setUserInput(value);

      if (isWrongAnswer && isGamePaused) {
        // In retry mode, check if input matches correct answer
        if (currentChar && checkAnswerMatch(value, currentChar.validAnswers)) {
          setIsWrongAnswer(false);
          setIsGamePaused(false);
          setUserInput('');
        }
      } else if (value) {
        validateAndHandleInput(value);
      }
    },
    [isWrongAnswer, isGamePaused, currentChar, validateAndHandleInput],
  );

  // Timer effect
  useEffect(() => {
    if (isGamePaused || timeLeft <= 0) {
      if (timeLeft <= 0) {
        handleIncorrectAnswer();
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 50));
    }, 50);

    timerRef.current = timerId;

    return () => {
      clearInterval(timerId);
      timerRef.current = null;
    };
  }, [timeLeft, isGamePaused, handleIncorrectAnswer]);

  // Initialize game
  useEffect(() => {
    initializeSpiral();
  }, [initializeSpiral]);

  // Save character weights
  useEffect(() => {
    saveCharacterWeights(characters);
  }, [characters]);

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b
        from-purple-50 to-blue-50"
    >
      <SettingsButton
        currentGameMode={currentGameMode}
        onGameModeChange={onGameModeChange}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        {/* Score Display */}
        <div className="px-8">
          <ScoreDisplay
            score={score}
            streak={streak}
            comboMultiplier={comboMultiplier}
            shouldAnimateCombo={shouldAnimateCombo}
            shouldAnimateStreak={shouldAnimateStreak}
            shouldAnimateComboReset={shouldAnimateComboReset}
          />
        </div>

        {/* Spiral Display */}
        <div className="relative mb-8 h-[70vh] w-full">
          {spiralCharacters.map((spiralChar) => (
            <div
              key={spiralChar.id}
              className={`select-none font-kana ${
              spiralChar.position === 0 && isWrongAnswer
                  ? 'animate-pulse'
                  : ''
              }`}
              style={getCharacterStyle(spiralChar)}
            >
              {spiralChar.char.char}
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="w-full max-w-md px-8">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the romanized reading..."
            className={`w-full border-2 py-4 text-center text-xl transition-colors focus:outline-none
              focus:ring-0 ${
              isWrongAnswer
                  ? 'border-fuchsia-800 bg-fuchsia-50 text-fuchsia-800'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            aria-label="Type the romanized reading for the displayed character"
          />
        </div>
      </div>
    </div>
  );
};

export default SpiralQuizMode;
