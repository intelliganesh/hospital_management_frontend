import { SurgicalHistoryState } from "@/interfaces/slices/surgicalHistory";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SurgicalHistoryState = {
  surgicalHistoryDetailData: {},
  surgicalHistoryListData: {data:[]},
  surgicalHistoryListFullData: [],
  surgicalHistoryDropdownData: [],
  loading: false,
};
const surgicalHistorySlice = createSlice({
  name: "surgicalHistory",
  initialState,
  reducers: {
    surgicalHistoryDetailSlice: (state, action) => {
      state.surgicalHistoryDetailData = action.payload;
      state.loading = false;
    },
    surgicalHistoryListSlice: (state, action) => {
      state.surgicalHistoryListData = action.payload;
      state.surgicalHistoryListFullData = action.payload;
      state.loading = false;
    },
    surgicalHistoryDropdownSlice: (state, action) => {
      state.surgicalHistoryDropdownData = action.payload;
      state.loading = false;
    },
    clearSurgicalHistoryDetailDataSlice: (state) => {
      state.surgicalHistoryDetailData = {};
      state.loading = false;
    },
  },
});

export const {
  surgicalHistoryDetailSlice,
  surgicalHistoryListSlice,
  surgicalHistoryDropdownSlice,
  clearSurgicalHistoryDetailDataSlice,
} = surgicalHistorySlice.actions;

export default surgicalHistorySlice.reducer;
