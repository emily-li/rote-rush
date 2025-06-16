import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import hiraganaData from '../resources/hiragana.json';
import katakanaData from '../resources/katakana.json';

// Combine both sets if you want to practice both, or use one at a time
const kanaChars = [
  ...hiraganaData.values.map((item: any) => ({
    char: item.character,
    romaji: item.answers[0],
    allRomaji: item.answers,
  })),
  ...katakanaData.values.map((item: any) => ({
    char: item.character,
    romaji: item.answers[0],
    allRomaji: item.answers,
  })),
];

function KanaPractice() {
  const [currentChar, setCurrentChar] = useState(kanaChars[0]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [isInputValid, setIsInputValid] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  // Timer logic
  useEffect(() => {
    const interval: number | null =
      isActive && timeLeft > 0
        ? window.setInterval(() => {
            setTimeLeft((timeLeft) => timeLeft - 1);
          }, 1000)
        : null;
    if (!isActive || timeLeft === 0) {
      if (interval !== null) clearInterval(interval);
      if (timeLeft === 0) handleTimeout();
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const getRandomChar = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * kanaChars.length);
    return kanaChars[randomIndex];
  }, []);

  const handleTimeout = useCallback(() => {
    setFeedback(`Time's up! The answer was "${currentChar.romaji}"`);
    setCombo(0);
    setIsInputDisabled(true);
    const timeoutId = window.setTimeout(() => {
      setCurrentChar(getRandomChar());
      setUserInput('');
      setFeedback('');
      setIsInputValid(true);
      setIsInputDisabled(false);
      setTimeLeft(10);
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [currentChar, getRandomChar]);

  const handleSubmit = useCallback(
    (input: string) => {
      // Accept any valid answer in allRomaji
      const isCorrect = currentChar.allRomaji.some(
        (ans: string) => input.toLowerCase().trim() === ans.toLowerCase(),
      );

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setCombo((prev) => prev + 1);
        setFeedback('Correct! ✓');
        const timeoutId = window.setTimeout(() => {
          setCurrentChar(getRandomChar());
          setUserInput('');
          setFeedback('');
          setIsInputValid(true);
          setTimeLeft(10);
        }, 1000);
        return () => clearTimeout(timeoutId);
      } else {
        setCombo(0);
        setFeedback(`Incorrect. The answer was "${currentChar.romaji}"`);
        setIsInputDisabled(true);
        const timeoutId = window.setTimeout(() => {
          setCurrentChar(getRandomChar());
          setUserInput('');
          setFeedback('');
          setIsInputValid(true);
          setIsInputDisabled(false);
          setTimeLeft(10);
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    },
    [currentChar, getRandomChar],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInputDisabled) return;

    const value = e.target.value;
    setUserInput(value);

    // Clear any existing feedback when user starts typing
    if (feedback && value.length === 1) {
      setFeedback('');
    }

    // Check if current input is a valid start of any correct answer
    const currentInput = value.toLowerCase().trim();
    const validStarts = currentChar.allRomaji.some((ans: string) =>
      ans.toLowerCase().startsWith(currentInput),
    );

    if (currentInput.length > 0) {
      // If input doesn't match the beginning of any correct answer, immediately mark as incorrect
      if (!validStarts) {
        setFeedback(`Incorrect. The answer was "${currentChar.romaji}"`);
        setIsInputValid(false);
        setIsInputDisabled(true);
        setCombo(0);
        const timeoutId = window.setTimeout(() => {
          setCurrentChar(getRandomChar());
          setUserInput('');
          setFeedback('');
          setIsInputValid(true);
          setIsInputDisabled(false);
          setTimeLeft(10);
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
      // If input exactly matches any answer, auto-submit
      else if (
        currentChar.allRomaji.some(
          (ans: string) => currentInput === ans.toLowerCase(),
        )
      ) {
        handleSubmit(value);
      } else {
        setIsInputValid(true);
      }
    } else {
      setIsInputValid(true);
      setFeedback('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(userInput);
    }
  };

  const timerPercentage = (timeLeft / 10) * 100;

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 overflow-hidden">
      {/* Timer Background */}
      <div className="fixed inset-0 z-0 w-full h-full flex">
        <div
          className="bg-blue-200 transition-all duration-1000 ease-linear"
          style={{ width: `${timerPercentage}%` }}
        />
        <div className="flex-1 bg-gray-200" />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        {/* Score and Combo */}
        <div className="absolute right-4 top-4 text-right">
          <div className="text-2xl font-bold text-gray-800">Score: {score}</div>
          <div className="text-lg text-gray-600">Combo: {combo}</div>
        </div>

        {/* Japanese Character */}
        <div className="mb-8 select-none text-9xl font-light text-gray-800 kana">
          {currentChar.char}
        </div>

        {/* Input Box */}
        <div className="w-full max-w-md">
          <Input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type the romanized reading..."
            className={`border-2 py-4 text-center text-xl transition-colors focus:ring-0 ${
              !isInputValid
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-300 focus:border-blue-500'
              }`}
            autoFocus
            disabled={timeLeft === 0 || isInputDisabled}
          />
        </div>

        {/* Feedback */}
        <div className="mt-6 flex h-8 items-center justify-center">
          {feedback && (
            <div
              className={`text-lg font-medium
              ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}
            >
              {feedback}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 max-w-md text-center text-sm text-gray-500">
          <p>Type the romanized reading of the Japanese character above.</p>
          <p className="mt-1">
            Press Enter to submit or let it auto-submit when correct.
          </p>
        </div>
      </div>
    </div>
  );
}

export default KanaPractice;
