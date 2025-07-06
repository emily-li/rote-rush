import { useEffect } from 'react';
import { GameModeProvider, useGameMode } from '@/components/GameModeContext';
import SimpleQuizMode from '@/components/simple/SimpleQuizMode';
import SpiralQuizMode from '@/components/spiral/SpiralQuizMode';
import { useVirtualKeyboardResize } from '@/hooks/useVirtualKeyboardResize';
import { GameMode } from '@/types';

const GAME_MODES = [
  { query: 'simple', mode: GameMode.SIMPLE, component: SimpleQuizMode },
  { query: 'spiral', mode: GameMode.SPIRAL, component: SpiralQuizMode },
];

const GAME_MODE_QUERY_MAP = Object.fromEntries(
  GAME_MODES.map(({ query, mode }) => [query, mode]),
) as Record<string, GameMode>;

const GAME_MODE_TO_QUERY = Object.fromEntries(
  GAME_MODES.map(({ query, mode }) => [mode, query]),
) as Record<GameMode, string>;

function getGameModeFromQuery(): GameMode {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  return mode && mode in GAME_MODE_QUERY_MAP
    ? GAME_MODE_QUERY_MAP[mode]
    : GameMode.SIMPLE;
}

function setGameModeQuery(mode: GameMode) {
  const params = new URLSearchParams(window.location.search);
  params.set('mode', GAME_MODE_TO_QUERY[mode]);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

function App() {
  useVirtualKeyboardResize();

  return (
    <div className="relative h-screen overflow-hidden">
      <GameModeProvider>
        <GameModeView />
      </GameModeProvider>
    </div>
  );
}

function GameModeView() {
  const { gameMode } = useGameMode();
  const modeDef = GAME_MODES.find((m) => m.mode === gameMode) ?? GAME_MODES[0];
  const ModeComponent = modeDef.component;

  useEffect(() => {
    setGameModeQuery(getGameModeFromQuery());
  }, []);

  return <ModeComponent key={gameMode} />;
}

export default App;
