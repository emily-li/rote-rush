import { useState } from 'react';
import { Settings } from 'lucide-react';
import { ReportView } from './ReportView';

export const SettingsButton = () => {
  const [showReport, setShowReport] = useState(false);

  return (
    <>
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowReport(true)}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-lg hover:bg-white/20 transition-colors"
          aria-label="Open settings and reports"
        >
          <Settings size={24} className="text-fuchsia-800" />
        </button>
      </div>
      
      {showReport && <ReportView onClose={() => setShowReport(false)} />}
    </>
  );
};
