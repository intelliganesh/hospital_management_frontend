import { FistulaState } from "@/interfaces/fistula/index";
import { createSlice } from "@reduxjs/toolkit";

const initialState: FistulaState = {
  fistulaDetailData: {},
  fistulaListData: [],
  fistulaDropdownData: [],
  patientFistulaDetailData: {},
  patientFistulaListData: [],
};

const fistulaSlice = createSlice({
  name: "fistula",
  initialState,
  reducers: {
    fistulaDetailSlice: (state, action) => {
      state.fistulaDetailData = action?.payload;
    },
    fistulaListSlice: (state, action) => {
      state.fistulaListData = action?.payload;
    },
    fistulaDropdownSlice: (state, action) => {
      state.fistulaDropdownData = action?.payload;
    },
    clearFistulaDetailSlice: (state) => {
      state.fistulaDetailData = null;
    },
    patientFistulaDetailSlice: (state, action) => {
      state.patientFistulaDetailData = action?.payload;
    },
    patientFistulaListSlice: (state, action) => {
      state.patientFistulaListData = action?.payload;
    },
    clearPatientFistulaDetailSlice: (state) => {
      state.patientFistulaDetailData = null;
    },
  },
});

export const {
  fistulaDetailSlice,
  fistulaListSlice,
  clearFistulaDetailSlice,
  fistulaDropdownSlice,
  patientFistulaDetailSlice,
  patientFistulaListSlice,
  clearPatientFistulaDetailSlice
} = fistulaSlice.actions;

export default fistulaSlice.reducer;
