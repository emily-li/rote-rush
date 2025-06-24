import React from 'react';

type CorrectAnswerDisplayProps = {
  /** Whether to show the correct answer */
  isWrongAnswer: boolean;
  /** The correct answer to display */
  correctAnswer: string;
};

/**
 * Displays the correct answer when the user gets it wrong
 */
export const CorrectAnswerDisplay: React.FC<CorrectAnswerDisplayProps> = ({
  isWrongAnswer,
  correctAnswer,
}) => {
  return (
    <div className="mt-6 flex h-12 items-center justify-center">
      <div id="error-display" className="text-3xl font-bold text-fuchsia-800">
        {isWrongAnswer ? correctAnswer : ''}
      </div>
    </div>
  );
};
