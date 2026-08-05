import { ServiceCostState } from "@/interfaces/master/serviceCost";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ServiceCostState = {
  serviceCostDetailData: {},
  serviceCostListData: [],
  serviceCostDropdownData: [],
  totalServiceCost: 0,
  discountPercent: 0,
};

const serviceCostSlice = createSlice({
  name: "serviceCost",
  initialState,
  reducers: {
    serviceCostDetailSlice: (state, action) => {
      state.serviceCostDetailData = action?.payload;
    },
    serviceCostListSlice: (state, action) => {
      state.serviceCostListData = action?.payload;
    },
    serviceCostDropdownSlice: (state, action) => {
      state.serviceCostDropdownData = action?.payload;
    },
    totalServiceCostSlice: (state, action) => {
      state.totalServiceCost = action?.payload;
    },
    clearTotalServiceCostSlice: (state) => {
      state.totalServiceCost = 0;
    },
    discountPercentSlice: (state, action) => {
      state.discountPercent = action?.payload;
    },
    clearDiscountPercentSlice: (state) => {
      state.discountPercent = 0;
    },
    clearserviceCostDetailSlice: (state) => {
      state.serviceCostDetailData = null;
    },
  },
});

export const {
  discountPercentSlice,
  serviceCostListSlice,
  totalServiceCostSlice,
  serviceCostDetailSlice,
  serviceCostDropdownSlice,
  clearDiscountPercentSlice,
  clearTotalServiceCostSlice,
  clearserviceCostDetailSlice,
} = serviceCostSlice.actions;

export default serviceCostSlice.reducer;
