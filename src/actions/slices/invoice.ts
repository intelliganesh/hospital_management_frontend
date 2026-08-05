import { InvoiceState } from "@/interfaces/slices/invoice";
import { createSlice } from "@reduxjs/toolkit";

const initialState: InvoiceState = {
  invoiceListData: [],
  invoiceDetailData: {},
  loading: false,
  paymentDetailData: [],
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    invoiceListSlice: (state, action) => {
      state.invoiceListData = action.payload;
    },
    invoiceDetailSlice: (state, action) => {
      state.invoiceDetailData = action.payload;
    },
    clearInvoiceDetail: (state) => {
      state.invoiceDetailData = {};
    },
    paymentDetailSlice: (state, action) => {
      state.paymentDetailData = action.payload;
    },
  },
});

export const {
  paymentDetailSlice,
  invoiceListSlice,
  invoiceDetailSlice,
  clearInvoiceDetail,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
