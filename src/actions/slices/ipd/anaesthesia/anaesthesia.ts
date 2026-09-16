import { AnaesthesiaState } from "@/interfaces/ipd/anaesthesia";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AnaesthesiaState = {
  anaesthesiaDetailData: {},
  anaesthesiaListData: null,
  anaesthesiaDropdownData: [],
  prefilledUploadedPdfData: [],
};

const anaesthesiaSlice = createSlice({
  name: "anaesthesia",
  initialState,
  reducers: {
    anaesthesiaDetailSlice: (state, action) => {
      state.anaesthesiaDetailData = action?.payload;
    },
    anaesthesiaListSlice: (state, action) => {
      state.anaesthesiaListData = action?.payload;
    },
    anaesthesiaDropdownSlice: (state, action) => {
      state.anaesthesiaDropdownData = action?.payload;
    },
    clearAnaesthesiaDetailSlice: (state) => {
      state.anaesthesiaDetailData = {};
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
  anaesthesiaDetailSlice,
  anaesthesiaListSlice,
  clearAnaesthesiaDetailSlice,
  anaesthesiaDropdownSlice,
  prefilledUploadedPdfSlice,
  clearPrefilledUploadedPdfSlice,
} = anaesthesiaSlice.actions;

export default anaesthesiaSlice.reducer;
