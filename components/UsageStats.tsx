
import React from 'react';
import { FileCheckIcon, FileTextReportIcon } from './icons';

interface UsageStatsProps {
  docsCount: number;
  reportsCount: number;
}

export const UsageStats: React.FC<UsageStatsProps> = ({ docsCount, reportsCount }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-3">Usage Statistics</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileCheckIcon className="w-8 h-8 text-primary-500 mr-4" />
            <div>
              <p className="text-slate-500 text-sm">Documents Analyzed</p>
              <p className="text-2xl font-bold text-slate-800">{docsCount}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Billed per document</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileTextReportIcon className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <p className="text-slate-500 text-sm">Reports Generated</p>
              <p className="text-2xl font-bold text-slate-800">{reportsCount}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Billed per report</p>
        </div>
      </div>
    </div>
  );
};
