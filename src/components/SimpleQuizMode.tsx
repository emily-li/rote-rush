import { useCallback, useEffect, useState } from 'react';
import { loadPracticeCharacters, getWeightedRandomCharacter, saveCharacterWeights } from '@/lib/characterLoading';
import type { PracticeCharacter } from '@/types';

const DEFAULT_TIME_MS = 5000;
const MIN_TIME_MS = 1000;
const TIMER_STEP = 250;
const WEIGHT_DECREASE = 1;
const WEIGHT_INCREASE = 2;
const MIN_WEIGHT = 1;

function decreaseWeight(characters: PracticeCharacter[], char: string) {
  return characters.map(c =>
    c.char === char ? { ...c, weight: Math.max(MIN_WEIGHT, (c.weight || 1) - WEIGHT_DECREASE) } : c
  );
}

function increaseWeight(characters: PracticeCharacter[], char: string) {
  return characters.map(c =>
    c.char === char ? { ...c, weight: (c.weight || 1) + WEIGHT_INCREASE } : c
  );
}

function isAnswerCorrect(input: string, validAnswers: string[]): boolean {
  return validAnswers.some(answer => answer.toLowerCase() === input);
}

function isValidStart(input: string, validAnswers: string[]): boolean {
  return validAnswers.some(answer => answer.toLowerCase().startsWith(input));
}

export default function SimpleQuizMode() {
  // Game state
  const [characters, setCharacters] = useState(() => loadPracticeCharacters());
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(() => getWeightedRandomCharacter(loadPracticeCharacters()));
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_MS);
  const [currentTimeMs, setCurrentTimeMs] = useState(DEFAULT_TIME_MS);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 50));
    }, 50);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Save weights to localStorage whenever they change
  useEffect(() => {
    saveCharacterWeights(characters);
  }, [characters]);

  const resetTimer = useCallback(() => {
    setTimeLeft(currentTimeMs);
  }, [currentTimeMs]);

  const nextCharacter = useCallback(() => {
    setCurrentChar(getWeightedRandomCharacter(characters));
    setUserInput('');
    setIsWrongAnswer(false);
    resetTimer();
  }, [characters, resetTimer]);

  const handleTimeout = useCallback(() => {
    setCombo(0);
    setIsWrongAnswer(true);
    setCurrentTimeMs(DEFAULT_TIME_MS); // Reset timer to 5s on timeout
    setTimeLeft(DEFAULT_TIME_MS); // Also reset the timer bar immediately
    setTimeout(nextCharacter, 1500);
  }, [nextCharacter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isWrongAnswer) return;

    const value = e.target.value.toLowerCase().trim();
    setUserInput(value);

    if (value.length === 0) return;

    // Check if answer is correct
    if (isAnswerCorrect(value, currentChar.validAnswers)) {
      setScore(prev => prev + 1);
      setCombo(prev => prev + 1);
      setCharacters(prevChars => decreaseWeight(prevChars, currentChar.char));
      setCurrentTimeMs(prev => Math.max(MIN_TIME_MS, prev - TIMER_STEP));
      nextCharacter();
      return;
    }

    // Check if it's a valid start
    if (!isValidStart(value, currentChar.validAnswers)) {
      setCombo(0);
      setIsWrongAnswer(true);
      setCharacters(prevChars => increaseWeight(prevChars, currentChar.char));
      setCurrentTimeMs(DEFAULT_TIME_MS); // Reset timer to 5s
      setTimeLeft(DEFAULT_TIME_MS); // Force timer bar to full immediately
      setTimeout(() => {
        setTimeLeft(DEFAULT_TIME_MS); // Ensure timer bar is still full after nextCharacter resets
        nextCharacter();
      }, 1000);
    }
  };

  const timeRemainingPct = (timeLeft / currentTimeMs) * 100;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gray-50">
      {/* Timer Background */}
      <div
        className="fixed inset-0 flex h-full w-full transition-all duration-75"
        style={{
          width: `${timeRemainingPct}%`,
          background: '#e6ffe6',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        {/* Score Display */}
        <div className="absolute right-4 top-4 text-right">
          <div className="text-2xl font-bold text-gray-800">Score: {score}</div>
          <div className="text-lg text-gray-600">Combo: {combo}</div>
        </div>

        {/* Character Display */}
        <div className="kana mb-8 select-none text-9xl font-light text-gray-800">
          {currentChar.char}
        </div>

        {/* Input */}
        <div className="w-full max-w-md">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the romanized reading..."
            className={`w-full border-2 py-4 text-center text-xl transition-colors focus:ring-0 focus:outline-none ${
              isWrongAnswer
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            autoFocus
          />
        </div>

        {/* Answer display when wrong */}
        <div className="mt-6 flex h-8 items-center justify-center">
          <div className={`text-lg font-medium ${isWrongAnswer ? 'text-red-600' : 'text-green-600'}`}>
            {isWrongAnswer ? currentChar.validAnswers[0] : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
