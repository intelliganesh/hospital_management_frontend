import { TestState } from "@/interfaces/slices/test";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TestState = {
  testDetailData: {},
  testListData: [],
  testDropdownData: [],
  loading: false,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    testListSlice: (state, action) => {
      state.testListData = action?.payload;
      state.loading = false;
    },
    testDetailSlice: (state, action) => {
      state.testDetailData = action?.payload;
      state.loading = false;
    },
    testDropdownSlice: (state, action) => {
      state.testDropdownData = action?.payload;
      state.loading = false;
    },
    clearTestDetailSlice: (state) => {
      state.testDetailData = null;
    },
  },
});
export const { testDetailSlice, testListSlice, testDropdownSlice, clearTestDetailSlice } =
  testSlice.actions;
export default testSlice.reducer;
