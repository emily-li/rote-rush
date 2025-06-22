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
  progress: number; // 0 to 1, where 1 is closest to user
  angle: number; // angle in the spiral
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
  const [isWrongAnswer, setIsWrongAnswer] = useState(false); // Timer state
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_MS);
  const [currentTimeMs, setCurrentTimeMs] = useState(DEFAULT_TIME_MS);
  const [nextTimeMs, setNextTimeMs] = useState(DEFAULT_TIME_MS);

  // Refs for cleanup and state tracking
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutCountRef = useRef(0);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextCharTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation state
  const { shouldAnimateCombo, shouldAnimateStreak, shouldAnimateComboReset } =
    useComboAnimation(comboMultiplier, streak); // Initialize spiral with characters
  const initializeSpiral = useCallback(() => {
    const initialSpiral: SpiralCharacter[] = [];
    for (let i = 0; i < 50; i++) {
      // Increased from 12 to 50 characters
      // Variable spacing: closer characters at the tail (far out), spread out at head (center)
      // Head characters (low i) get larger spacing, tail characters (high i) get smaller spacing
      const baseSpacing = 0.012; // Reduced base spacing for denser tail
      const spacingMultiplier = 1 + i * 0.015; // Reduced multiplier for even denser tail
      const spacing = baseSpacing * spacingMultiplier;

      initialSpiral.push({
        char: getWeightedRandomCharacter(characters),
        id: `spiral-${i}-${Date.now()}`,
        progress: (49 - i) * spacing, // Variable spacing: head gets more space, tail gets less
        angle: i * (Math.PI / 8), // Tighter angle spacing for more characters (22.5 degrees apart)
      });
    }
    setSpiralCharacters(initialSpiral);
    setCurrentChar(initialSpiral[0]?.char || null);
  }, [characters]);

  // Add new character to the back of the spiral
  const addCharacterToSpiral = useCallback(() => {
    const newChar: SpiralCharacter = {
      char: getWeightedRandomCharacter(characters),
      id: `spiral-${Date.now()}`,
      progress: 0,
      angle: Math.random() * Math.PI * 2,
    };

    setSpiralCharacters((prev) => [...prev, newChar]);
  }, [characters]); // Update spiral animation
  const updateSpiral = useCallback(() => {
    // Always run spiral animation - no pauses

    // Speed based on time remaining (faster as time runs out)
    const timeProgress = 1 - timeLeft / currentTimeMs;
    const baseSpeed = 0.003;
    const speedMultiplier = 1 + timeProgress * 2; // Up to 3x speed as timer runs out
    const spiralSpeed = baseSpeed * speedMultiplier;

    setSpiralCharacters((prev) => {
      const updated = prev.map((spiralChar) => ({
        ...spiralChar,
        progress: spiralChar.progress + spiralSpeed, // Characters move inward (higher progress = closer to center)
        angle: spiralChar.angle + 0.02, // Rotate the spiral
      }));

      // Check if front character has reached the center (progress >= 1)
      const frontChar = updated[0];
      if (frontChar && frontChar.progress >= 1) {
        // Character reached the center - trigger timeout through timer mechanism
        setTimeLeft(0); // This will trigger handleTimeout through timer effect
        return updated;
      }

      return updated;
    });

    animationRef.current = requestAnimationFrame(updateSpiral);
  }, [timeLeft, currentTimeMs]); // Start spiral animation
  useEffect(() => {
    // Always run spiral animation - no pauses
    animationRef.current = requestAnimationFrame(updateSpiral);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateSpiral]);

  // Initialize game
  useEffect(() => {
    initializeSpiral();
  }, [initializeSpiral]);

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
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }
    if (nextCharTimeoutRef.current) {
      clearTimeout(nextCharTimeoutRef.current);
      nextCharTimeoutRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);
  const nextCharacter = useCallback(
    (resetToDefault = false) => {
      clearAllTimeouts();

      // Remove the front character and move to next
      setSpiralCharacters((prev) => {
        const remaining = prev.slice(1);
        setCurrentChar(remaining[0]?.char || null);
        return remaining;
      });

      // Add new character to back
      addCharacterToSpiral();

      setUserInput('');
      setIsWrongAnswer(false);

      if (resetToDefault) {
        setCurrentTimeMs(DEFAULT_TIME_MS);
        setTimeLeft(DEFAULT_TIME_MS);
        setNextTimeMs(DEFAULT_TIME_MS);
      } else {
        setCurrentTimeMs(nextTimeMs);
        setTimeLeft(nextTimeMs > 0 ? nextTimeMs : DEFAULT_TIME_MS);
      }
    },
    [clearAllTimeouts, addCharacterToSpiral, nextTimeMs],
  );
  const handleTimeout = useCallback(() => {
    if (!currentChar) return;

    recordCharacterAttempt(currentChar.char, false);
    clearAllTimeouts();

    setStreak(0);
    setComboMultiplier(1.0);
    setIsWrongAnswer(true);

    // Immediate continuation - no gameOver state, no pause
    nextCharacter(true);
  }, [currentChar, nextCharacter, clearAllTimeouts]);

  const updateTimeLeft = useCallback(() => {
    setTimeLeft((prev) => Math.max(0, prev - 50));
  }, []);
  const validateAndHandleInput = useCallback(
    (value: string) => {
      if (!value || !currentChar) return;

      // Immediate validation - no timeout delay
      if (checkAnswerMatch(value, currentChar.validAnswers)) {
        recordCharacterAttempt(currentChar.char, true);

        timeoutCountRef.current = 0;

        const newStreak = streak + 1;
        setStreak(newStreak);
        const newMultiplier = getComboMultiplier(newStreak);
        setComboMultiplier(newMultiplier);
        setScore((prev) => prev + Math.floor(10 * newMultiplier));

        updateTimerOnComboThreshold(newMultiplier);
        setCharacters((prevChars) =>
          adjustWeight(prevChars, currentChar.char, WEIGHT_DECREASE),
        );
        nextCharacter(false);
      } else if (!checkValidStart(value, currentChar.validAnswers)) {
        recordCharacterAttempt(currentChar.char, false);

        timeoutCountRef.current = 0;
        setStreak(0);
        setComboMultiplier(1.0);
        setIsWrongAnswer(true);
        setCharacters((prevChars) =>
          adjustWeight(prevChars, currentChar.char, WEIGHT_INCREASE),
        );
        setUserInput(value);

        // Immediate continuation - no timeout delay
        nextCharacter(true);
      } else {
        setUserInput(value);
      }
    },
    [currentChar, streak, nextCharacter, updateTimerOnComboThreshold],
  );
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timerId = setInterval(updateTimeLeft, 50);
    timerRef.current = timerId;

    return () => {
      clearInterval(timerId);
      timerRef.current = null;
    };
  }, [timeLeft, handleTimeout, updateTimeLeft]);
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (isWrongAnswer) return;

      const value = normalizeInput(e.target.value);

      // Continuous input handling - never pause
      setUserInput(value);
      if (value) {
        validateAndHandleInput(value);
      }
    },
    [isWrongAnswer, validateAndHandleInput],
  ); // Calculate character positions in 3D spiral
  const getCharacterStyle = (spiralChar: SpiralCharacter, index: number) => {
    const { progress, angle } = spiralChar; // Reversed spiral: progress 0 = far out, progress 1 = center
    // Use almost the entire screen width - much more aggressive
    const maxRadius = Math.max(
      window.innerWidth * 0.6, // 120% of screen width from center = edge to edge
      window.innerHeight * 0.55, // Or 110% of screen height
    ); // Take the larger value to ensure we use maximum space
    const radius = maxRadius * (1 - progress);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.9; // Minimal vertical flattening

    // Much larger scale differences between characters
    const scale = 0.2 + progress * 2.0; // Increased range for bigger size differences

    // Adjusted opacity system for 50 characters
    let baseOpacity;
    if (index === 0) {
      // Head character: full opacity
      baseOpacity = 1.0;
    } else if (index === 1) {
      // Second character: much dimmer
      baseOpacity = 0.25; // Large drop from 1.0 to 0.25
    } else if (index <= 5) {
      // Next few characters: gradual fade
      baseOpacity = Math.max(0.08, 0.25 - (index - 1) * 0.04);
    } else {
      // Distant characters: very faint but visible
      baseOpacity = Math.max(0.02, 0.08 - (index - 5) * 0.002);
    }

    // Further adjust based on progress (closer to center = more visible)
    const progressBonus = progress * 0.4;
    const opacity = Math.min(1.0, baseOpacity + progressBonus);

    // Much larger font size differences, adjusted for 50 characters
    let baseFontSize;
    if (index === 0) {
      baseFontSize = 120; // Much larger head character
    } else if (index === 1) {
      baseFontSize = 50; // Significant drop for second character
    } else if (index <= 10) {
      baseFontSize = Math.max(30, 50 - (index - 1) * 2);
    } else {
      baseFontSize = Math.max(20, 30 - (index - 10) * 0.5);
    }
    const fontSize = `${baseFontSize + progress * 80}px`;

    // Simple transform and opacity - no special effects
    const transform = `translate(-50%, -50%) scale(${scale})`;
    const finalOpacity = Math.min(1.0, baseOpacity + progressBonus);

    return {
      position: 'absolute' as const,
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
      transform,
      opacity: finalOpacity,
      fontSize,
      zIndex: Math.floor(progress * 100) + (index === 0 ? 1000 : 0), // Head gets highest z-index      color: index === 0 ? '#d946ef' : '#e879f9', // Bright fuchsia for head (fuchsia-500), lighter fuchsia for background (fuchsia-400)
      fontWeight: index === 0 ? 'bold' : 'normal',
      textShadow:
        index === 0
          ? '0 0 20px rgba(112, 26, 117, 0.8)' // Dark fuchsia glow for head
          : '0 0 10px rgba(112, 26, 117, 0.4)', // Subtle dark fuchsia glow for background characters
      transition: 'opacity 0.2s ease-out', // Smooth opacity transitions
      pointerEvents: 'none' as const, // Prevent character overlap interaction issues
    };
  };

  useEffect(() => {
    saveCharacterWeights(characters);
  }, [characters]);
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-blue-50">
      <SettingsButton
        currentGameMode={currentGameMode}
        onGameModeChange={onGameModeChange}
      />{' '}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
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

        {/* 3D Spiral Display - Full screen, no restrictions */}
        <div className="relative mb-8 h-[80vh] w-screen">
          {spiralCharacters.map((spiralChar, index) => (
            <div
              key={spiralChar.id}
              className="select-none font-kana"
              style={getCharacterStyle(spiralChar, index)}
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
        {/* Error Answer Display */}
        <div className="mt-6 flex h-12 items-center justify-center">
          <div
            className="text-3xl font-bold text-fuchsia-800"
            aria-live="polite"
          >
            {isWrongAnswer && currentChar ? currentChar.validAnswers[0] : ''}
          </div>
        </div>
        {/* Timer Bar */}
        <div className="fixed bottom-4 left-4 right-4 h-2 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-75"
            style={{ width: `${(timeLeft / currentTimeMs) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SpiralQuizMode;
