import { MedicineCategoryState } from "@/interfaces/slices/medicineCategory";
import { createSlice } from "@reduxjs/toolkit";

const initialState: MedicineCategoryState = {
  medicineCategoryListData: [],
  medicineCategoryDetailData: {},
  loading: false,
};

const medicineCategorySlice = createSlice({
  name: "medicineCategory",
  initialState,
  reducers: {
    medicineCategoryListSlice: (state, action) => {
      state.medicineCategoryListData = action?.payload;
      state.loading = false;
    },
    medicineCategoryDetailSlice: (state, action) => {
      state.medicineCategoryDetailData = action?.payload;
      state.loading = false;
    },
    clearMedicineCategoryDetailSlice: (state) => {
      state.medicineCategoryDetailData = null;
    },
  },
});

export const {
  medicineCategoryListSlice,
  medicineCategoryDetailSlice,
  clearMedicineCategoryDetailSlice,
} = medicineCategorySlice.actions;

export default medicineCategorySlice.reducer;
