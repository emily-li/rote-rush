import React from 'react';
import { Input } from '@/components/ui/input';
import type { PracticeCharacter } from '@/lib/characterLoading';

interface CharacterInputProps {
  currentChar: PracticeCharacter;
  userInput: string;
  isInputValid: boolean;
  isInputDisabled: boolean;
  timeLeft: number;
  feedback: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function CharacterInput({
  currentChar,
  userInput,
  isInputValid,
  isInputDisabled,
  timeLeft,
  feedback,
  onInputChange,
  onKeyPress,
}: CharacterInputProps) {
  return (
    <>
      {/* Japanese Character */}
      <div className="kana mb-8 select-none text-9xl font-light text-gray-800">
        {currentChar.char}
      </div>

      {/* Input Box */}
      <div className="w-full max-w-md">
        <Input
          type="text"
          value={userInput}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
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
    </>
  );
}
