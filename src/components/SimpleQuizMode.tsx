import { useCallback, useEffect, useState, useRef } from 'react';
import { loadPracticeCharacters, getWeightedRandomCharacter, saveCharacterWeights } from '@/lib/characterLoading';
import { normalizeInput, clamp } from '@/lib/validation';
import { QUIZ_CONFIG } from '@/config/quiz';
import type { PracticeCharacter } from '@/types';

const { DEFAULT_TIME_MS, MIN_TIME_MS, TIMER_STEP, WEIGHT_DECREASE, WEIGHT_INCREASE, MIN_WEIGHT } = QUIZ_CONFIG;

/**
 * Calculate score multiplier based on the current streak.
 * Rewards consistent correct answers with increasing multipliers:
 * - 1.0x : Default multiplier
 * - 1.5x : After 10 consecutive correct answers
 * - 2.0x : After 50 consecutive correct answers
 * - 3.0x : After 100 consecutive correct answers
 */
function getComboMultiplier(streak: number): number {
  if (streak >= 100) return 3.0;
  if (streak >= 50) return 2.0;
  if (streak >= 10) return 1.5;
  return 1.0;
}

/**
 * Adjust the probability weight of a character based on user performance.
 * - Correct answers decrease the weight (character appears less frequently)
 * - Wrong answers increase the weight (character appears more frequently)
 * Weights are clamped to a minimum value to ensure all characters remain in rotation.
 */
function adjustWeight(characters: PracticeCharacter[], char: string, delta: number) {
  return characters.map(c =>
    c.char === char ? { ...c, weight: Math.max(MIN_WEIGHT, (c.weight || 1) + delta) } : c
  );
}

/**
 * Validate if the user's input exactly matches any of the valid answers.
 * Comparison is case-insensitive for user convenience.
 */
function isAnswerCorrect(input: string, validAnswers: string[]): boolean {
  return validAnswers.some(answer => answer.toLowerCase() === input);
}

/**
 * Check if the current partial input could lead to a valid answer.
 * Used to provide immediate feedback for incorrect inputs rather than
 * waiting for the full answer to be typed.
 */
function isValidStart(input: string, validAnswers: string[]): boolean {
  return validAnswers.some(answer => answer.toLowerCase().startsWith(input));
}

/**
 * Reset the input field and error state when moving to a new character.
 * Called after both correct answers and timeouts.
 */
function resetForNextCharacter(setUserInput: (s: string) => void, setIsWrongAnswer: (b: boolean) => void) {
  setUserInput('');
  setIsWrongAnswer(false);
}

export default function SimpleQuizMode() {
  const [characters, setCharacters] = useState(() => loadPracticeCharacters());
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(() => getWeightedRandomCharacter(loadPracticeCharacters()));
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1.0);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_MS);
  const [currentTimeMs, setCurrentTimeMs] = useState(DEFAULT_TIME_MS);
  const [nextTimeMs, setNextTimeMs] = useState(DEFAULT_TIME_MS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutCountRef = useRef(0);
  const [pausedAfterTimeout, setPausedAfterTimeout] = useState(false);
  
  // Track ongoing timeouts to prevent race conditions between validation,
  // character transitions, and game state changes
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);  // Input validation delay
  const nextCharTimeoutRef = useRef<NodeJS.Timeout | null>(null);    // Character transition delay
  
  /**
   * Cancel all pending timeouts to ensure clean state transitions.
   * Called before any major game state change (new character, timeout, etc.)
   * to prevent race conditions between different game mechanics.
   */
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
  }, []);

  useEffect(() => {
    saveCharacterWeights(characters);
  }, [characters]);

  const nextCharacter = useCallback((resetToDefault = false, resetTimeout = true) => {
    clearAllTimeouts();
    
    // Only reset timeout count when explicitly requested
    if (resetTimeout) {
      timeoutCountRef.current = 0;
    }
    
    setPausedAfterTimeout(false);
    setCurrentChar(getWeightedRandomCharacter(characters));
    resetForNextCharacter(setUserInput, setIsWrongAnswer);
    if (resetToDefault) {
      setCurrentTimeMs(DEFAULT_TIME_MS);
      setTimeLeft(DEFAULT_TIME_MS);
      setNextTimeMs(DEFAULT_TIME_MS);
    } else {
      setCurrentTimeMs(nextTimeMs);
      setTimeLeft(nextTimeMs > 0 ? nextTimeMs : DEFAULT_TIME_MS);
    }
  }, [characters, nextTimeMs, clearAllTimeouts]);

  const handleTimeout = useCallback(() => {
    clearAllTimeouts();
    
    setStreak(0);
    setComboMultiplier(1.0);
    setIsWrongAnswer(true);
    
    // Increment timeout count and handle consecutive timeouts
    timeoutCountRef.current += 1;
    
    // Show wrong answer for 1.5 seconds
    nextCharTimeoutRef.current = setTimeout(() => {
      if (timeoutCountRef.current >= 2) {
        // Two consecutive timeouts: pause the game
        nextCharacter(true, false);
        setPausedAfterTimeout(true);
      } else {
        // Single timeout: continue with reset timer
        nextCharacter(true, false);
      }
    }, 1500);
  }, [nextCharacter, clearAllTimeouts]);
  
  /**
   * Main game timer effect:
   * - Updates every 50ms for smooth countdown visualization
   * - Pauses during game pause states
   * - Triggers timeout handling when time runs out
   * - Cleans up intervals on unmount or state changes
   */
  useEffect(() => {
    // Skip timer updates when game is paused after timeouts
    if (pausedAfterTimeout) {
      return;
    }
    
    // Handle timer expiration
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    
    // Create timer for countdown animation (50ms for smooth updates)
    const timerId = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 50));
    }, 50);
    
    // Store reference for cleanup in other game state changes
    timerRef.current = timerId;
    
    // Cleanup function for component unmount or dependency changes
    return () => {
      clearInterval(timerId);
      timerRef.current = null;
    };
  }, [timeLeft, pausedAfterTimeout, handleTimeout]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeInput(e.target.value);
    
    // Always set the user input first so the tests can verify it
    setUserInput(value);
    
    if (pausedAfterTimeout) {
      // Resume game if paused after timeout
      setPausedAfterTimeout(false);
      timeoutCountRef.current = 0;
      // Reset timer to default time
      setCurrentTimeMs(DEFAULT_TIME_MS);
      setTimeLeft(DEFAULT_TIME_MS);
      // Immediately validate the input after resuming
      if (value.length > 0) {
        // Introduce a minimal delay for validation to help with testing
        validationTimeoutRef.current = setTimeout(() => {
          if (isAnswerCorrect(value, currentChar.validAnswers)) {
            // Reset timeout count on correct answer
            timeoutCountRef.current = 0;
            
            // Update streak and combo multiplier
            const newStreak = streak + 1;
            setStreak(newStreak);
            const newMultiplier = getComboMultiplier(newStreak);
            setComboMultiplier(newMultiplier);
            
            // Update score with multiplier (base score: 1 points)
            setScore(prev => prev + Math.floor(10 * newMultiplier));
            
            setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_DECREASE));
            setNextTimeMs(() => clamp(currentTimeMs - TIMER_STEP, MIN_TIME_MS, DEFAULT_TIME_MS));
            // Immediate advancement to next character
            nextCharacter(false);
          } else if (!isValidStart(value, currentChar.validAnswers)) {
            // Reset timeout count on wrong answer
            timeoutCountRef.current = 0;
            setStreak(0);
            setComboMultiplier(1.0);
            setIsWrongAnswer(true);
            setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_INCREASE));
            // Fixed but short delay for wrong answers
            nextCharTimeoutRef.current = setTimeout(() => nextCharacter(true), 1000);
          }
        }, 10); // Very small delay for testing
      }
      return;
    }
    
    if (isWrongAnswer) return;
    if (value.length === 0) return;

    // Introduce a minimal delay for validation to help with testing
    validationTimeoutRef.current = setTimeout(() => {
      if (isAnswerCorrect(value, currentChar.validAnswers)) {
        // Reset timeout count on correct answer
        timeoutCountRef.current = 0;
        
        // Update streak and combo multiplier
        const newStreak = streak + 1;
        setStreak(newStreak);
        const newMultiplier = getComboMultiplier(newStreak);
        setComboMultiplier(newMultiplier);
        
        setScore(prev => prev + Math.floor(10 * newMultiplier));
        
        setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_DECREASE));
        setNextTimeMs(() => clamp(currentTimeMs - TIMER_STEP, MIN_TIME_MS, DEFAULT_TIME_MS));
        // Immediate advancement to next character
        nextCharacter(false);
        return;
      }
      
      if (!isValidStart(value, currentChar.validAnswers)) {
        // Reset timeout count on wrong answer
        timeoutCountRef.current = 0;
        setStreak(0);
        setComboMultiplier(1.0);
        setIsWrongAnswer(true);
        setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_INCREASE));
        // Fixed but short delay for wrong answers
        nextCharTimeoutRef.current = setTimeout(() => nextCharacter(true), 1000);
      }
    }, 10); // Very small delay for testing
  };

  const timeRemainingPct = (timeLeft / currentTimeMs) * 100;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gray-50">
      <div
        className="fixed inset-0 flex h-full w-full transition-all duration-75"
        style={{
          width: `${timeRemainingPct}%`,
          background: '#e6ffe6',
        }}
      />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        <div className=" text-fuchsia-800 text-3xl font-bold absolute left-4 top-4 text-left">
          <div >Score: {score}</div>
          <div >Streak: {streak}</div><div >Combo: ×{comboMultiplier}</div>
        </div>
        <div className="kana mb-8 select-none text-9xl font-light text-gray-800">
          {currentChar.char}
        </div>
        <div className="w-full max-w-md">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the romanized reading..."
            className={`w-full border-2 py-4 text-center text-xl transition-colors focus:ring-0 focus:outline-none ${
              isWrongAnswer
                ? 'border-fuchsia-800 bg-fuchsia-50 text-fuchsia-800'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            autoFocus
          />
        </div>
        <div className="mt-6 flex h-12 items-center justify-center">
          <div className={`text-3xl font-bold text-fuchsia-800`}>
            {isWrongAnswer ? currentChar.validAnswers[0] : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
