import { ReactNode } from "react";

export interface AuthContextType {
  token: boolean;
}
export interface AuthProviderProps {
  children: ReactNode;
}
