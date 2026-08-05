import { OpdState } from "@/interfaces/slices/opd";
import { AuthPayload } from "@/interfaces/slices/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OpdState = {
  opdFullDetailData: {},
  opdDetailData: {},
  opdListData: [],
  loading: false,
  userList: null,
  allUserList: null,
  patientList: null,
  frontDeskUserList: null,
  appointmentList: null,
};

const opdSlice = createSlice({
  name: "opd",
  initialState,
  reducers: {
    opdDetailSlice: (state: OpdState, action: PayloadAction<AuthPayload>) => {
      state.opdFullDetailData = action?.payload?.data;
      state.opdDetailData = action?.payload?.data?.opd;
      state.loading = false;
    },

    opdListSlice: (state: OpdState, action: PayloadAction<AuthPayload>) => {
      state.opdListData = action.payload;
      state.loading = false;
    },
    puaListSlice: (state, action: PayloadAction<AuthPayload>) => {
      state.userList = action?.payload?.data?.userList;
      state.allUserList = action?.payload?.data?.allUserList;
      state.patientList = action?.payload?.data?.patientList;
      state.appointmentList = action?.payload?.data?.appointmentList;
      state.frontDeskUserList = action?.payload?.data?.frontDeskUserList;
      state.loading = false;
    },

    clearOpdDetailSlice: (state) => {
      state.opdDetailData = null;
    },
  },
});

export const {
  opdDetailSlice,
  opdListSlice,
  clearOpdDetailSlice,
  puaListSlice,
} = opdSlice.actions;

export default opdSlice.reducer;
