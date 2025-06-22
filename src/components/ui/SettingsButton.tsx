import { useState } from 'react';
import { Settings } from 'lucide-react';
import { ReportView } from './ReportView';

export const SettingsButton = () => {
  const [showReport, setShowReport] = useState(false);

  return (
    <>
      <div className="absolute right-4 top-4 z-20">
        {' '}
        <button
          onClick={() => setShowReport(true)}
          className="bg-white/10 p-3 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Open settings and reports"
        >
          <Settings size={24} className="text-fuchsia-800" />
        </button>
      </div>

      {showReport && <ReportView onClose={() => setShowReport(false)} />}
    </>
  );
};
