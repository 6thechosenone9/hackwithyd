
import React, { useState, useEffect, useRef } from 'react';
import { WifiIcon, ZapIcon } from './icons';

interface ExternalMonitorProps {
  onTriggerAnalysis: () => void;
  isDisabled: boolean;
}

export const ExternalMonitor: React.FC<ExternalMonitorProps> = ({ onTriggerAnalysis, isDisabled }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [url, setUrl] = useState("https://college.edu/rules");
  const [statusMessage, setStatusMessage] = useState("Ready to monitor for updates.");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsMonitoring(false);
      setStatusMessage("Monitoring stopped.");
    } else {
      setIsMonitoring(true);
      setStatusMessage("Monitoring external document...");
      intervalRef.current = window.setInterval(() => {
        // Simulate a detected change
        setStatusMessage("Update detected! Re-analyzing documents...");
        onTriggerAnalysis();
        // Reset message after a delay
        setTimeout(() => {
          if(isMonitoring) setStatusMessage("Monitoring external document...");
        }, 3000);
      }, 10000); // Check every 10 seconds
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-3 flex items-center">
        <WifiIcon className="w-6 h-6 mr-3 text-primary-500"/>
        External Document Monitor
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        (Pathway Integration Mock) Monitor an external page for updates and automatically re-run analysis.
      </p>
      <div>
        <label htmlFor="monitor-url" className="block text-sm font-medium text-slate-700 mb-1">
          Document URL
        </label>
        <input
          id="monitor-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/policy"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <button
        onClick={handleToggleMonitoring}
        disabled={isDisabled}
        className={`w-full mt-4 py-2 px-4 text-white font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
          isDisabled 
            ? 'bg-slate-300 cursor-not-allowed'
            : isMonitoring 
            ? 'bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300'
            : 'bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300'
        }`}
      >
        <ZapIcon className="w-5 h-5 mr-2"/>
        {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
      </button>
      <div className={`mt-4 text-sm text-center p-2 rounded-md ${isMonitoring ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
        {statusMessage}
      </div>
    </div>
  );
};
