import { combineReducers, configureStore } from "@reduxjs/toolkit";
import roomReducer from "./slices/room";
import systemSettingsReducer from "./slices/systemSettingsSlice";
import userReducer from "./slices/userSlice";
import authentication from "@/actions/slices/auth";
import patient from "@/actions/slices/patient";
import geography from "@/actions/slices/geography";
import dashboard from "@/actions/slices/dashboard";
import roleReducer from "@/actions/slices/roleSlice";
import opd from "@/actions/slices/opd";
import allergies from "@/actions/slices/allergies";
import consultation from "@/actions/slices/consultation";
import appointmentReducer from "@/actions/slices/appointments";
import examinationReducer from "@/actions/slices/examination";
import test from "@/actions/slices/test";
import patientTest from "@/actions/slices/patientTest";
import medicineReducer from "@/actions/slices/medicine";
import medicineCategory from "@/actions/slices/medicineCategory";
import medicineCategoryMapping from "@/actions/slices/medicineCategoryMapping";
import findingReducer from "@/actions/slices/findings";
import yogaAsana from "@/actions/slices/yogaAsana";
import doshaAnalysisReducer from "./slices/doshaAnalysis";
import invoice from "./slices/invoice";
import departmentReducer from "./slices/departments";
import consultationFeesReducer from "./slices/consultationFees";
import surgicalHistory from "./slices/surgicalHistory";
import chiefComplaintReducer from "./slices/chiefComplaints";
import onExamination from "./slices/onExamination";
import comorbidities from "./slices/comorbidities";
import amountTypeReducer from "./slices/amountType";
import serviceCostReducer from "./slices/serviceCost";
import dietReducer from "./slices/diet";
import dynamicFieldSections from "./slices/consultation/dynamicFieldSections";
import diagnosis from "./slices/diagnosis";
import foodAdvice from "./slices/foodAdvice";
import modelStatus from "./slices/medicalStatus";
import expenses from "./slices/expenses";
import expenseReport from "./slices/expenseReport";
import invoiceReport from "./slices/invoiceReport";
import fistulaReport from "./slices/fistulaReport";
import consultationReport from "./slices/consultationReportSlice";
import dreReducer from "./slices/dre";
import proctoscopyReducer from "./slices/proctoscopy";
import fistulaReducer from "./slices/fistula";
import management from "./slices/management";
import postSurgery from "./slices/postSurgery";
import referedByDoc from "./slices/referedByDoc";
import bankDetailsReducer from "./slices/bankDetails";
import onlineAppointments from "./slices/onlineAppointments";

const rootReducer = combineReducers({
  authentication,
  patient,
  geography,
  dashboard,
  opd,
  postSurgery,
  allergies,
  // medicine,
  consultation,
  test,
  patientTest,
  invoiceReport,
  fistulaReport,
  consultationReport,
  medicineCategory,
  medicineCategoryMapping,
  referedByDoc,
  yogaAsana,
  invoice,
  surgicalHistory,
  onExamination,
  comorbidities,
  dynamicFieldSections,
  diagnosis,
  foodAdvice,
  expenses,
  expenseReport,
  management,
  room: roomReducer,
  systemSettings: systemSettingsReducer,
  users: userReducer,
  roles: roleReducer,
  appointment: appointmentReducer,
  examinations: examinationReducer,
  medicines: medicineReducer,
  modelStatus,
  findings: findingReducer,
  doshaAnalysis: doshaAnalysisReducer,
  department: departmentReducer,
  consultationFees: consultationFeesReducer,
  chiefComplaint: chiefComplaintReducer,
  amountType: amountTypeReducer,
  serviceCost: serviceCostReducer,
  diet: dietReducer,
  dre: dreReducer,
  proctoscopy: proctoscopyReducer,
  fistula: fistulaReducer,
  bankDetails: bankDetailsReducer,
  onlineAppointments,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
