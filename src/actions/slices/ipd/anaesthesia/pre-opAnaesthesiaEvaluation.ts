import { PreOpAnaesthesiaEvalState } from "@/interfaces/ipd/anaesthesia/pre-opAnaesthesiaEvaluation";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PreOpAnaesthesiaEvalState = {
  PreOpAnaesthesiaEvalDetails: {},
};

const preOpAnaesthesiaEvalSlice = createSlice({
  name: "preOpAnaesthesiaEval",
  initialState,
  reducers: {
    preOpAnaesthesiaEvalDetailSlice: (state, action) => {
      state.PreOpAnaesthesiaEvalDetails = action?.payload;
    },
    clearPreOpAnaesthesiaEvalDetailSlice: (state) => {
      state.PreOpAnaesthesiaEvalDetails = {};
    },
  },
});

export const {
  preOpAnaesthesiaEvalDetailSlice,
  clearPreOpAnaesthesiaEvalDetailSlice,
} = preOpAnaesthesiaEvalSlice.actions;

export default preOpAnaesthesiaEvalSlice.reducer;
