import { IpdStates } from "@/interfaces/ipd/ipdEnrollment";
import { AuthPayload } from "@/interfaces/slices/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IpdStates = {
  ipdEnrollmentData: [],
  ipdEnrolledPatientDetails: null,
  ipdPatientList: [],
  ipdPatientDetailData: null,
  ipdPatientStatsData: null,
  prefilledUploadedPdfData: [],
};

const ipdSlice = createSlice({
  name: "ipd",
  initialState,
  reducers: {
    ipdEnrollmentDataSlice: (
      state: IpdStates,
      action: PayloadAction<AuthPayload>
    ) => {
      state.ipdEnrollmentData = action.payload?.data;
    },

    ipdEnrolledPatientDetailsSlice: (
      state: IpdStates,
      action: PayloadAction<AuthPayload>
    ) => {
      state.ipdEnrolledPatientDetails = action.payload?.data;
    },

    ipdPatientListSlice: (
      state: IpdStates,
      action: PayloadAction<AuthPayload>
    ) => {
      state.ipdPatientList = action.payload?.data;
    },

    ipdPatientDetailDataSlice: (
      state: IpdStates,
      action: PayloadAction<AuthPayload>
    ) => {
      state.ipdPatientDetailData = action.payload?.data;
    },
    ipdPatientStatsDataSlice: (
      state: IpdStates,
      action: PayloadAction<AuthPayload>
    ) => {
      state.ipdPatientStatsData = action.payload?.data;
    },
    

    clearIpdEnrollmentSlice: (state: IpdStates) => {
      state.ipdEnrolledPatientDetails = null;
    },

    clearIpdEnrollmentDetailsSlice: (state: IpdStates) => {
      state.ipdEnrolledPatientDetails = null;
    },

    clearIpdPatientListSlice: (state: IpdStates) => {
      state.ipdPatientList = [];
    },

    clearIpdPatientDetailDataSlice: (state: IpdStates) => {
      state.ipdPatientDetailData = null;
    },
    clearIpdPatientStatsDataSlice: (state: IpdStates) => {
      state.ipdPatientStatsData = null;
    },
    ipdPrefilledUploadedPdfSlice: (state: IpdStates, action: PayloadAction<any>) => {
      state.prefilledUploadedPdfData = action.payload;
    },
    clearIpdPrefilledUploadedPdfSlice: (state: IpdStates) => {
      state.prefilledUploadedPdfData = [];
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
  ipdEnrollmentDataSlice,
  ipdEnrolledPatientDetailsSlice,
  ipdPatientListSlice,
  ipdPatientDetailDataSlice,
  ipdPatientStatsDataSlice,
  clearIpdEnrollmentSlice,
  clearIpdEnrollmentDetailsSlice,
  clearIpdPatientListSlice,
  clearIpdPatientDetailDataSlice,
  clearIpdPatientStatsDataSlice,
  ipdPrefilledUploadedPdfSlice,
  clearIpdPrefilledUploadedPdfSlice,
  // deletePatientSuccess,
} = ipdSlice.actions;

export default ipdSlice.reducer;
