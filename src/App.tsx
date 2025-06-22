import { useState } from 'react';
import SimpleQuizMode from './components/SimpleQuizMode';
import SpiralQuizMode from './components/SpiralQuizMode';

type GameMode = 'simple' | 'spiral';

function App() {
  const [gameMode, setGameMode] = useState<GameMode>('simple');

  const renderGameMode = () => {
    switch (gameMode) {
      case 'spiral':
        return (
          <SpiralQuizMode
            currentGameMode={gameMode}
            onGameModeChange={setGameMode}
          />
        );
      case 'simple':
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
