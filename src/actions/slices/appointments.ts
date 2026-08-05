import { AuthPayload } from "@/interfaces/slices/auth";
import { AppointmentState } from "@/interfaces/appointments/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AppointmentState = {
  appointmentDetailData: {},
  appointmentListData: [],
  appointmentStatsData: {
    total_appointments: 0,
    todays_appointments: 0,
    completed_appointments: 0,
    pending_appointments: 0,
  },
  userCompleteObj: null,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    appointmentDetailSlice: (
      state: AppointmentState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.appointmentDetailData = action.payload?.data;
    },

    appointmentListSlice: (
      state: AppointmentState,
      action: PayloadAction<AuthPayload>
    ) => {
      // state.patientListData = action.payload?.data;
      state.userCompleteObj = action?.payload;
    },
    appointmentStatsSlice: (
      state: AppointmentState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.appointmentStatsData = action.payload?.data;
    },

    clearAppointmentDetailsSlice: (state) => {
      state.appointmentDetailData = null;
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
  appointmentDetailSlice,
  appointmentListSlice,
  appointmentStatsSlice,
  clearAppointmentDetailsSlice,
  // deletePatientSuccess,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
