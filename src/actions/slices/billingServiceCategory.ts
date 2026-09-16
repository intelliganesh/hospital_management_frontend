import { BillingServiceCategoryState } from "@/interfaces/master/billingServiceCategory";
import { createSlice } from "@reduxjs/toolkit";

const initialState: BillingServiceCategoryState = {
  billingServiceCategoryDetailData: {},
  billingServiceCategoryListData: [],
  billingServiceCategoryDropdownData: [],
};

const billingServiceCategorySlice = createSlice({
  name: "billingServiceCategory",
  initialState,
  reducers: {
    billingServiceCategoryDetailSlice: (state, action) => {
      state.billingServiceCategoryDetailData = action?.payload;
    },
    billingServiceCategoryListSlice: (state, action) => {
      state.billingServiceCategoryListData = action?.payload;
    },
    billingServiceCategoryDropdownSlice: (state, action) => {
      state.billingServiceCategoryDropdownData = action?.payload;
    },
    clearBillingServiceCategoryDetailSlice: (state) => {
      state.billingServiceCategoryDetailData = {};
    },
    clearBillingServiceCategoryListSlice: (state) => {
      state.billingServiceCategoryListData = [];
    },
    clearBillingServiceCategoryDropdownSlice: (state) => {
      state.billingServiceCategoryDropdownData = [];
    },
  },
});

export const {
  billingServiceCategoryDetailSlice,
  billingServiceCategoryListSlice,
  billingServiceCategoryDropdownSlice,
  clearBillingServiceCategoryDetailSlice,
  clearBillingServiceCategoryListSlice,
  clearBillingServiceCategoryDropdownSlice,
} = billingServiceCategorySlice.actions;

export default billingServiceCategorySlice.reducer;