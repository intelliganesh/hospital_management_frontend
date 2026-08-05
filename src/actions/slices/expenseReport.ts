import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  expenseReportList: any;
} = {
  expenseReportList: null,
};

const expenseReport = createSlice({
  name: "expenseReport",
  initialState,
  reducers: {
    getList: (state, action) => {
      state.expenseReportList = action.payload;
    },
    clearList: (state) => {
      state.expenseReportList = null;
    },
  },
});

export const { getList, clearList } = expenseReport.actions;

export default expenseReport.reducer;
