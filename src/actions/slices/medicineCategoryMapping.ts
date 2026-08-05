import { MedicineCategoryMappingState } from "@/interfaces/slices/medicineCategoryMapping";
import { createSlice } from "@reduxjs/toolkit";

const initialState: MedicineCategoryMappingState = {
  medicineCategoryMappingListData: [],
  medicineCategoryMappingAllListData: [],
  medicineCategoryMappingDetails: null,
  loading: false,
};

const medicineCategoryMappingSlice = createSlice({
  name: "medicineCategoryMapping",
  initialState,
  reducers: {
    medicineCategoryMappingList: (state, action) => {
      state.medicineCategoryMappingListData = action?.payload;
      state.loading = false;
    },
    medicineCategoryMappingAllList: (state, action) => {
      state.medicineCategoryMappingAllListData = action?.payload;
      state.loading = false;
    },
    medicineCategoryMappingDetails: (state, action) => {
      state.medicineCategoryMappingDetails = action?.payload;
      state.loading = false;
    },
  },
});

export default medicineCategoryMappingSlice.reducer;

export const {
  medicineCategoryMappingList,
  medicineCategoryMappingAllList,
  medicineCategoryMappingDetails,
} = medicineCategoryMappingSlice.actions;
