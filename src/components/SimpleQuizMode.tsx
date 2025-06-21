import { useCallback, useEffect, useState, useRef } from 'react';
import { loadPracticeCharacters, getWeightedRandomCharacter, saveCharacterWeights } from '@/lib/characterLoading';
import { normalizeInput, clamp } from '@/lib/validation';
import { QUIZ_CONFIG } from '@/config/quiz';
import type { PracticeCharacter } from '@/types';

const { DEFAULT_TIME_MS, MIN_TIME_MS, TIMER_STEP, WEIGHT_DECREASE, WEIGHT_INCREASE, MIN_WEIGHT } = QUIZ_CONFIG;

/**
 * Calculate combo multiplier based on the current streak count
 * According to spec:
 * - 10 consecutive correct answers: 1.5x
 * - 50 consecutive correct answers: 2x
 * - 100 consecutive correct answers: 3x
 */
function getComboMultiplier(streak: number): number {
  if (streak >= 100) return 3.0;
  if (streak >= 50) return 2.0;
  if (streak >= 10) return 1.5;
  return 1.0;
}

function adjustWeight(characters: PracticeCharacter[], char: string, delta: number) {
  return characters.map(c =>
    c.char === char ? { ...c, weight: Math.max(MIN_WEIGHT, (c.weight || 1) + delta) } : c
  );
}

function isAnswerCorrect(input: string, validAnswers: string[]): boolean {
  return validAnswers.some(answer => answer.toLowerCase() === input);
}

function isValidStart(input: string, validAnswers: string[]): boolean {
  return validAnswers.some(answer => answer.toLowerCase().startsWith(input));
}

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
  const [timeoutCount, setTimeoutCount] = useState(0);
  const [pausedAfterTimeout, setPausedAfterTimeout] = useState(false);

  useEffect(() => {
    saveCharacterWeights(characters);
  }, [characters]);

  const nextCharacter = useCallback((resetToDefault = false, resetTimeout = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Only reset timeout count when explicitly requested
    if (resetTimeout) {
      setTimeoutCount(0);
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
  }, [characters, nextTimeMs]);

  const handleTimeout = useCallback(() => {
    // Clear any existing timer immediately to prevent race conditions
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setStreak(0);
    setComboMultiplier(1.0);
    setIsWrongAnswer(true);
    
    setTimeoutCount(prev => {
      const newCount = prev + 1;
      
      // Handle display of wrong answer for 1.5 seconds
      setTimeout(() => {
        if (newCount >= 2) {
          // After two timeouts, show next character but keep timer paused
          nextCharacter(true, false);
          // Set paused state to prevent timer from starting
          setTimeout(() => {
            setPausedAfterTimeout(true);
          }, 0);
        } else {
          // Regular timeout, show next character with timer running
          nextCharacter(true, false);
        }
      }, 1500);
      
      return newCount;
    });
  }, [nextCharacter]);
  
  // Timer effect needs to be after handleTimeout is defined
  useEffect(() => {
    // Skip this effect when paused
    if (pausedAfterTimeout) {
      return;
    }
    
    // If timer reached zero, handle timeout
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    
    // Otherwise, start/restart timer
    const timerId = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 50));
    }, 50);
    
    // Store timer reference to allow cleanup from other functions
    timerRef.current = timerId;
    
    // Clear on unmount or when dependencies change
    return () => {
      clearInterval(timerId);
      timerRef.current = null;
    };
  }, [timeLeft, pausedAfterTimeout, handleTimeout]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeInput(e.target.value);
    
    if (pausedAfterTimeout) {
      // Resume game if paused after timeout
      setPausedAfterTimeout(false);
      setTimeoutCount(0);
      // Reset timer to default time
      setCurrentTimeMs(DEFAULT_TIME_MS);
      setTimeLeft(DEFAULT_TIME_MS);
      // Set the input value AND validate it
      setUserInput(value);
      
      // Immediately validate the input after resuming
      if (value.length > 0) {
        if (isAnswerCorrect(value, currentChar.validAnswers)) {
          // Reset timeout count on correct answer
          setTimeoutCount(0); 
          
          // Update streak and combo multiplier
          const newStreak = streak + 1;
          setStreak(newStreak);
          const newMultiplier = getComboMultiplier(newStreak);
          setComboMultiplier(newMultiplier);
          
          // Update score with multiplier (base score: 1 points)
          setScore(prev => prev + Math.floor(10 * newMultiplier));
          
          setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_DECREASE));
          setNextTimeMs(() => clamp(currentTimeMs - TIMER_STEP, MIN_TIME_MS, DEFAULT_TIME_MS));
          // Use a small delay to prevent immediate advancement
          setTimeout(() => nextCharacter(false), 300);
        } else if (!isValidStart(value, currentChar.validAnswers)) {
          // Reset timeout count on wrong answer
          setTimeoutCount(0);
          setStreak(0);
          setComboMultiplier(1.0);
          setIsWrongAnswer(true);
          setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_INCREASE));
          // Fixed but short delay for wrong answers
          setTimeout(() => nextCharacter(true), 1000);
        }
      }
      return;
    }
    
    if (isWrongAnswer) return;
    setUserInput(value);
    if (value.length === 0) return;
    if (isAnswerCorrect(value, currentChar.validAnswers)) {
      // Reset timeout count on correct answer
      setTimeoutCount(0); 
      
      // Update streak and combo multiplier
      const newStreak = streak + 1;
      setStreak(newStreak);
      const newMultiplier = getComboMultiplier(newStreak);
      setComboMultiplier(newMultiplier);
      
      setScore(prev => prev + Math.floor(10 * newMultiplier));
      
      setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_DECREASE));
      setNextTimeMs(() => clamp(currentTimeMs - TIMER_STEP, MIN_TIME_MS, DEFAULT_TIME_MS));
      // Use a small delay to prevent immediate advancement
      setTimeout(() => nextCharacter(false), 300);
      return;
    }
    if (!isValidStart(value, currentChar.validAnswers)) {
      // Reset timeout count on wrong answer
      setTimeoutCount(0);
      setStreak(0);
      setComboMultiplier(1.0);
      setIsWrongAnswer(true);
      setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_INCREASE));
      // Fixed but short delay for wrong answers
      setTimeout(() => nextCharacter(true), 1000);
    }
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
