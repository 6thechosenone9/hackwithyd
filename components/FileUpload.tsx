import React, { useState, useCallback } from 'react';
import { UploadedFile } from '../types';
import { FileIcon, UploadCloudIcon, XIcon } from './icons';

interface FileUploadProps {
  onFilesUpload: (files: UploadedFile[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    const acceptedFiles = Array.from(fileList).slice(0, 3);
    setFiles(acceptedFiles);

    const uploadedFiles: UploadedFile[] = await Promise.all(
      acceptedFiles.map(file => {
        // FIX: Specify the generic type for Promise to resolve the TypeScript error.
        return new Promise<UploadedFile>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, content: reader.result as string });
          reader.onerror = reject;
          reader.readAsText(file);
        });
      })
    );

    onFilesUpload(uploadedFiles);
  }, [onFilesUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const removeFile = async (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // FIX: Re-read the remaining files to update the parent component with their content.
    // This prevents sending empty content for analysis when a file is removed.
    const updatedUploadedFiles: UploadedFile[] = await Promise.all(
      newFiles.map(file => {
        return new Promise<UploadedFile>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, content: reader.result as string });
          reader.onerror = reject;
          reader.readAsText(file);
        });
      })
    );
    onFilesUpload(updatedUploadedFiles);
  };

  return (
    <div>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400'}`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".txt,.md"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <UploadCloudIcon className="w-12 h-12 text-slate-400 mb-2" />
          <span className="text-primary-600 font-semibold">Click to upload</span>
          <span className="text-slate-500 text-sm"> or drag and drop</span>
          <span className="text-xs text-slate-400 mt-2">Max 3 files (.txt, .md)</span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold text-slate-600">Selected files:</h3>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-100 p-2 rounded-md">
              <div className="flex items-center space-x-2 overflow-hidden">
                <FileIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-700 truncate">{file.name}</span>
              </div>
              <button onClick={() => removeFile(index)} className="p-1 text-slate-500 hover:text-red-600 rounded-full">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};