import { PatientTestState } from "@/interfaces/slices/patientTest";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PatientTestState = {
  patientTestDetailData: {},
  patientTestListData: [],
  loading: false,
};

const patientTestSlice = createSlice({
  name: "patientTest",
  initialState,
  reducers: {
    patientTestDetailSlice: (state, action) => {
      state.patientTestDetailData = action?.payload;
      state.loading = false;
    },
    patientTestListSlice: (state, action) => {
      state.patientTestListData = action?.payload;
      state.loading = false;
    },
    clearPatientTestDetailSlice: (state) => {
      state.patientTestDetailData = null;
    },
  },
});

export const {
  patientTestDetailSlice,
  patientTestListSlice,
  clearPatientTestDetailSlice,
} = patientTestSlice.actions;

export default patientTestSlice.reducer;
