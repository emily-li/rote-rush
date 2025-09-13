import { useEffect } from 'react';
import { GameModeProvider, useGameMode } from '@/components/GameModeContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
  GAME_MODES,
  getGameModeFromQuery,
  setGameModeQuery,
} from '@/lib/gameModeUtils';

function App() {
  return (
    <GameModeProvider>
      <GameModeView />
    </GameModeProvider>
  );
}

function GameModeView() {
  const { gameMode } = useGameMode();
  useWindowSize();
  const modeDef = GAME_MODES.find((m) => m.mode === gameMode) ?? GAME_MODES[0];
  const ModeComponent = modeDef.component;

  useEffect(() => {
    setGameModeQuery(getGameModeFromQuery());
  }, []);

  return <ModeComponent key={gameMode} />;
}

export default App;