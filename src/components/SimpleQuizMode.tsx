import { useCallback, useState } from 'react';
import { getRandomCharacter } from '@/lib/characterLoading';
import { checkAnswerMatch, checkValidStart } from '@/lib/validation';
import { useCountdownTimer } from '@/lib/useCountdownTimer';
import { TimerBackground } from './TimerBackground';
import type { PracticeCharacter } from '@/types';

const QUIZ_TIME_MS = 5000;

export default function SimpleQuizMode() {
  // Game state
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(() => 
    getRandomCharacter()
  );  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const nextCharacter = useCallback(() => {
    setCurrentChar(getRandomCharacter());
    setUserInput('');
    setIsWrongAnswer(false);
  }, []);

  const handleTimeout = useCallback(() => {
    setCombo(0);
    setIsWrongAnswer(true);
    setTimeout(nextCharacter, 1500);
  }, [nextCharacter]);
  const { resetTimer, timeRemainingPct } = useCountdownTimer(
    QUIZ_TIME_MS,
    handleTimeout
  );

  // Update nextCharacter to also reset timer
  const nextCharacterWithTimer = useCallback(() => {
    nextCharacter();
    resetTimer();
  }, [nextCharacter, resetTimer]);  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isWrongAnswer) return;

    const value = e.target.value;
    setUserInput(value);

    if (value.length === 0) return;

    // Check if answer is correct
    const isCorrect = checkAnswerMatch(value, currentChar.validAnswers);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCombo(prev => prev + 1);
      nextCharacterWithTimer();
      return;
    }

    // Check if it's a valid start
    const isValidStart = checkValidStart(value, currentChar.validAnswers);

    if (!isValidStart) {
      setCombo(0);
      setIsWrongAnswer(true);
      setTimeout(nextCharacterWithTimer, 1000);
    }  };
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gray-50">
      <TimerBackground timeRemainingPct={timeRemainingPct} />

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
