
import React, { useMemo, useState } from 'react';
import { Conflict, UploadedFile } from '../types';
import { XIcon, ClipboardCheckIcon, ClipboardIcon } from './icons';

interface ReportModalProps {
  conflicts: Conflict[];
  files: UploadedFile[];
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ conflicts, files, onClose }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const reportText = useMemo(() => {
    let text = `SMART DOC CHECKER - CONFLICT ANALYSIS REPORT\n`;
    text += `=================================================\n\n`;
    text += `Date Generated: ${new Date().toLocaleString()}\n`;
    text += `Documents Analyzed: ${files.map(f => f.name).join(', ')}\n\n`;
    text += `--- FINDINGS ---\n\n`;
    
    if (conflicts.length === 0) {
      text += 'No conflicts were found among the analyzed documents.\n';
    } else {
      conflicts.forEach((conflict, index) => {
        text += `ISSUE #${index + 1}: ${conflict.issueTitle}\n`;
        text += `-------------------------------------------------\n`;
        text += `Explanation: ${conflict.explanation}\n\n`;
        conflict.conflicts.forEach(detail => {
          text += `  - From Document "${detail.documentName}":\n`;
          text += `    "${detail.conflictingText}"\n`;
        });
        text += `\n`;
        text += `Suggested Resolution: ${conflict.suggestion}\n\n\n`;
      });
    }

    text += `--- END OF REPORT ---\n`;
    return text;
  }, [conflicts, files]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">Generated Conflict Report</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <textarea
            readOnly
            value={reportText}
            className="w-full h-96 p-3 font-mono text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex justify-end items-center p-4 border-t bg-slate-50 rounded-b-xl">
          <button 
            onClick={handleCopy}
            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            {hasCopied ? <ClipboardCheckIcon className="w-5 h-5 mr-2" /> : <ClipboardIcon className="w-5 h-5 mr-2" />}
            {hasCopied ? 'Copied!' : 'Copy Report'}
          </button>
          <button 
            onClick={onClose}
            className="ml-4 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
