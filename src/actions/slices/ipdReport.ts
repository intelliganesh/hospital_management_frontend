import { createSlice } from "@reduxjs/toolkit";

const initialState: { ipdReportList: any } = {
  ipdReportList: null,
};

const ipdReport = createSlice({
  name: "ipdReport",
  initialState,
  reducers: {
    getList: (state, action) => {
      state.ipdReportList = action.payload;
    },
    clearList: (state) => {
      state.ipdReportList = null;
    },
  },
});

export const { getList, clearList } = ipdReport.actions;
export default ipdReport.reducer;