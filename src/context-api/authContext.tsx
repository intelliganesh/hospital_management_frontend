import { createContext } from "react";
import { AuthContextType } from "@/interfaces/context/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined as unknown as AuthContextType
);