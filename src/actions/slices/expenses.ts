import { ExpenseState } from "@/interfaces/slices/expenses";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ExpenseState = {
  loading: false,
  expensesDetails: {},
  expensesList: [],
  expenseDropdownList: [],
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    expenseListSlice: (state, action) => {
      state.expensesList = action.payload;
      state.loading = false;
    },
    expenseDetailSlice: (state, action) => {
      state.expensesDetails = action.payload;
      state.loading = false;
    },

    expenseDropdownSlice: (state, action) => {
      state.expenseDropdownList = action.payload;
      state.loading = false;
    },
    clearExpenseSlice: (state) => {
      state.expensesDetails = {};
      state.loading = false;
    },
  },
});

export const {
  expenseListSlice,
  expenseDetailSlice,
  clearExpenseSlice,
  expenseDropdownSlice,
} = expenseSlice.actions;
export default expenseSlice.reducer;
