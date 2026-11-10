import { ShlokaState } from "@/interfaces/slices/shloka";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ShlokaState = {
  shlokaDetailData: {},
  shlokaListData: [],
  shlokaDropdownData: [],
  loading: false,
};

const shlokaSlice = createSlice({
  name: "shloka",
  initialState,
  reducers: {
    shlokaDetailSlice: (state, action) => {
      state.shlokaDetailData = action.payload;
    },
    shlokaListSlice: (state, action) => {
      state.shlokaListData = action.payload;
    },
    shlokaDropdownSlice: (state, action) => {
      state.shlokaDropdownData = action.payload;
    },
    clearShlokaDetailSlice: (state) => {
      state.shlokaDetailData = null;
    },
  },
});

export const {
  shlokaDetailSlice,
  shlokaListSlice,
  shlokaDropdownSlice,
  clearShlokaDetailSlice,
} = shlokaSlice.actions;

export default shlokaSlice.reducer;


