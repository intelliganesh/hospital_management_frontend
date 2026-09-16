import { createSlice } from "@reduxjs/toolkit";
import { IpdBillingState } from "@/interfaces/ipd/billing";

const initialState: IpdBillingState = {
  ipdBillingListData: [],
  ipdBillingDetailData: {},
  ipdBillingPaymentDetailData: [],
};

const ipdBillingSlice = createSlice({
  name: "ipdBilling",
  initialState,
  reducers: {
    ipdBillingListSlice: (state, action) => {
      state.ipdBillingListData = action?.payload;
    },
    ipdBillingDetailSlice: (state, action) => {
      state.ipdBillingDetailData = action?.payload;
    },
    ipdBillingPaymentDetailSlice: (state, action) => {
      state.ipdBillingPaymentDetailData = action?.payload;
    },
    clearIpdBillingDetailSlice: (state) => {
      state.ipdBillingDetailData = null;
    },
  },
});

export const {
  ipdBillingListSlice,
  ipdBillingDetailSlice,
  ipdBillingPaymentDetailSlice,
  clearIpdBillingDetailSlice,
} = ipdBillingSlice.actions;

export default ipdBillingSlice.reducer;
