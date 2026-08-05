import { DoshaAnalysisState } from "@/interfaces/doshaAnalysis/index";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DoshaAnalysisState = {
  doshaAnalysisDetailData: {},
  doshaAnalysisListData: [],
  doshaAnalysisDropdownData: [],
  
};

const doshaAnalysisSlice = createSlice({
  name: "doshaAnalysis",
  initialState,
  reducers: {
    doshaAnalysisDetailSlice: (state, action) => {
      state.doshaAnalysisDetailData = action?.payload;
      // state.loading = false;
    },
    doshaAnalysisListSlice: (state, action) => {
      state.doshaAnalysisListData = action?.payload;
      // state.loading = false;
    },
    doshaOptionsListSlice: (state, action) => {
      state.doshaAnalysisDropdownData = action?.payload;
      // state.loading = false;
    },
    clearDoshaAnalysisDetailSlice: (state) => {
      state.doshaAnalysisDetailData = null;
    },
  },
});

export const {
  doshaAnalysisDetailSlice,
  doshaAnalysisListSlice,
  doshaOptionsListSlice,
  clearDoshaAnalysisDetailSlice,
} = doshaAnalysisSlice.actions;

export default doshaAnalysisSlice.reducer;

