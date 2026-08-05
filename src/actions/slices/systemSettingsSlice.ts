// systemSettingsSlice.ts
import { AuthPayload } from "@/interfaces/slices/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {SystemSettings as settings}  from "@/interfaces/systemSettings/index";

interface SystemSetting extends settings{
  id?: string
  user_id?: string
}

interface SystemSettingsState {
  settings: SystemSetting;
  loading: boolean;
  error: string | null;
  currentSetting: SystemSetting | null;
}

const initialState: SystemSettingsState = {
  settings: {} as SystemSetting,
  loading: false,
  error: null,
  currentSetting: null,
};

const systemSettingsSlice = createSlice({
  name: "systemSettings",
  initialState,
  reducers: {
    getSystemSettingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSystemSettingsSuccess: (state, action: PayloadAction<AuthPayload>) => {
      state.settings = action.payload?.data?.settings[0];
      state.loading = false;
    },
    getSystemSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSystemSettingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // addSystemSettingSuccess: (state, action: PayloadAction<SystemSetting>) => {
    //   state.settings.push(action.payload);
    //   state.loading = false;
    // },
    addSystemSettingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    editSystemSettingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // editSystemSettingSuccess: (state, action: PayloadAction<SystemSetting>) => {
      // const index = state.settings.findIndex(
      //   (setting) => setting.id === action.payload.id
      // );
      // if (index !== -1) {
      //   state.settings[index] = action.payload;
      // }
    //   state.settings = action.payload;
    //   state.loading = false;
    // },
    editSystemSettingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // setCurrentSetting: (state, action: PayloadAction<SystemSetting | null>) => {
    //   state.currentSetting = action.payload;
    // },
  },
});

export const {
  getSystemSettingsStart,
  getSystemSettingsSuccess,
  getSystemSettingsFailure,
  addSystemSettingStart,
  // addSystemSettingSuccess,
  addSystemSettingFailure,
  editSystemSettingStart,
  // editSystemSettingSuccess,
  editSystemSettingFailure,
  // setCurrentSetting,
} = systemSettingsSlice.actions;

export default systemSettingsSlice.reducer;
