import { ConsultationState } from "@/interfaces/slices/consultation";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ConsultationState = {
  consultationDetailData: {},
  consultationListData: [],
  consultationStatsData: {
    total_consultations: 0,
    todays_consultations: 0,
    completed_consultations: 0,
  },
  consultationDropdownData: [],
  loading: false,
  consultationAmount: 0,
  additionalCost: [],
};

const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    consultationListSlice: (state, action) => {
      state.consultationListData = action?.payload;
      state.loading = false;
    },
    consultationDetailSlice: (state, action) => {
      state.consultationDetailData = action?.payload;
      state.loading = false;
    },
    consultationDropdownSlice: (state, action) => {
      state.consultationDropdownData = action?.payload;
      state.loading = false;
    },
    clearConsultationDetailSlice: (state) => {
      state.consultationDetailData = null;
    },
    setConsultationAmount: (state, action) => {
      state.consultationAmount =
        action.payload === "add"
          ? action?.payload.amount + state.consultationAmount
          : action?.payload.amount;
    },
    clearConsultationAmount: (state) => {
      state.consultationAmount = 0;
    },
    consultationStatsSlice: (state, action) => {
      state.consultationStatsData = action?.payload;
    },
    additionalCostSlice: (state, action) => {
      state.additionalCost = action?.payload;
    },
    clearAdditionalCostSlice: (state) => {
      state.additionalCost = [];
    },
  },
});

export const {
  consultationDetailSlice,
  consultationListSlice,
  clearConsultationAmount,
  setConsultationAmount,
  clearConsultationDetailSlice,
  consultationDropdownSlice,
  consultationStatsSlice,
  additionalCostSlice,
  clearAdditionalCostSlice,
} = consultationSlice.actions;
export default consultationSlice.reducer;
