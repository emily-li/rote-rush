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
  const shouldShowCharacter = !isCurrentDirection && !isOppositeDirection;

  const baseClasses =
    'h-10 w-10 rounded border border-gray-300 bg-gray-200 p-2 text-center font-kana text-lg text-gray-700';
  const matchingCharacterClasses = isMatchingCharacter(character)
    ? 'font-bold box-glow'
    : '';

  return (
    <div
      className={`${baseClasses} ${matchingCharacterClasses}`}
      aria-hidden={!shouldShowCharacter}
      aria-label={`D-pad ${direction}${character ? `: ${character}` : ''}`}
    >
      {shouldShowCharacter ? character : ''}
    </div>
  );
};

export default DirectionIndicator;
