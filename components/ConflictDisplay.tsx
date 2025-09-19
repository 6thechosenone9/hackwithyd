
import React from 'react';
import { Conflict } from '../types';
import { AlertTriangleIcon, CheckCircleIcon, LightbulbIcon, FileTextIcon } from './icons';

interface ConflictDisplayProps {
  conflicts: Conflict[];
}

export const ConflictDisplay: React.FC<ConflictDisplayProps> = ({ conflicts }) => {
  if (conflicts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-green-600 bg-green-50 p-6 rounded-lg">
        <CheckCircleIcon className="w-16 h-16 mb-4" />
        <h3 className="text-2xl font-bold">No Conflicts Found!</h3>
        <p className="text-green-800">The analyzed documents appear to be consistent with each other.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {conflicts.map((conflict, index) => (
        <div key={index} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <AlertTriangleIcon className="w-6 h-6 text-amber-500 mr-3" />
              {conflict.issueTitle}
            </h3>
          </div>
          <div className="p-4 space-y-4">
            
            <div className="space-y-3">
              {conflict.conflicts.map((detail, detailIndex) => (
                <div key={detailIndex} className="bg-slate-100 p-3 rounded-md">
                  <p className="text-sm font-semibold text-slate-600 flex items-center mb-1">
                    <FileTextIcon className="w-4 h-4 mr-2" />
                    From <span className="font-bold mx-1">{detail.documentName}</span>:
                  </p>
                  <blockquote className="text-slate-700 border-l-4 border-red-400 pl-3 italic">
                    "{detail.conflictingText}"
                  </blockquote>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-semibold text-slate-700">Explanation:</h4>
              <p className="text-slate-600">{conflict.explanation}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 flex items-center">
                <LightbulbIcon className="w-5 h-5 mr-2 text-blue-500" />
                Suggested Resolution:
              </h4>
              <p className="text-blue-700">{conflict.suggestion}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
