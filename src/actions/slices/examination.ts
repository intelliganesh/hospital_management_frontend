import { AuthPayload } from "@/interfaces/slices/auth";
import { ExaminationState } from "@/interfaces/examination/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ExaminationState = {
    examinationDetails: {},
    examinationList: [],
    userCompleteObj: null,
};



const examinationSlice = createSlice({
  name: "examinations",
  initialState,
  reducers: {
    examinationDetailReducer: (
      state: ExaminationState,
      action: PayloadAction<AuthPayload>
    ) => {
      state.examinationDetails = action.payload?.data;
    },

    examinationListReducer: (
      state: ExaminationState,
      action: PayloadAction<AuthPayload>
    ) => {
      // state.patientListData = action.payload?.data;
      state.userCompleteObj = action?.payload;
    },

    clearExaminationDetailsReducer: (state) => {
      state.examinationDetails = null;
    },

    // deletePatientSuccess: (state, action: PayloadAction<string>) => {
    //   state.patientListData = state.patientListData.filter(
    //     (patient) => patient?.id !== action.payload
    //   );
    //   if (state.patientDetailData?.id === action.payload) {
    //     state.patientDetailData = null;
    //   }
      // state.loading = false;
//     },
  },
});


export const {
    examinationDetailReducer,
    examinationListReducer,
    clearExaminationDetailsReducer,
} = examinationSlice.actions;

export default examinationSlice.reducer;
