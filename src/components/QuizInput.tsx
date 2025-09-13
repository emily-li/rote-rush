import React from 'react';
import { VirtualKeyboard } from '@/components/VirtualKeyboard';

type QuizInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isWrongAnswer: boolean;
  isInvalid?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  onKeyboardPress?: (letter: string) => void;
  quizCharacter?: { char: string; validAnswers: readonly string[] };
};

/**
 * Shared input component for all quiz modes
 */
export const QuizInput = React.forwardRef<HTMLInputElement, QuizInputProps>(
  (
    {
      value,
      onChange,
      isWrongAnswer,
      isInvalid,
      ariaLabel,
      disabled,
      onKeyboardPress,
      quizCharacter,
    },
    ref,
  ) => {
    return (
      <div className="w-full max-w-md">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="Type the romanized reading..."
          className={`w-full border-4 py-6 text-center text-2xl font-bold transition-colors
          focus:outline-none focus:ring-0 ${
            isWrongAnswer
              ? 'border-fuchsia-900 bg-fuchsia-50 text-fuchsia-900'
              : isInvalid
              ? 'animate-jiggle border-red-500'
              : 'border-gray-300 focus:border-fuchsia-500'
          }`}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          aria-label={
            ariaLabel ||
            `Type the romanized reading for ${
              quizCharacter?.char || 'the displayed character'
            }`
          }
          aria-describedby={isWrongAnswer ? 'error-display' : undefined}
        />
        {onKeyboardPress && (
          <VirtualKeyboard
            onKeyPress={onKeyboardPress}
            disabled={disabled || isWrongAnswer}
          />
        )}
      </div>
    );
  },
);

QuizInput.displayName = 'QuizInput';
