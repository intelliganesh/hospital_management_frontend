import { anaesthesiaRecoveryObservationState } from "@/interfaces/ipd/anaesthesia/anaesthesiaRecoveryObservation";
import { createSlice } from "@reduxjs/toolkit";

const initialState: anaesthesiaRecoveryObservationState = {
  AnaesthesiaRecoveryObservationDetails: {},
};

const anaesthesiaRecoveryObservationSlice = createSlice({
  name: "anaesthesiaRecoveryObservation",
  initialState,
  reducers: {
    anaesthesiaRecoveryObservationDetailsSlice: (state, action) => {
      state.AnaesthesiaRecoveryObservationDetails = action?.payload;
    },
    clearAnaesthesiaRecoveryObservationDetailsSlice: (state) => {
      state.AnaesthesiaRecoveryObservationDetails = {};
    },
  },
});

export const {
  anaesthesiaRecoveryObservationDetailsSlice,
  clearAnaesthesiaRecoveryObservationDetailsSlice,
} = anaesthesiaRecoveryObservationSlice.actions;

export default anaesthesiaRecoveryObservationSlice.reducer;
