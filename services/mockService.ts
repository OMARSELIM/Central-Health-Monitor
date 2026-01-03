import { MonitoredFile, FileStatus } from "../types";
import { PROJECT_NAMES, MOCK_PATHS } from "../constants";

export const generateMockFiles = (count: number): MonitoredFile[] => {
  return Array.from({ length: count }).map((_, index) => {
    const size = Math.floor(Math.random() * 600) + 100; // Random size 100-700MB
    const hasLock = Math.random() < 0.1; // 10% chance of error
    
    let status = FileStatus.HEALTHY;
    if (hasLock) status = FileStatus.CRITICAL;
    else if (size > 500) status = FileStatus.WARNING;
    else if (size > 600) status = FileStatus.CRITICAL;

    return {
      id: `file-${index}`,
      name: PROJECT_NAMES[index % PROJECT_NAMES.length],
      path: MOCK_PATHS[index % MOCK_PATHS.length],
      sizeMB: size,
      lastModified: new Date().toLocaleTimeString(),
      usersActive: Math.floor(Math.random() * 5),
      hasLocalLock: hasLock,
      status: status
    };
  });
};

export const updateMockFile = (file: MonitoredFile, maxSize: number): MonitoredFile => {
  // Simulate random size fluctuation
  const change = Math.floor(Math.random() * 10) - 2; // -2 to +8 MB change
  const newSize = Math.max(10, file.sizeMB + change);
  
  // Simulate random "Local Lock" event (rare)
  const newLock = Math.random() < 0.05 ? true : (Math.random() < 0.8 ? file.hasLocalLock : false); 

  let newStatus = FileStatus.HEALTHY;
  if (newLock) newStatus = FileStatus.CRITICAL;
  else if (newSize > maxSize * 1.2) newStatus = FileStatus.CRITICAL;
  else if (newSize > maxSize) newStatus = FileStatus.WARNING;

  return {
    ...file,
    sizeMB: newSize,
    hasLocalLock: newLock,
    status: newStatus,
    lastModified: new Date().toLocaleTimeString(),
  };
};