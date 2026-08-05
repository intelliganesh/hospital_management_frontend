import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  fistulaReportList: any;
} = {
  fistulaReportList: null,
};

const fistulaReport = createSlice({
  name: "fistulaReport",
  initialState,
  reducers: {
    getList: (state, action) => {
      state.fistulaReportList = action.payload;
    },
    clearList: (state) => {
      state.fistulaReportList = null;
    },
  },
});

export const { getList, clearList } = fistulaReport.actions;

export default fistulaReport.reducer;
