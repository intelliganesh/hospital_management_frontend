import { createSlice } from "@reduxjs/toolkit";
import { SurgeryReport } from "@/interfaces/ipd/surgeryProcedure/surgeryReport";

const initialState: SurgeryReport = {
  surgeryReportDetailData: [],
  surgeryList: [],
  surgeryDropdownData: [],
  prefilledUploadedPdfData: [],
};

const surgeryReportSlice = createSlice({
  name: "surgeryReport",
  initialState,
  reducers: {
    surgeryReportDetailSlice: (state, action) => {
      state.surgeryReportDetailData = action.payload;
    },
    surgeryListSlice: (state, action) => {
      state.surgeryList = action?.payload;
    },
    surgeryDropdownSlice: (state, action) => {
      state.surgeryDropdownData = action?.payload;
    },
    clearSurgeryReportDetailSlice: (state) => {
      state.surgeryReportDetailData = null;
    },
    clearSurgeryDropdownSlice: (state) => {
      state.surgeryDropdownData = [];
    },
    prefilledUploadedPdfSlice: (state, action) => {
      state.prefilledUploadedPdfData = action.payload;
    },
    clearPrefilledUploadedPdfSlice: (state) => {
      state.prefilledUploadedPdfData = [];
    },
  },
});

export const {
  surgeryReportDetailSlice,
  clearSurgeryReportDetailSlice,
  surgeryListSlice,
  surgeryDropdownSlice,
  clearSurgeryDropdownSlice,
  prefilledUploadedPdfSlice,
  clearPrefilledUploadedPdfSlice,
} = surgeryReportSlice.actions;

export default surgeryReportSlice.reducer;
