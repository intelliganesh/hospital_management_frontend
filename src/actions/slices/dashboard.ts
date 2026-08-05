import { AuthPayload } from "@/interfaces/slices/auth";
import { DashboardState } from "@/interfaces/slices/dashboard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: DashboardState = {
  dashboardData: {},
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    dashboardDataSlice: (
      state: DashboardState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.dashboardData = action.payload?.data;
    },
  },
});

export const { dashboardDataSlice } = dashboardSlice.actions;

export default dashboardSlice.reducer;
