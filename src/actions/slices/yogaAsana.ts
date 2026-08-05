import { YogaAsanaState } from "@/interfaces/slices/yogaAsana";
import { createSlice } from "@reduxjs/toolkit";

const initialState: YogaAsanaState = {
  yogaAsanaDetailData: {},
  yogaAsanaListData: [],
  yogaAsanaDropdownData: [],
  loading: false,
};

const yogaAsanaSlice = createSlice({
  name: "yogaAsana",
  initialState,
  reducers: {
    yogaAsanaDetailSlice: (state, action) => {
      state.yogaAsanaDetailData = action.payload;
    },
    yogaAsanaListSlice: (state, action) => {
      state.yogaAsanaListData = action.payload;
    },
    yogaAsanaDropdownSlice: (state, action) => {
      state.yogaAsanaDropdownData = action.payload;
    },
    clearYogaAsanaDetailSlice: (state) => {
      state.yogaAsanaDetailData = null;
    },
  },
});

export const {
  yogaAsanaDetailSlice,
  yogaAsanaListSlice,
  yogaAsanaDropdownSlice,
  clearYogaAsanaDetailSlice,
} = yogaAsanaSlice.actions;

export default yogaAsanaSlice.reducer;


