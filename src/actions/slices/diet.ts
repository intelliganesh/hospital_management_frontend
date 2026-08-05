import { DietState } from "@/interfaces/master/diet";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DietState = {
  dietDetailData: {},
  dietListData: [],
  dietDropdownData: [],
};

const dietSlice = createSlice({
  name: "diet",
  initialState,
  reducers: {
    dieticianDetailSlice: (state, action) => {
      state.dietDetailData = action?.payload;
    },
    dieticianListSlice: (state, action) => {
      state.dietListData = action?.payload;
    },
    dieticianDropdownSlice: (state, action) => {
      state.dietDropdownData = action?.payload;
    },
    clearDieticianDetailSlice: (state) => {
      state.dietDetailData = null;
    },
  },
});

export const {
  dieticianDetailSlice,
  dieticianListSlice,
  clearDieticianDetailSlice,
  dieticianDropdownSlice,
} = dietSlice.actions;

export default dietSlice.reducer;
