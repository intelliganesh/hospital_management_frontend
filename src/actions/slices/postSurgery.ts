import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  postSurgeryDetailData: null,
  postSurgeryListData: [],
  postSurgeryFollowUpDetailDropdownData: [],
  loading: false,
};

const postSurgerySlice = createSlice({
  name: "postSurgery",
  initialState,
  reducers: {
    postSurgeryDetailSlice: (state, action) => {
      state.postSurgeryDetailData = action?.payload;
      state.loading = false;
    },
    postSurgeryListSlice: (state, action) => {
      state.postSurgeryListData = action?.payload;
      state.loading = false;
    },
    postSurgeryFollowUpDetailDropdownSlice: (state, action) => {
      state.postSurgeryFollowUpDetailDropdownData = action?.payload;
      state.loading = false;
    },
    clearpostSurgeryDetailSlice: (state) => {
      state.postSurgeryDetailData = null;
    },
  },
});

export const {
  postSurgeryDetailSlice,
  postSurgeryListSlice,
  postSurgeryFollowUpDetailDropdownSlice,
  clearpostSurgeryDetailSlice,
} = postSurgerySlice.actions;

export default postSurgerySlice.reducer;
