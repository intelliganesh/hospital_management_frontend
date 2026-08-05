import { ComorbidityState } from "@/interfaces/slices/comorbidities";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ComorbidityState = {
  isLoading: false,
  comorbidityDetails: {},
  comorbidityList: [],
  comorbidityDropdown: null,
};
const comorbiditySlice = createSlice({
  name: "comorbidities",
  initialState,
  reducers: {
    comorbidityDetailSlice: (state, action) => {
      state.comorbidityDetails = action.payload;
      state.isLoading = false;
    },
    comorbidityListSlice: (state, action) => {
      state.comorbidityList = action.payload;
      state.isLoading = false;
    },
    clearComorbiditySlice: (state) => {
      state.comorbidityDetails = {};
      state.isLoading = false;
    },
    comorbidityDropdownSlice: (state, action) => {
      state.comorbidityDropdown = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  comorbidityDetailSlice,
  comorbidityListSlice,
  clearComorbiditySlice,
  comorbidityDropdownSlice,
} = comorbiditySlice.actions;
export default comorbiditySlice.reducer;
