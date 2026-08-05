import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testStatus: false,
  servicesStatus: false,
  dietPlanStatus: false,
  diagnosisStatus: false,
  comorbiditiesStatus: false,
  onExaminationStatus: false,
  chiefComplaintStatus: false,
  surgicalHistoryStatus: false,
  dreHistoryStatus: false,
  proctoscopyStatus: false,
  managementStatus: false,
  medicineStatus: false,
};

const modelStatusSlice = createSlice({
  name: "modelStatus",
  initialState,
  reducers: {
    setChiefComplaintModel: (state, action) => {
      state.chiefComplaintStatus = action.payload;
    },
    setSurgicalHistoryModel: (state, action) => {
      state.surgicalHistoryStatus = action.payload;
    },
    setComorbiditiesModel: (state, action) => {
      state.comorbiditiesStatus = action.payload;
    },
    setOnExaminationModel: (state, action) => {
      state.onExaminationStatus = action.payload;
    },
    setDiagnosisModel: (state, action) => {
      state.diagnosisStatus = action.payload;
    },
    setTestModel: (state, action) => {
      state.testStatus = action.payload;
    },
    setDietPlanModel: (state, action) => {
      state.dietPlanStatus = action.payload;
    },
    setDreModel: (state, action) => {
      state.dreHistoryStatus = action.payload;
    },
    setProctoscopyModel: (state, action) => {
      state.proctoscopyStatus = action.payload;
    },
    setManagementModel: (state, action) => {
      state.managementStatus = action.payload;
    },

    setServicesModel: (state, action) => {
      state.servicesStatus = action.payload;
    },
    setMedicineModel: (state, action) => {
      state.medicineStatus = action.payload;
    },
  },
});

export const {
  setDreModel,
  setTestModel,
  setDietPlanModel,
  setServicesModel,
  setDiagnosisModel,
  setManagementModel,
  setProctoscopyModel,
  setOnExaminationModel,
  setComorbiditiesModel,
  setChiefComplaintModel,
  setSurgicalHistoryModel,
  setMedicineModel,
} = modelStatusSlice.actions;
export default modelStatusSlice.reducer;
