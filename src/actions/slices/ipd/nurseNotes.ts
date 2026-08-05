import { NurseNotesState } from "@/interfaces/ipd/nurseNotes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: NurseNotesState = {
  nurseNotesDetailData: {},
  nurseNotesListData: {},
  nurseNotesDropdownData: [],
};

const nurseNotesSlice = createSlice({
  name: "nurseNotes",
  initialState,
  reducers: {
    nurseNotesDetailSlice: (state, action) => {
      state.nurseNotesDetailData = action?.payload;
    },
    nurseNotesListSlice: (state, action) => {
      state.nurseNotesListData = action?.payload;
    },
    nurseNotesDropdownSlice: (state, action) => {
      state.nurseNotesDropdownData = action?.payload;
    },
    clearNurseNotesDetailSlice: (state) => {
      state.nurseNotesDetailData = null;
    },
  },
});

export const {
  nurseNotesDetailSlice,
  nurseNotesListSlice,
  clearNurseNotesDetailSlice,
  nurseNotesDropdownSlice,
} = nurseNotesSlice.actions;

export default nurseNotesSlice.reducer;
