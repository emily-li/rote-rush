import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { ReportView } from './ReportView';

export const SettingsButton = () => {
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
          <Settings size={24} className="text-fuchsia-800" />
        </button>
      </div>

      {showReport && <ReportView onClose={() => setShowReport(false)} />}
    </>
  );
};
