import React from 'react';
import { Input } from '@/components/ui/input';
import type { PracticeCharacter } from '@/lib/characterLoading';

interface CharacterInputProps {
  currentChar: PracticeCharacter;
  userInput: string;
  isInputValid: boolean;
  isWrongAnswer: boolean;
  timeLeftMs: number;
  feedback: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function CharacterInput({
  currentChar,
  userInput,
  isInputValid,
  isWrongAnswer,
  timeLeftMs,
  feedback,
  onInputChange,
  onKeyDown,
}: CharacterInputProps) {
  return (
    <>
      <div className="kana mb-8 select-none text-9xl font-light text-gray-800">
        {currentChar.char}
      </div>

      <div className="w-full max-w-md">
        <Input
          type="text"
          value={userInput}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder="Type the romanized reading..."
          className={`border-2 py-4 text-center text-xl transition-colors focus:ring-0 ${
            !isInputValid
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-gray-300 focus:border-blue-500'
            }`}
          autoFocus
          disabled={timeLeftMs === 0 || isWrongAnswer}
        />
      </div>

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
    </>
  );
}
