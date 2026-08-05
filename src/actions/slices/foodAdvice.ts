import { FoodAdviceState } from "@/interfaces/slices/foodAdvice";
import { createSlice } from "@reduxjs/toolkit";

const initialState: FoodAdviceState = {
  loading: false,
  foodAdviceDetails: {},
  foodAdviceList: [],
  foodAdviceDropdownList: [],
};

const foodAdviceSlice = createSlice({
  name: "foodAdvice",
  initialState,
  reducers: {
    foodAdviceDetailSlice(state, action) {
      state.foodAdviceDetails = action.payload;
    },
    foodAdviceListSlice(state, action) {
      state.foodAdviceList = action.payload;
    },
    foodAdviceDropdownListSlice(state, action) {
      state.foodAdviceDropdownList = action.payload;
    },
    clearFoodAdviceSlice(state) {
      state.foodAdviceDetails = {};
      state.loading = false;
    },
  },
});

export const {
  foodAdviceDetailSlice,
  foodAdviceListSlice,
  foodAdviceDropdownListSlice,
  clearFoodAdviceSlice,
} = foodAdviceSlice.actions;
export default foodAdviceSlice.reducer;
