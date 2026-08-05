import { departmentOfAnaesthesiaState } from "@/interfaces/ipd/anaesthesia/departmentOfAnaesthesia";
import { createSlice } from "@reduxjs/toolkit";

const initialState: departmentOfAnaesthesiaState = {
  DepartmentOfAnaesthesiaDetails: {},
};

const departmentOfAnaesthesiaSlice = createSlice({
  name: "departmentOfAnaesthesia",
  initialState,
  reducers: {
    departmentOfAnaesthesiaDetailsSlice: (state, action) => {
      state.DepartmentOfAnaesthesiaDetails = action?.payload;
    },
    clearDepartmentOfAnaesthesiaDetailsSlice: (state) => {
      state.DepartmentOfAnaesthesiaDetails = {};
    },
  },
});

export const {
  departmentOfAnaesthesiaDetailsSlice,
  clearDepartmentOfAnaesthesiaDetailsSlice,
} = departmentOfAnaesthesiaSlice.actions;

export default departmentOfAnaesthesiaSlice.reducer;
