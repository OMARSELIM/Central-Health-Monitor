import React from 'react';
import { MonitoredFile, FileStatus } from '../types';

interface FileCardProps {
  file: MonitoredFile;
  onAnalyze: (file: MonitoredFile) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onAnalyze }) => {
  const getStatusColor = (status: FileStatus) => {
    switch (status) {
      case FileStatus.CRITICAL: return 'bg-red-500/10 border-red-500/50 text-red-500';
      case FileStatus.WARNING: return 'bg-amber-500/10 border-amber-500/50 text-amber-500';
      default: return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500';
    }
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case FileStatus.CRITICAL: 
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
      case FileStatus.WARNING:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  return (
    <div className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${getStatusColor(file.status).replace('text-', 'border-').split(' ')[1]} bg-slate-800/40 backdrop-blur-md`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
           <div className={`p-2 rounded-lg ${getStatusColor(file.status)}`}>
             {getStatusIcon(file.status)}
           </div>
           <div>
             <h4 className="font-semibold text-white truncate max-w-[180px]" title={file.name}>{file.name}</h4>
             <p className="text-xs text-slate-400 truncate max-w-[200px]" title={file.path}>{file.path}</p>
           </div>
        </div>
        <div className="text-right">
          <span className={`text-xl font-bold ${file.status === FileStatus.HEALTHY ? 'text-slate-200' : file.status === FileStatus.CRITICAL ? 'text-red-400' : 'text-amber-400'}`}>
            {file.sizeMB} <span className="text-xs font-normal text-slate-500">MB</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
         <div className="bg-slate-900/50 p-2 rounded-lg">
           <p className="text-[10px] text-slate-500 uppercase tracking-wider">Active Users</p>
           <p className="text-sm font-medium text-slate-300">{file.usersActive}</p>
         </div>
         <div className="bg-slate-900/50 p-2 rounded-lg">
           <p className="text-[10px] text-slate-500 uppercase tracking-wider">Local Lock</p>
           <p className={`text-sm font-medium ${file.hasLocalLock ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
             {file.hasLocalLock ? 'DETECTED' : 'None'}
           </p>
         </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onAnalyze(file)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          Ask AI
        </button>
      </div>
    </div>
  );
};

export default FileCard;