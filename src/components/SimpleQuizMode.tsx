import { useCallback, useEffect, useState, useRef } from 'react';
import { loadPracticeCharacters, getWeightedRandomCharacter, saveCharacterWeights } from '@/lib/characterLoading';
import { normalizeInput, clamp } from '@/lib/validation';
import { QUIZ_CONFIG } from '@/config/quiz';
import type { PracticeCharacter } from '@/types';

const { DEFAULT_TIME_MS, MIN_TIME_MS, TIMER_STEP, WEIGHT_DECREASE, WEIGHT_INCREASE, MIN_WEIGHT } = QUIZ_CONFIG;

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
  const [combo, setCombo] = useState(0);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_MS);
  const [currentTimeMs, setCurrentTimeMs] = useState(DEFAULT_TIME_MS);
  const [nextTimeMs, setNextTimeMs] = useState(DEFAULT_TIME_MS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 50));
    }, 50);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  useEffect(() => {
    saveCharacterWeights(characters);
  }, [characters]);

  const nextCharacter = useCallback((resetToDefault = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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
    setCombo(0);
    setIsWrongAnswer(true);
    setTimeout(() => nextCharacter(true), 1500);
  }, [nextCharacter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isWrongAnswer) return;
    const value = normalizeInput(e.target.value);
    setUserInput(value);
    if (value.length === 0) return;
    if (isAnswerCorrect(value, currentChar.validAnswers)) {
      setScore(prev => prev + 1);
      setCombo(prev => prev + 1);
      setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_DECREASE));
      setNextTimeMs(() => clamp(currentTimeMs - TIMER_STEP, MIN_TIME_MS, DEFAULT_TIME_MS));
      setTimeout(() => nextCharacter(false), 0);
      return;
    }
    if (!isValidStart(value, currentChar.validAnswers)) {
      setCombo(0);
      setIsWrongAnswer(true);
      setCharacters(prevChars => adjustWeight(prevChars, currentChar.char, WEIGHT_INCREASE));
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
        <div className="absolute right-4 top-4 text-right">
          <div className="text-2xl font-bold text-gray-800">Score: {score}</div>
          <div className="text-lg text-gray-600">Combo: {combo}</div>
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
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            autoFocus
          />
        </div>
        <div className="mt-6 flex h-8 items-center justify-center">
          <div className={`text-lg font-medium ${isWrongAnswer ? 'text-red-600' : 'text-green-600'}`}>
            {isWrongAnswer ? currentChar.validAnswers[0] : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
