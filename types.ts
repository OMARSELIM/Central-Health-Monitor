export enum FileStatus {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface MonitoredFile {
  id: string;
  name: string;
  path: string;
  sizeMB: number;
  lastModified: string;
  usersActive: number;
  hasLocalLock: boolean; // Simulates "opened locally on server"
  status: FileStatus;
}

export interface AppSettings {
  maxFileSizeMB: number;
  refreshRateSeconds: number;
  notificationsEnabled: boolean;
}

export interface GeminiAnalysis {
  fileId: string;
  suggestion: string;
  isLoading: boolean;
}