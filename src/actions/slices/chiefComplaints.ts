import { ChiefComplaintState } from "@/interfaces/master/chiefComplaints";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ChiefComplaintState = {
  chiefComplaintDetailData: {},
  chiefComplaintListData: [],
  chiefComplaintDropdownData: [],
};

const chiefComplaintSlice = createSlice({
  name: "chiefComplaint",
  initialState,
  reducers: {
    chiefComplaintDetailSlice: (state, action) => {
      state.chiefComplaintDetailData = action?.payload;
    },
    chiefComplaintListSlice: (state, action) => {
      state.chiefComplaintListData = action?.payload;
    },
    chiefComplaintDropdownSlice: (state, action) => {
        state.chiefComplaintDropdownData = action?.payload;
    },
    clearChiefComplaintDetailSlice: (state) => {
      state.chiefComplaintDetailData = null;
    },
  },
});

export default chiefComplaintSlice.reducer;

export const {
  chiefComplaintDetailSlice,
  chiefComplaintListSlice,
  clearChiefComplaintDetailSlice,
  chiefComplaintDropdownSlice,
} = chiefComplaintSlice.actions;

