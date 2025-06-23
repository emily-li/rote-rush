import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { ReportView } from './ReportView';

interface SettingsButtonProps {
  readonly currentGameMode: 'simple' | 'spiral';
  readonly onGameModeChange: (mode: 'simple' | 'spiral') => void;
}

export const SettingsButton = ({
  currentGameMode,
  onGameModeChange,
}: SettingsButtonProps) => {
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowReport((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="absolute right-4 top-4 z-20">
        {' '}
        <button
          onClick={() => setShowReport(true)}
          className="p-3"
          aria-label="Open settings and reports"
        >
          <Settings
            size={28}
            className="text-black"
            style={{ filter: 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.8))' }}
          />
        </button>
      </div>

      {showReport && (
        <ReportView
          onClose={() => setShowReport(false)}
          currentGameMode={currentGameMode}
          onGameModeChange={onGameModeChange}
        />
      )}
    </>
  );
};
