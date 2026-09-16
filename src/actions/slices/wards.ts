 import { WardState } from "@/interfaces/wards";
import { createSlice } from "@reduxjs/toolkit";

const initialState: WardState = {
  wardDetailData: {},
  wardListData: [],
  wardDropdownData: [],
};

const wardSlice = createSlice({
  name: "ward",
  initialState,
  reducers: {
    wardDetailSlice: (state, action) => {
      state.wardDetailData = action?.payload;
    },
    wardListSlice: (state, action) => {
      state.wardListData = action?.payload;
    },
    wardDropdownSlice: (state, action) => {
      state.wardDropdownData = action?.payload;
    },
    clearWardDetailSlice: (state) => {
      state.wardDetailData = null;
    },
  },
});

export const {
  wardDetailSlice,
  wardListSlice,
  wardDropdownSlice,
  clearWardDetailSlice,
} = wardSlice.actions;

export default wardSlice.reducer;
