import { GameMode } from '@/types';
import SimpleQuizMode from '@/components/simple/SimpleQuizMode';
import SpiralQuizMode from '@/components/spiral/SpiralQuizMode';
import SnakeQuizMode from '@/components/snake/SnakeQuizMode';
import RainMode from '@/components/rain/RainMode';

export const GAME_MODES = [
  { query: 'simple', mode: GameMode.SIMPLE, component: SimpleQuizMode },
  { query: 'spiral', mode: GameMode.SPIRAL, component: SpiralQuizMode },
  { query: 'snake', mode: GameMode.SNAKE, component: SnakeQuizMode },
  { query: 'rain', mode: GameMode.RAIN, component: RainMode },
];

export const GAME_MODE_QUERY_MAP = Object.fromEntries(
  GAME_MODES.map(({ query, mode }) => [query, mode]),
) as Record<string, GameMode>;

export const GAME_MODE_TO_QUERY = Object.fromEntries(
  GAME_MODES.map(({ query, mode }) => [mode, query]),
) as Record<GameMode, string>;

export function getGameModeFromQuery(): GameMode {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  return mode && mode in GAME_MODE_QUERY_MAP
    ? GAME_MODE_QUERY_MAP[mode]
    : GameMode.SIMPLE;
}

export function setGameModeQuery(mode: GameMode) {
  const params = new URLSearchParams(window.location.search);
  params.set('mode', GAME_MODE_TO_QUERY[mode]);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}
