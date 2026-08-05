import { BankDetailsState } from "@/interfaces/bankDetails/index";
import { createSlice } from "@reduxjs/toolkit";

const initialState: BankDetailsState = {
  bankDetailsDetailData: {},
  bankDetailsListData: [],
  bankDetailsDropdownData: [],
};

const bankDetailsSlice = createSlice({
  name: "bankDetails",
  initialState,
  reducers: {
    bankDetailsDetailSlice: (state, action) => {
      state.bankDetailsDetailData = action?.payload;
    },
    bankDetailsListSlice: (state, action) => {
      state.bankDetailsListData = action?.payload;
    },
    bankDetailsDropdownSlice: (state, action) => {
      state.bankDetailsDropdownData = action?.payload;
    },
    clearBankDetailsDetailSlice: (state) => {
      state.bankDetailsDetailData = null;
    },
  },
});

export const {
  bankDetailsDetailSlice,
  bankDetailsListSlice,
  bankDetailsDropdownSlice,
  clearBankDetailsDetailSlice,
} = bankDetailsSlice.actions;

export default bankDetailsSlice.reducer;
