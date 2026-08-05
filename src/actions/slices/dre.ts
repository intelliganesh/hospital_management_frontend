import { DreState } from "@/interfaces/dre/index";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DreState = {
  dreDetailData: {},
  dreListData: [],
  dreDropdownData: [],
};

const dreSlice = createSlice({
  name: "dre",
  initialState,
  reducers: {
    dreDetailSlice: (state, action) => {
      state.dreDetailData = action?.payload;
    },
    dreListSlice: (state, action) => {
      state.dreListData = action?.payload;
    },
    dreDropdownSlice: (state, action) => {
      state.dreDropdownData = action?.payload;
    },
    clearDreDetailSlice: (state) => {
      state.dreDetailData = null;
    },
  },
});

export const {
  dreDetailSlice,
  dreListSlice,
  clearDreDetailSlice,
  dreDropdownSlice,
} = dreSlice.actions;

export default dreSlice.reducer;
