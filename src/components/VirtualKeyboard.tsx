import React from 'react';
import { getKeyboardRows } from '@/lib/validLetters';

type VirtualKeyboardProps = {
  /** Callback when a letter key is pressed */
  onKeyPress: (letter: string) => void;
  /** Whether the keyboard is disabled */
  disabled?: boolean;
};

/**
 * Virtual keyboard component that dynamically displays
 * only the letters needed for the Japanese character set
 */
export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  disabled = false,
}: VirtualKeyboardProps) => {
  const keyboardRows = getKeyboardRows();

  const handleKeyPress = (letter: string) => {
    if (!disabled) {
      onKeyPress(letter);
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-md">
      <div className="grid gap-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center gap-1">
            {row.map((letter) => (
              <button
                key={letter}
                onClick={() => handleKeyPress(letter)}
                disabled={disabled}
                className={`h-12 min-w-[44px] touch-manipulation select-none rounded-lg border-2
                border-gray-300 bg-white px-3 py-2 text-lg font-semibold text-gray-700
                transition-all duration-150 ease-out hover:border-fuchsia-400
                hover:bg-fuchsia-50 hover:text-fuchsia-700 focus:outline-none focus:ring-2
                focus:ring-fuchsia-400 focus:ring-opacity-50 active:scale-95
                active:bg-fuchsia-100 active:duration-75 disabled:cursor-not-allowed
                disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white
                disabled:hover:text-gray-700`}
                type="button"
                aria-label={`Type letter ${letter}`}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
