
import React from 'react';
import { Direction } from '@/lib/snakeUtils';

type DirectionIndicatorProps = {
  direction: Direction;
  getCharForDirection: (dir: Direction) => string;
  isMatchingCharacter: (char: string) => boolean;
  currentDirection: Direction;
};

const DirectionIndicator: React.FC<DirectionIndicatorProps> = ({
  direction,
  getCharForDirection,
  isMatchingCharacter,
  currentDirection,
}) => {
  const character = getCharForDirection(direction);
  const isOppositeDirection =
    (currentDirection === 'UP' && direction === 'DOWN') ||
    (currentDirection === 'DOWN' && direction === 'UP') ||
    (currentDirection === 'LEFT' && direction === 'RIGHT') ||
    (currentDirection === 'RIGHT' && direction === 'LEFT');

  const isCurrentDirection = currentDirection === direction;

  if (isCurrentDirection || isOppositeDirection) {
    return (
      <div
        className="h-10 w-10 rounded border border-gray-300 bg-gray-200 p-2 text-center"
        aria-hidden="true"
      ></div>
    );
  }

  return (
    <div
      className={`rounded border border-gray-300 bg-gray-200 p-2 text-center font-kana text-lg
        text-gray-700 ${
          isMatchingCharacter(character) ? 'font-bold' : ''
        }`}
      aria-label={`${direction} direction character: ${character}`}
    >
      {character}
    </div>
  );
};

export default DirectionIndicator;
