
import React, { useState, useCallback } from 'react';
import { UploadedFile, Conflict } from './types';
import { analyzeDocuments } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { ConflictDisplay } from './components/ConflictDisplay';
import { UsageStats } from './components/UsageStats';
import { ExternalMonitor } from './components/ExternalMonitor';
import { Header } from './components/Header';
import { ReportModal } from './components/ReportModal';
import { LoadingSpinner } from './components/icons';

export default function App(): React.ReactElement {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [docsAnalyzedCount, setDocsAnalyzedCount] = useState<number>(0);
  const [reportsGeneratedCount, setReportsGeneratedCount] = useState<number>(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const handleFilesUpload = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setConflicts(null);
    setError(null);
  };

  const handleCheckConflicts = useCallback(async () => {
    if (uploadedFiles.length < 2) {
      setError("Please upload at least two documents to compare.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setConflicts(null);

    try {
      const results = await analyzeDocuments(uploadedFiles);
      setConflicts(results);
      setDocsAnalyzedCount(prev => prev + uploadedFiles.length);
    } catch (err) {
      setError("Failed to analyze documents. The AI model might be unavailable. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFiles]);

  const handleGenerateReport = () => {
    if (conflicts && conflicts.length > 0) {
      setReportsGeneratedCount(prev => prev + 1);
      setIsReportModalOpen(true);
    }
  };
  
  const canCheck = uploadedFiles.length >= 2;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <UsageStats docsCount={docsAnalyzedCount} reportsCount={reportsGeneratedCount} />
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-3">1. Upload Documents</h2>
              <p className="text-sm text-slate-500 mb-4">Select 2 to 3 documents (.txt, .md) to scan for contradictions.</p>
              <FileUpload onFilesUpload={handleFilesUpload} />
              <button
                onClick={handleCheckConflicts}
                disabled={!canCheck || isLoading}
                className={`w-full mt-4 py-3 px-4 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${
                  canCheck && !isLoading
                    ? 'bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner />
                    Analyzing...
                  </span>
                ) : (
                  'Check for Conflicts'
                )}
              </button>
            </div>
            <ExternalMonitor onTriggerAnalysis={handleCheckConflicts} isDisabled={!canCheck || isLoading} />
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-200 min-h-[400px]">
             <div className="flex justify-between items-center border-b pb-3 mb-4">
               <h2 className="text-xl font-bold text-slate-700">2. Analysis Report</h2>
                {conflicts && conflicts.length > 0 && (
                  <button
                    onClick={handleGenerateReport}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Generate Report
                  </button>
                )}
             </div>
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p className="font-bold">Error</p><p>{error}</p></div>}
            
            {!isLoading && !conflicts && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                <p className="text-lg">Your analysis results will appear here.</p>
                <p className="text-sm">Upload documents and click "Check for Conflicts" to begin.</p>
              </div>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <LoadingSpinner className="h-12 w-12 mb-4"/>
                  <p className="text-lg font-semibold animate-pulse">AI is analyzing documents...</p>
                  <p className="text-sm text-slate-500">This may take a moment.</p>
              </div>
            )}
            
            {conflicts && <ConflictDisplay conflicts={conflicts} />}
          </div>
        </div>
      </main>
      {isReportModalOpen && conflicts && (
        <ReportModal 
          conflicts={conflicts} 
          files={uploadedFiles}
          onClose={() => setIsReportModalOpen(false)} 
        />
      )}
    </div>
  );
}
