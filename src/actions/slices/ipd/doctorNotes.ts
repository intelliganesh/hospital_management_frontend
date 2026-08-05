import { DoctorNotesState } from "@/interfaces/ipd/doctorNotes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DoctorNotesState = {
  doctorNotesDetailData: {},
  doctorNotesListData: {},
  doctorNotesDropdownData: [],
};

const doctorNotesSlice = createSlice({
  name: "doctorNotes",
  initialState,
  reducers: {
    doctorNotesDetailSlice: (state, action) => {
      state.doctorNotesDetailData = action?.payload;
    },
    doctorNotesListSlice: (state, action) => {
      state.doctorNotesListData = action?.payload;
    },
    doctorNotesDropdownSlice: (state, action) => {
      state.doctorNotesDropdownData = action?.payload;
    },
    clearDoctorNotesDetailSlice: (state) => {
      state.doctorNotesDetailData = null;
    },
  },
});

export const {
  doctorNotesDetailSlice,
  doctorNotesListSlice,
  clearDoctorNotesDetailSlice,
  doctorNotesDropdownSlice,
} = doctorNotesSlice.actions;

export default doctorNotesSlice.reducer;
