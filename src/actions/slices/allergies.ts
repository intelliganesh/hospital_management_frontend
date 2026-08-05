import { AllergyState } from "@/interfaces/slices/allergies";
import { AuthPayload } from "@/interfaces/slices/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AllergyState = {
  allergiesListData: [],
  allergiesDetailData: {},
  loading: false,
};

const allergySlice = createSlice({
  name: "allergies",
  initialState,
  reducers: {
    allergiesDetailSlice: (state: AllergyState, action: PayloadAction<AuthPayload>) => {
      state.allergiesDetailData = action.payload?.data;
      state.loading = false;
    },
    allergiesListSlice: (state: AllergyState, action: PayloadAction<AuthPayload>) => {
      state.allergiesListData = action.payload;
      state.loading = false;
    },
    clearAllergies: (state) => {
      state.allergiesDetailData = {};
    },
  },
});

export const { allergiesDetailSlice, allergiesListSlice, clearAllergies } =
  allergySlice.actions;

export default allergySlice.reducer;
