import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  consultationReportList: any;
} = {
  consultationReportList: null,
};

const consultationReport = createSlice({
  name: "consultationReport",
  initialState,
  reducers: {
    getList: (state, action) => {
      state.consultationReportList = action.payload;
    },
    clearList: (state) => {
      state.consultationReportList = null;
    },
  },
});

export const { getList, clearList} = consultationReport.actions;

export default consultationReport.reducer;
