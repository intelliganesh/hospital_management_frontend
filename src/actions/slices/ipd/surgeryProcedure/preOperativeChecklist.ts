import { createSlice } from "@reduxjs/toolkit";
import { PreOperativeChecklist } from "@/interfaces/ipd/surgeryProcedure/preOperativeChecklist";

const initialState: PreOperativeChecklist = {
  preOperativeChecklistDetailData: null,
  preOperativeChecklistList: [],
};

const preOperativeChecklistSlice = createSlice({
  name: "preOperativeChecklist",
  initialState,
  reducers: {
    preOperativeChecklistDetailSlice: (state, action) => {
      state.preOperativeChecklistDetailData = action.payload;
    },
    clearPreOperativeChecklistDetailSlice: (state) => {
      state.preOperativeChecklistDetailData = null;
    },
  },
});

export const {
  preOperativeChecklistDetailSlice,
  clearPreOperativeChecklistDetailSlice,
} = preOperativeChecklistSlice.actions;

export default preOperativeChecklistSlice.reducer;
