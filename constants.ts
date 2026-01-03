import { AppSettings } from "./types";

export const DEFAULT_SETTINGS: AppSettings = {
  maxFileSizeMB: 500,
  refreshRateSeconds: 5,
  notificationsEnabled: true,
};

// Mock data generator helpers
export const PROJECT_NAMES = [
  "Tower_A_Central.rvt",
  "Hospital_Wing_B_Struct.rvt",
  "Stadium_Roof_Detail.rvt",
  "Residential_Block_C_MEP.rvt",
  "Interior_Lobby_Design.rvt"
];

export const MOCK_PATHS = [
  "\\\\Server01\\Projects\\2024\\TowerA\\Revit\\",
  "\\\\Server02\\BIM\\Hospital\\Struct\\",
  "\\\\NAS_Storage\\Stadium\\Models\\",
  "\\\\Server01\\Projects\\Res_Block\\MEP\\",
  "\\\\CloudShare\\Interiors\\Lobby\\"
];