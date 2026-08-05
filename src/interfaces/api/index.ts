export type Headers = {
  Authorization?: string;
  "Content-Type"?: "application/json" | "multipart/form-data";
  TimeZone?: any;
  IpAddress?: any;
  // "Access-Control-Allow-Origin": "*";
};
export type ApiCallback = (
  completed: boolean,
  result?: {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
  }
) => void;
export interface ConfigProps {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: Headers;
  signal?: AbortSignal;
  withCredentials: boolean;
}
export interface ApiKey {
  original: {
    token: string;
    expires_in: number;
  };
}
