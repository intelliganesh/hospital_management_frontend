import { AuthPayload } from "@/interfaces/slices/auth";
import { Geography } from "@/interfaces/slices/geography";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Geography = {
  countries: [],
  states: [],
  cities: [],
};

const patientSlice = createSlice({
  name: "geography",
  initialState,
  reducers: {
    countriesSlice: (state: Geography, action: PayloadAction<AuthPayload>) => {
      state.countries = action.payload?.data;
    },
    stateSlice: (state: Geography, action: PayloadAction<AuthPayload>) => {
      state.states = action.payload?.data;
    },
    citySlice: (state: Geography, action: PayloadAction<AuthPayload>) => {
      state.cities = action.payload?.data;
    },
  },
});

export const { countriesSlice, stateSlice, citySlice } = patientSlice.actions;

export default patientSlice.reducer;
