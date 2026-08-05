import { ManagementState } from "@/interfaces/slices/management";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ManagementState = {
  loading: false,
  managementDetails: {},
  managementList: [],
  managementDropdownList: [],
};

const managementSlice = createSlice({
  name: "management",
  initialState,
  reducers: {
    managmentListSlice: (state, action) => {
      state.managementList = action.payload;
      state.loading = false;
    },
    managmentDetailSlice: (state, action) => {
      state.managementDetails = action.payload;
      state.loading = false;
    },

    managmentDropdownSlice: (state, action) => {
      state.managementDropdownList = action.payload;
      state.loading = false;
    },
    clearManagmentSlice: (state) => {
      state.managementDetails = {};
      state.loading = false;
    },
  },
});

export const {
  managmentListSlice,
  managmentDetailSlice,
  managmentDropdownSlice,
  clearManagmentSlice,
} = managementSlice.actions;
export default managementSlice.reducer;
