import { ConsultationFeesState } from "@/interfaces/master/consultatoin fees(cost)";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ConsultationFeesState = {
  consultationFeesDetailData: {},
  consultationFeesListData: [],
  consultationFeesDropdownData: [],
};

const consultationFeesSlice = createSlice({
  name: "consultationFees",
  initialState,
  reducers: {
    consultationFeesListSlice: (state, action) => {
      state.consultationFeesListData = action?.payload;
    },
    consultationFeesDetailSlice: (state, action) => {
      state.consultationFeesDetailData = action?.payload;
    },
    consultationFeesDropdownSlice: (state, action) => {
        state.consultationFeesDropdownData = action?.payload;
    },
    clearConsultationFeesDetailSlice: (state) => {
      state.consultationFeesDetailData = null;
    },
  },
});

export const {
  consultationFeesDetailSlice,
  consultationFeesListSlice,
  clearConsultationFeesDetailSlice,
  consultationFeesDropdownSlice,
} = consultationFeesSlice.actions;

export default consultationFeesSlice.reducer;

