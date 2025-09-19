
import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <LogoIcon className="h-10 w-10 text-primary-600" />
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-slate-800">Smart Doc Checker</h1>
          <p className="text-sm text-slate-500">AI-Powered Conflict Detection & Resolution</p>
        </div>
      </div>
    </header>
  );
};
