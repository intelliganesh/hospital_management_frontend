import { createSlice } from "@reduxjs/toolkit";
import { OnlineAppointmentsState } from "@/interfaces/slices/onlineAppointments";

const initialState: OnlineAppointmentsState = {
  onlineAppointmentsList: [],
  appointmentDetail: null,
  loading: false,
  onlineAppointmentStats: null,
  error: null,
};

const onlineAppointmentsSlice = createSlice({
  name: "onlineAppointments",
  initialState,
  reducers: {
    onlineAppointmentDetailSlice: (state, action) => {
      state.appointmentDetail = action.payload;
    },
    onlineAppointmentListSlice: (state, action) => {
      state.onlineAppointmentsList = action.payload;
    },
    onlineAppointmentStatsSlice: (state, action) => {
      state.onlineAppointmentStats = action.payload;
    },

    clearOnlineAppointmentDetailSlice: (state) => {
      state.appointmentDetail = null;
    },
  },
});

export const {
  onlineAppointmentDetailSlice,
  onlineAppointmentListSlice,
  clearOnlineAppointmentDetailSlice,
  onlineAppointmentStatsSlice,
} = onlineAppointmentsSlice.actions;

export default onlineAppointmentsSlice.reducer;
