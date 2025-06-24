import React from 'react';

type QuizInputProps = {
  /** Current user input value */
  value: string;
  /** Handler for input changes */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Whether the answer is incorrect */
  isWrongAnswer: boolean;
  /** Placeholder text for the input field */
  placeholder?: string;
};

/**
 * Shared input component for all quiz modes
 */
export const QuizInput: React.FC<QuizInputProps> = ({
  value,
  onChange,
  isWrongAnswer,
  placeholder = 'Type the romanized reading...',
}) => {
  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border-4 py-6 text-center text-2xl font-bold transition-colors
          focus:outline-none focus:ring-0 ${
          isWrongAnswer
              ? 'border-fuchsia-800 bg-fuchsia-50 text-fuchsia-800'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        aria-label="Type the romanized reading for the displayed character"
        aria-describedby={isWrongAnswer ? 'error-display' : undefined}
      />
    </div>
  );
};
