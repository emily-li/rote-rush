import React from 'react';
import { Input } from '@/components/ui/input';
import type { PracticeCharacter } from '@/lib/characterLoading';

interface CharacterInputProps {
  currentChar: PracticeCharacter;
  userInput: string;
  isWrongAnswer: boolean;
  timeLeftMs: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CharacterInput({
  currentChar,
  userInput,
  isWrongAnswer,
  onInputChange,
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
          placeholder={userInput || 'Type the romanized reading...'}
          className={`border-2 py-4 text-center text-xl transition-colors focus:ring-0 ${
            isWrongAnswer
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-gray-300 focus:border-blue-500'
            }`}
          autoFocus
        />
      </div>

      <div className="mt-6 flex h-8 items-center justify-center">
        <div
          className={`text-lg font-medium ${isWrongAnswer ? 'text-red-600' : 'text-green-600'}`}
        >
          {isWrongAnswer ? currentChar.validAnswers[0] : ''}
        </div>
      </div>
    </>
  );
}
