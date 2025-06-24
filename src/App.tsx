import { useState } from 'react';
import SimpleQuizMode from './components/simple/SimpleQuizMode';
import SpiralQuizMode from './components/spiral/SpiralQuizMode';
import { GameMode } from './types';

function App() {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.SIMPLE);

  const renderGameMode = () => {
    switch (gameMode) {
      case GameMode.SPIRAL:
        return (
          <SpiralQuizMode
            currentGameMode={gameMode}
            onGameModeChange={setGameMode}
          />
        );
      case GameMode.SIMPLE:
      default:
        return (
          <SimpleQuizMode
            currentGameMode={gameMode}
            onGameModeChange={setGameMode}
          />
        );
    }
  };

  return renderGameMode();
}

export default App;
