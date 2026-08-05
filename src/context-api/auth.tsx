import React, { useState, useEffect } from "react";
import { AuthContextType, AuthProviderProps } from "@/interfaces/context/auth";
// import { AuthPayload } from "@/interfaces/slices/auth";
// import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";
import { jwtDecode } from "jwt-decode";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<boolean>(false);
  const checkToken = localStorage.getItem("token"); 
  const tokenData : any = checkToken &&
  checkToken !== "undefined" &&
  checkToken !== "null" && 
  jwtDecode(checkToken) ;

  useEffect(() => {
    if (tokenData?.email) {
      setToken(true);
    }
  }, [tokenData]);

  const authValue: AuthContextType = {
    token,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
