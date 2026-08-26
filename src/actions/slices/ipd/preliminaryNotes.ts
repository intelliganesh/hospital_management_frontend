import { createSlice } from "@reduxjs/toolkit";

interface preliminaryNotesState {
  preliminaryNotesDetailData: any;
}
const initialState: preliminaryNotesState = {
  preliminaryNotesDetailData: {},
};

const preliminaryNotesSlice = createSlice({
  name: "preliminaryNotes",
  initialState,
  reducers: {
    preliminaryNotesDetailSlice: (state, action) => {
      state.preliminaryNotesDetailData = action?.payload;
    },
    clearpreliminaryNotesDetailSlice: (state) => {
      state.preliminaryNotesDetailData = null;
    },
  },
});

export const { preliminaryNotesDetailSlice, clearpreliminaryNotesDetailSlice } =
  preliminaryNotesSlice.actions;

export default preliminaryNotesSlice.reducer;
