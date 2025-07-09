import { SNAKE_CONFIG } from '@/config/snake';

export type SnakePosition = [number, number];
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const getRandomPosition = (
  exclude: SnakePosition[] = [],
): SnakePosition => {
  const { GRID_SIZE } = SNAKE_CONFIG;
  let newPos: SnakePosition;
  do {
    newPos = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
    ];
  } while (exclude.some(([x, y]) => x === newPos[0] && y === newPos[1]));
  return newPos;
};

export const getNextSnakeHead = (
  currentHead: SnakePosition,
  direction: Direction,
): SnakePosition => {
  const head = [...currentHead] as SnakePosition;
  switch (direction) {
    case 'UP':
      head[1] -= 1;
      break;
    case 'DOWN':
      head[1] += 1;
      break;
    case 'LEFT':
      head[0] -= 1;
      break;
    case 'RIGHT':
      head[0] += 1;
      break;
  }
  return head;
};

export const checkCollision = (
  head: SnakePosition,
  snake: SnakePosition[],
): boolean => {
  const { GRID_SIZE } = SNAKE_CONFIG;
  return (
    head[0] < 0 ||
    head[0] >= GRID_SIZE ||
    head[1] < 0 ||
    head[1] >= GRID_SIZE ||
    snake.some(([x, y]) => x === head[0] && y === head[1])
  );
};

export const getUpdatedSnake = (
  snake: SnakePosition[],
  head: SnakePosition,
  food: SnakePosition,
): SnakePosition[] => {
  const ateFood = head[0] === food[0] && head[1] === food[1];
  const newSnake = [head, ...snake];
  if (!ateFood) {
    newSnake.pop();
  }
  return newSnake;
};

export const getOppositeDirection = (dir: Direction): Direction => {
  switch (dir) {
    case 'UP':
      return 'DOWN';
    case 'DOWN':
      return 'UP';
    case 'LEFT':
      return 'RIGHT';
    case 'RIGHT':
      return 'LEFT';
  }
};
