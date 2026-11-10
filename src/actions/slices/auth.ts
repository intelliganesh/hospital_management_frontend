import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthPayload, AuthState } from "@/interfaces/slices/auth";
import { jwtDecode } from "jwt-decode";
import { extractPermissions, persistPermissions } from "@/utils/sessionPermissions";

const initialState: AuthState = {
  loginToken: "",
  refreshData: null,
  registerData: null,
  verificationData: null,
  resetData: null,
  tokenStatus: false,
  loginUserDetail: null,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    getLoginUserDetails: (state: AuthState) => {
      state.loginUserDetail = JSON.parse(
        localStorage.getItem("userDetails") ?? ""
      );
    },
    loginSlice: (state: AuthState, action: PayloadAction<AuthPayload>) => {
      state.loginToken = action.payload?.data?.api_key?.original
        ?.token as string;
      if (action.payload?.data?.api_key?.original) {
        localStorage.setItem(
          "token",
          action.payload?.data?.api_key?.original?.token
        );
        localStorage.setItem(
          "expires_in",
          String(action.payload?.data?.api_key?.original?.expires_in)
        );
        localStorage.setItem("date", new Date().toString());
        // server permissions (RBAC) are kept with the session user; when the
        // backend sends none, usePermissions() falls back to ROLE_PERMISSIONS
        const serverPermissions = extractPermissions(action.payload);
        localStorage.setItem(
          "userDetails",
          JSON.stringify(
            serverPermissions
              ? { ...action.payload.data?.result, permissions: serverPermissions }
              : action.payload.data?.result
          )
        );
        state.loginUserDetail = localStorage.getItem("userDetails");
        state.tokenStatus = true;
      }
      // window.location.href = "/";
      // window.location.reload();
    },

    getTokenStatusSlice: (state: AuthState) => {
      let checkToken = localStorage.getItem("token");
      const decoder =
        checkToken &&
        checkToken !== "undefined" &&
        checkToken !== "null" &&
        jwtDecode(checkToken);
      if (decoder) {
        state.tokenStatus = true;
      }
    },

    refreshTokenSlice: (
      state: AuthState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.refreshData = action.payload?.data?.api_key?.original
        ?.token as string;
      if (action.payload?.data?.api_key?.original) {
        localStorage.setItem(
          "token",
          action.payload?.data?.api_key?.original?.token
        );
        localStorage.setItem(
          "expires_in",
          String(action.payload?.data?.api_key?.original?.expires_in)
        );
        localStorage.setItem("date", new Date().toString());
        persistPermissions(extractPermissions(action.payload));
      }
      window.location.reload();
    },

    logoutSlice: () => {
      localStorage.clear();
      window.location.reload();
      window.location.href = "/";
    },

    verifyEmailSlice: (
      state: AuthState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.verificationData = action.payload?.data?.result;
      if (action.payload?.api_key?.original) {
        localStorage.setItem("token", action.payload.api_key.original.token);
        localStorage.setItem(
          "expires_in",
          String(action.payload.api_key.original.expires_in)
        );
        localStorage.setItem("date", new Date().toString());
      }
    },
  },
});

export const {
  loginSlice,
  logoutSlice,
  verifyEmailSlice,
  refreshTokenSlice,
  getTokenStatusSlice,
  getLoginUserDetails,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
