import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  billingDetails: [],
};

export const dynamicFieldSections = createSlice({
  name: "dynamicFieldSections",
  initialState,
  reducers: {
    addDynamicFieldSections: (state, action) => {
      state.billingDetails = action.payload;
    },
  },
});

export const { addDynamicFieldSections } = dynamicFieldSections.actions;
export default dynamicFieldSections.reducer;
