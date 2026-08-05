import { DiagnosisState } from "@/interfaces/slices/diagnosis";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DiagnosisState = {
  diagnosisDetails: {},
  diagnosisList: [],
  diagnosisDropdownList: [],
  loading: false,
};

const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {
    diagnosisListSlice: (state, action) => {
      state.diagnosisList = action?.payload;
      state.loading = false;
    },
    diagnosisDetailSlice: (state, action) => {
      state.diagnosisDetails = action?.payload;
      state.loading = false;
    },
    diagnosisDropdownSlice: (state, action) => {
      state.diagnosisDropdownList = action?.payload;
      state.loading = false;
    },
    clearDiagnosisSlice: (state) => {
      state.diagnosisDetails = {};
      state.loading = false;
    },
  },
});

export const {
  diagnosisListSlice,
  diagnosisDetailSlice,
  diagnosisDropdownSlice,
  clearDiagnosisSlice,
} = diagnosisSlice.actions;
export default diagnosisSlice.reducer;
