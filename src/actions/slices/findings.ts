import { FindingState } from "@/interfaces/findings";
import { createSlice } from "@reduxjs/toolkit";

const initialState: FindingState = {
  findingDetailData: {},
  findingListData: [],
  findingDropdownData: [],
  // userCompleteObj: null,
};

const findingSlice = createSlice({
  name: "findings",
  initialState,
  reducers: {
    findingDetailSlice: (state, action) => {
      state.findingDetailData = action?.payload;
      // state.loading = false;
    },
    findingListSlice: (state, action) => {
      state.findingListData = action?.payload;
      // state.loading = false;
    },
    findingDropdownSlice: (state, action) => {
      state.findingDropdownData = action?.payload;
      // state.loading = false;
    },
    clearFindingDetailSlice: (state) => {
      state.findingDetailData = null;
    },
  },
});

export const {
  findingDetailSlice,
  findingListSlice,
  findingDropdownSlice,
  clearFindingDetailSlice,
} = findingSlice.actions;

export default findingSlice.reducer;

