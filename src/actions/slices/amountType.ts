import { AmountTypeState } from "@/interfaces/master/amount types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AmountTypeState = {
  amountTypeDetailData: {},
  amountTypeListData: [],
  amountTypeDropdownData: null,
};

const amountTypeSlice = createSlice({
  name: "amountType",
  initialState,
  reducers: {
    amountTypeDetailSlice: (state, action) => {
      state.amountTypeDetailData = action?.payload;
    },
    amountTypeListSlice: (state, action) => {
      state.amountTypeListData = action?.payload;
    },
    amountTypeDropdownSlice: (state, action) => {
      state.amountTypeDropdownData = action?.payload;
    },
    clearAmountTypeDetailSlice: (state) => {
      state.amountTypeDetailData = null;
    },
  },
});

export const {
  amountTypeDetailSlice,
  amountTypeListSlice,
  amountTypeDropdownSlice,
  clearAmountTypeDetailSlice,
} = amountTypeSlice.actions;

export default amountTypeSlice.reducer;
