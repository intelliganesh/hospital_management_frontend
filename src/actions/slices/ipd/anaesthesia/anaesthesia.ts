import { AnaesthesiaState } from "@/interfaces/ipd/anaesthesia";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AnaesthesiaState = {
  anaesthesiaDetailData: {},
  anaesthesiaListData: null,
  anaesthesiaDropdownData: [],
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
  },
});

export const {
  anaesthesiaDetailSlice,
  anaesthesiaListSlice,
  clearAnaesthesiaDetailSlice,
  anaesthesiaDropdownSlice,
} = anaesthesiaSlice.actions;

export default anaesthesiaSlice.reducer;
