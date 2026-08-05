import { ReferedByDocState } from "@/interfaces/referedByDoc";
import { AuthPayload } from "@/interfaces/slices/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ReferedByDocState = {
  referedByListData: [],
  referedByDetailData: {},
  referedByDropdownData: [],
};

const referedByDocSlice = createSlice({
  name: "referedByDoc",
  initialState,
  reducers: {
    referedByDocListReducer: (
      state: ReferedByDocState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.referedByListData = action.payload;
      // state.loading = false;
    },

    referedByDocDetailReducer: (
      state: ReferedByDocState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.referedByDetailData = action.payload?.data;
      // state.loading = false;
    },
    referedByDocDropdownReducer: (
      state: ReferedByDocState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.referedByDropdownData = action.payload;
      // state.loading = false;
    },
    clearReferedByDocDetailReducer: (state: ReferedByDocState) => {
      state.referedByDetailData = {};
    },
  },
});

export const {
  referedByDocDetailReducer,
  referedByDocListReducer,
  clearReferedByDocDetailReducer,
  referedByDocDropdownReducer,
} = referedByDocSlice.actions;

export default referedByDocSlice.reducer;
