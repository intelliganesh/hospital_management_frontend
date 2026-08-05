import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  invoiceReportList: any;
} = {
  invoiceReportList: null,
};

const invoiceReportSlice = createSlice({
  name: "invoiceReport",
  initialState,
  reducers: {
    getList: (state, action) => {
      state.invoiceReportList = action.payload;
    },
    clearList: (state) => {
      state.invoiceReportList = null;
    },
  },
});

export const { getList, clearList } = invoiceReportSlice.actions;

export default invoiceReportSlice.reducer;
