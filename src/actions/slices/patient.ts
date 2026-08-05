import { AuthPayload } from "@/interfaces/slices/auth";
import { PatientState } from "@/interfaces/slices/patient";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PatientState = {
  patientDetailData: {},
  patientListData: [],
  userCompleteObj: null,
  patientConsultationData: [],
  patientStatsData: {
    total_patients: 0,
    active_patients: 0,
  },
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    patientDetailSlice: (
      state: PatientState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.patientDetailData = action.payload?.data;
    },

    patientListSlice: (
      state: PatientState,
      action: PayloadAction<AuthPayload>
    ) => {
      // state.patientListData = action.payload?.data;
      state.userCompleteObj = action?.payload;
    },

    getPatientConsultationSlice: (
      state: PatientState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.patientConsultationData = action.payload?.data;
    },
    getPatientStatsSlice: (
      state: PatientState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.patientStatsData = action.payload?.data;
    },

    clearPatientDetailsSlice: (state) => {
      state.patientDetailData = null;
    },

    // deletePatientSuccess: (state, action: PayloadAction<string>) => {
    //   state.patientListData = state.patientListData.filter(
    //     (patient) => patient?.id !== action.payload
    //   );
    //   if (state.patientDetailData?.id === action.payload) {
    //     state.patientDetailData = null;
    //   }
    // state.loading = false;
    //     },
  },
});

export const {
  patientDetailSlice,
  patientListSlice,
  getPatientConsultationSlice,
  getPatientStatsSlice,
  clearPatientDetailsSlice,
  // deletePatientSuccess,
} = patientSlice.actions;

export default patientSlice.reducer;
