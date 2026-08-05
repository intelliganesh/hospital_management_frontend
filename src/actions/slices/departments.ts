import { DepartmentState } from "@/interfaces/departments/index";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DepartmentState = {
  departmentDetailData: {},
  departmentListData: [],
  departmentDropdownData: [],
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    departmentDetailSlice: (state, action) => {
      state.departmentDetailData = action?.payload;
    },
    departmentListSlice: (state, action) => {
      state.departmentListData = action?.payload;
    },
    departmentDropdownSlice: (state, action) => {
      state.departmentDropdownData = action?.payload;
    },
    clearDepartmentDetailSlice: (state) => {
      state.departmentDetailData = null;
    },
  },
});

export const {
  departmentDetailSlice,
  departmentListSlice,
  departmentDropdownSlice,
  clearDepartmentDetailSlice,
} = departmentSlice.actions;

export default departmentSlice.reducer;
