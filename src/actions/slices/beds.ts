import { BedState } from "@/interfaces/beds";
import { createSlice } from "@reduxjs/toolkit";

const initialState: BedState = {
  bedDetailData: {},
  bedListData: [],
  bedDropdownData: [],
};

const bedSlice = createSlice({
  name: "beds",
  initialState,
  reducers: {
    bedDetailSlice: (state, action) => {
      state.bedDetailData = action?.payload;
    },
    bedListSlice: (state, action) => {
      state.bedListData = action?.payload;
    },
    bedDropdownSlice: (state, action) => {
      state.bedDropdownData = action?.payload;
    },
    clearBedDetailSlice: (state) => {
      state.bedDetailData = null;
    },
  },
});

export const {
  bedDetailSlice,
  bedListSlice,
  bedDropdownSlice,
  clearBedDetailSlice,
} = bedSlice.actions;

export default bedSlice.reducer;
