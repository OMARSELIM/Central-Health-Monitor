import React, { useState, useEffect, useCallback } from 'react';
import { AppSettings, FileStatus, MonitoredFile } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { generateMockFiles, updateMockFile } from './services/mockService';
import FileCard from './components/FileCard';
import StatsChart from './components/StatsChart';
import GeminiAdvisor from './components/GeminiAdvisor';

const App: React.FC = () => {
  const [files, setFiles] = useState<MonitoredFile[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [selectedFile, setSelectedFile] = useState<MonitoredFile | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

  // Initialize data
  useEffect(() => {
    setFiles(generateMockFiles(5));
    
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Send Notification Helper
  const sendNotification = useCallback((title: string, body: string) => {
    if (!settings.notificationsEnabled || !('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      // Throttle notifications to avoid spamming
      const now = Date.now();
      if (now - lastNotificationTime > 5000) { // Max 1 per 5 seconds
        new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png' });
        setLastNotificationTime(now);
      }
    }
  }, [settings.notificationsEnabled, lastNotificationTime]);

  // Simulation Loop
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setFiles(prevFiles => {
        return prevFiles.map(file => {
          const updated = updateMockFile(file, settings.maxFileSizeMB);
          
          // Check for critical status changes to notify
          if (updated.status === FileStatus.CRITICAL && file.status !== FileStatus.CRITICAL) {
             if (updated.hasLocalLock) {
                sendNotification("Security Alert!", `File ${updated.name} has been opened locally on server!`);
             } else {
                sendNotification("Size Limit Exceeded", `${updated.name} has exceeded ${settings.maxFileSizeMB}MB`);
             }
          }
          return updated;
        });
      });
    }, settings.refreshRateSeconds * 1000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, settings.refreshRateSeconds, settings.maxFileSizeMB, sendNotification]);

  const totalSize = files.reduce((acc, f) => acc + f.sizeMB, 0);
  const criticalCount = files.filter(f => f.status === FileStatus.CRITICAL).length;
  const warningCount = files.filter(f => f.status === FileStatus.WARNING).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Top Navigation / System Tray Simulation */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Central<span className="text-indigo-400">Monitor</span></span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs bg-slate-800 rounded-full px-3 py-1 border border-slate-700">
            <span className={`w-2 h-2 rounded-full ${isSimulationRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isSimulationRunning ? 'System Active' : 'Paused'}
          </div>
          <button 
            onClick={() => setIsSimulationRunning(!isSimulationRunning)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title={isSimulationRunning ? "Pause Monitoring" : "Resume Monitoring"}
          >
            {isSimulationRunning ? (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Settings */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-sm">
            <h2 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-500 text-xs uppercase font-bold">Total Size</span>
                <p className="text-2xl font-bold text-white mt-1">{totalSize.toLocaleString()} <span className="text-sm text-slate-500">MB</span></p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-500 text-xs uppercase font-bold">Alerts</span>
                <p className={`text-2xl font-bold mt-1 ${criticalCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {criticalCount} <span className="text-sm text-slate-500">Critical</span>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-slate-400">Healthy Files</span>
                 <span className="text-emerald-400 font-medium">{files.length - criticalCount - warningCount}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Warnings</span>
                 <span className="text-amber-400 font-medium">{warningCount}</span>
               </div>
            </div>
          </div>

          {/* Chart */}
          <StatsChart files={files} maxSize={settings.maxFileSizeMB} />

          {/* Quick Settings */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="text-slate-100 font-semibold mb-4">Monitor Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Max Central Size Alert</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="100" 
                    max="2000" 
                    step="50"
                    value={settings.maxFileSizeMB}
                    onChange={(e) => setSettings({...settings, maxFileSizeMB: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-sm font-mono w-16 text-right">{settings.maxFileSizeMB}MB</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Desktop Notifications</span>
                <button 
                  onClick={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: File Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Monitored Files</h2>
            <div className="flex gap-2">
               <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Local Lock
               </span>
               <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Over Size
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map(file => (
              <FileCard 
                key={file.id} 
                file={file} 
                onAnalyze={setSelectedFile}
              />
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-lg flex items-start gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-400 shrink-0">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 className="text-indigo-300 font-medium text-sm">Pro Tip</h4>
              <p className="text-indigo-200/60 text-sm mt-1">
                Files over 500MB degrade performance. Use the "Ask AI" feature to get specific cleanup strategies (Purge Unused, Compact Central, Review Warnings) based on file metrics.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Modals */}
      {selectedFile && (
        <GeminiAdvisor 
          file={selectedFile} 
          onClose={() => setSelectedFile(null)} 
        />
      )}

    </div>
  );
};

export default App;