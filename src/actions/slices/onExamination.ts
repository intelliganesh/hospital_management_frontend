import { OnExaminationState } from "@/interfaces/slices/onExamination";
import { createSlice } from "@reduxjs/toolkit";

const initialState: OnExaminationState = {
  onExaminationDetailData: {},
  onExaminationListData: [],
  onExaminationDropdownData: [],
  loading: false,
};

const onExaminationSlice = createSlice({
  name: "onExamination",
  initialState,
  reducers: {
    onExaminationDetailSlice: (state, action) => {
      state.onExaminationDetailData = action.payload;
      state.loading = false;
    },
    onExaminationListSlice: (state, action) => {
      state.onExaminationListData = action.payload;
      state.loading = false;
    },
    onExaminationDropdownSlice: (state, action) => {
      state.onExaminationDropdownData = action.payload;
      state.loading = false;
    },
    clearOnExaminationSlice: (state) => {
      state.onExaminationDetailData = {};
      state.loading = false;
    },
  },
});

export const {
  onExaminationDetailSlice,
  onExaminationListSlice,
  clearOnExaminationSlice,
  onExaminationDropdownSlice,
} = onExaminationSlice.actions;
export default onExaminationSlice.reducer;
