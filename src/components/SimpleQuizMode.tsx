import { useCallback, useEffect, useState } from 'react';
import { loadPracticeCharacters, getRandomCharacter } from '@/lib/characterLoading';
import type { PracticeCharacter } from '@/types';

const QUIZ_TIME_MS = 5000;

export default function SimpleQuizMode() {
  // Game state
  const [characters] = useState(() => loadPracticeCharacters());
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(() => getRandomCharacter(loadPracticeCharacters()));
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_MS);

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

  const resetTimer = useCallback(() => {
    setTimeLeft(QUIZ_TIME_MS);
  }, []);

  const nextCharacter = useCallback(() => {
    setCurrentChar(getRandomCharacter(characters));
    setUserInput('');
    setIsWrongAnswer(false);
    resetTimer();
  }, [characters, resetTimer]);

  const handleTimeout = useCallback(() => {
    setCombo(0);
    setIsWrongAnswer(true);
    setTimeout(nextCharacter, 1500);
  }, [nextCharacter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isWrongAnswer) return;

    const value = e.target.value.toLowerCase().trim();
    setUserInput(value);

    if (value.length === 0) return;

    // Check if answer is correct
    const isCorrect = currentChar.validAnswers.some(answer => 
      answer.toLowerCase() === value
    );

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCombo(prev => prev + 1);
      nextCharacter();
      return;
    }

    // Check if it's a valid start
    const isValidStart = currentChar.validAnswers.some(answer =>
      answer.toLowerCase().startsWith(value)
    );

    if (!isValidStart) {
      setCombo(0);
      setIsWrongAnswer(true);
      setTimeout(nextCharacter, 1000);
    }
  };

  const timeRemainingPct = (timeLeft / QUIZ_TIME_MS) * 100;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gray-50">
      {/* Timer Background */}
      <div
        className="fixed inset-0 flex h-full w-full"
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
