import { ApiKey } from "../api";

export interface AuthState {
  loginToken: string;
  tokenStatus: boolean;
  resetData: unknown | null;
  refreshData: unknown | null;
  registerData: unknown | null;
  verificationData: unknown | null;
  loginUserDetail: unknown | null;
}

export interface AuthPayload {
  data?: any;
  api_key?: ApiKey;
}
