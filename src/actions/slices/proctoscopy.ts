import { ProctoscopyState } from "@/interfaces/proctoscopy/index";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProctoscopyState = {
  proctoscopyDetailData: {},
  proctoscopyListData: [],
  proctoscopyDropdownData: [],
};

const proctoscopySlice = createSlice({
  name: "proctoscopy",
  initialState,
  reducers: {
    proctoscopyDetailSlice: (state, action) => {
      state.proctoscopyDetailData = action?.payload;
    },
    proctoscopyListSlice: (state, action) => {
      state.proctoscopyListData = action?.payload;
    },
    proctoscopyDropdownSlice: (state, action) => {
      state.proctoscopyDropdownData = action?.payload;
    },
    clearProctoscopyDetailSlice: (state) => {
      state.proctoscopyDetailData = null;
    },
  },
});

export const {
  proctoscopyDetailSlice,
  proctoscopyListSlice,
  clearProctoscopyDetailSlice,
  proctoscopyDropdownSlice,
} = proctoscopySlice.actions;

export default proctoscopySlice.reducer;
