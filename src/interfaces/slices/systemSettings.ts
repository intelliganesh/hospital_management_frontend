// @/interfaces/slices/systemSettings.ts
export interface SystemSetting {
    id: string;
    name: string;
    value: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface SystemSettingsState {
    settings: SystemSetting[];
    loading: boolean;
    error: string | null;
    currentSetting: SystemSetting | null;
  }
  
  export interface SystemSettingsResponse {
    success: boolean;
    result?: SystemSetting[] | SystemSetting;
    error?: string;
  }