import React from "react";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/dashboard/Home";
import UsersPage from "@/pages/users/UsersPage";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "@/pages/forms/userForm/user";
import PatientsPage from "@/pages/patient/PatientsPage";
import UserDetailPage from "@/pages/users/UserDetailPage";
import DashboardLayout from "@/components/DashboardLayout";
import PatientAdmissionForm from "@/pages/forms/patientForm/patient";
import PatientDetailsPage from "@/pages/patient/PatientsDetailsPage";
import {
  USER_URL,
  SETTINGS_URL,
  DASHBOARD_URL,
  EDIT_USER_URL,
  USER_TABLE_URL,
  FIRST_PAGE_URL,
  USER_DETAIL_URL,
  PATIENT_TABLE_URL,
  PATIENTS_FORM_URL,
  PATIENT_DETAIL_URL,
  OPD_FORM_URL,
  OPD_TABLE_URL,
  ROOMS_TABLE_URL,
  ROOMS_FORM_URL,
  APPOINTMENT_TABLE_URL,
  APPOINTMENT_FORM_URL,
  ROLES_TABLE_URL,
  ROLES_URL,
  ROOMS_DETAIL_URL,
  EDIT_ROLE_URL,
  OPD_DETAIL_URL,
  EDIT_OPD_URL,
  APPOINTMENT_DETAILS_URL,
  CONSULTATION_TABLE_URL,
  CONSULTATION_FORM_URL,
  EXAMINATION_TABLE_URL,
  EXAMINATION_FORM_URL,
  EXAMINATION_DETAILS_URL,
  CONSULTATION_EDIT_URL,
  CONSULTATION_DETAILS_URL,
  TEST_TABLE_URL,
  TEST_FORM_URL,
  TEST_EDIT_URL,
  TEST_DETAILS_URL,
  MEDICINE_TABLE_URL,
  MEDICINE_FORM_URL,
  MEDICINE_DETAILS_URL,
  ALLERGY_TABLE_URL,
  ALLERGY_FORM_URL,
  ALLERGY_DETAILS_URL,
  ALLERGY_EDIT_URL,
  MEDICINE_CATEGORY_TABLE_URL,
  MEDICINE_CATEGORY_FORM_URL,
  MEDICINE_CATEGORY_EDIT_URL,
  MEDICINE_CATEGORY_MAPPING_TABLE_URL,
  MEDICINE_CATEGORY_MAPPING_FORM_URL,
  MEDICINE_CATEGORY_MAPPING_EDIT_URL,
  PERMISSIONS_URL,
  PATIENT_TEST_TABLE_URL,
  PATIENT_TEST_FORM_URL,
  PATIENT_TEST_EDIT_URL,
  PATIENT_TEST_DETAILS_URL,
  FINDINGS_URL,
  FINDINGS_FORM_URL,
  FINDINGS_EDIT_URL,
  FINDINGS_DETAILS_URL,
  DOSHA_ANALYSIS_URL,
  // PRAKRITI_URL,
  // VIKRUTI_URL,
  YOGA_ASANA_TABLE_URL,
  YOGA_ASANA_FORM_URL,
  YOGA_ASANA_EDIT_URL,
  YOGA_ASANA_DETAILS_URL,
  INVOICE_URL,
  INVOICE_DETAIL_URL,
  DEPARTMENT_TABLE_URL,
  DEPARTMENT_FORM_URL,
  DEPARTMENT_EDIT_URL,
  DEPARTMENT_DETAILS_URL,
  CONSULTATION_FEES_URL,
  CONSULTATION_FEES_FORM_URL,
  CONSULTATION_FEES_EDIT_URL,
  SURGICAL_HISTORY_TABLE_URL,
  SURGICAL_HISTORY_FORM_URL,
  SURGICAL_HISTORY_EDIT_URL,
  SURGICAL_HISTORY_DETAILS_URL,
  CHIEF_COMPLAINT_URL,
  CHIEF_COMPLAINT_FORM_URL,
  CHIEF_COMPLAINT_EDIT_URL,
  CHIEF_COMPLAINT_DETAILS_URL,
  ON_EXAMINATION_TABLE_URL,
  ON_EXAMINATION_FORM_URL,
  ON_EXAMINATION_EDIT_URL,
  ON_EXAMINATION_DETAILS_URL,
  SERVICE_COST_TABLE_URL,
  SERVICE_COST_FORM_URL,
  SERVICE_COST_EDIT_URL,
  SERVICE_COST_DETAILS_URL,
  AMOUNT_TYPE_EDIT_URL,
  AMOUNT_TYPE_TABLE_URL,
  AMOUNT_TYPE_FORM_URL,
  AMOUNT_TYPE_DETAILS_URL,
  COMORBIDITIES_TABLE_URL,
  COMORBIDITIES_FORM_URL,
  COMORBIDITIES_EDIT_URL,
  COMORBIDITIES_DETAILS_URL,
  DIET_TABLE_URL,
  DIET_FORM_URL,
  DIET_EDIT_URL,
  DIET_DETAILS_URL,
  DIAGNOSIS_TABLE_URL,
  DIAGNOSIS_FORM_URL,
  DIAGNOSIS_EDIT_URL,
  DIAGNOSIS_DETAILS_URL,
  FOOD_ADVICE_TABLE_URL,
  FOOD_ADVICE_FORM_URL,
  FOOD_ADVICE_EDIT_URL,
  EXPENSES_TABLE_URL,
  EXPENSES_FORM_URL,
  EXPENSES_EDIT_URL,
  EXPENSES_DETAILS_URL,
  REPORT_EXPENSES,
  REPORT_INVOICE,
  REPORT_FISTULA,
  REPORT_CONSULTATION,
  REPORT,
  DRE_TABLE_URL,
  // DRE_DETAILS_URL,
  DRE_EDIT_URL,
  DRE_FORM_URL,
  PROCTOSCOPY_TABLE_URL,
  // PROCTOSCOPY_DETAILS_URL,
  PROCTOSCOPY_EDIT_URL,
  PROCTOSCOPY_FORM_URL,
  FISTULA_TABLE_URL,
  FISTULA_FORM_URL,
  FISTULA_EDIT_URL,
  MANAGEMENT_TABLE_URL,
  MANAGEMENT_FORM_URL,
  MANAGEMENT_EDIT_URL,
  MANAGEMENT_DETAILS_URL,
  POST_SURGERY_FOLLOW_UP_URL,
  FISTULA_DETAILS_URL,
  REFERRED_BY_TABLE_URL,
  REFERRED_BY_FORM_URL,
  REFERRED_BY_EDIT_FORM_URL,
  IPD_ENROLLMENTS_URL,
  IPD_ENROLLMENT_FORM_URL,
  WARD_TABLE_URL,
  WARD_FORM_URL,
  WARD_EDIT_URL,
  BED_TABLE_URL,
  BED_FORM_URL,
  BED_EDIT_URL,
  BED_DETAILS_URL,
  IPD_PATIENTS_URL,
  IPD_PATIENTS_DETAILS_URL,
  PRELIMINARY_NOTES_URL,
  DOCTOR_NOTES_URL,
  NURSE_NOTES_URL,
  NURSE_NOTE_ADD_URL,
  NURSE_NOTE_EDIT_URL,
  DOCTOR_NOTES_ADD_URL,
  IPD_ENROLLMENT_DETAILS_URL,
  IPD_ENROLLMENT_FORM_EDIT_URL,
  SURGERY_PROCEDURE_URL,
  SURGERY_LIST_URL,
  DOWNLOAD_SURGERY_FORM,
  DOWNLOAD_SURGERY_REPORTS,
  PREFILLED_UPLOADED_FILES_URL,
  DOCTOR_NOTES_EDIT_URL,
  FISTULA_ENTRY_LIST_URL,
  FISTULA_ENTRY_FORM_URL,
  BANK_DETAILS_TABLE_URL,
  BANK_DETAILS_FORM_URL,
  BANK_DETAILS_EDIT_URL,
  BANK_DETAILS_DETAILS_URL,
  IPD_BILLS_URL,
  IPD_BILL_DETAILS_URL,
  IPD_BILL_VIEW_URL,
  ONLINE_APPOINTMENT_TABLE_URL,
  ONLINE_APPOINTMENT_DETAILS_URL,
  PREVIOUS_CONSULTATIONS_URL,
} from "@/utils/urls/frontend";
import OpdCaseForm from "./pages/forms/opdForm/opd";
import OpdPage from "./pages/opd/OpdPage";
import Settings from "./pages/settings/Home";
import { USER_PROFILE_URL } from "./utils/urls/backend";
import RoomsPage from "./pages/rooms/RoomsPage";
import RoomsForm from "./pages/forms/roomsForm/rooms";
import AppointmentForm from "./pages/forms/appointmentsForm/appointment";
import { AppointmentPage } from "./pages/appointments/AppointmentPage";
import RolesPage from "./pages/roles";
import RolesForm from "./pages/forms/rolesForm/role";
import RoomDetails from "./pages/rooms/RoomDetail";
import OpdDetail from "./pages/opd/OpdDetailPage";
import AppointmentDetailsPage from "./pages/appointments/AppointmentDetailsPage";
import ConsultationForm from "./pages/forms/consultationForm/consultation";
import { ExaminationsPage } from "./pages/examinations/ExaminationsPage";
import ExaminationDetailsPage from "./pages/examinations/ExaminationDetailsPage";
import ExaminationForm from "./pages/forms/examinationForm/examination";
import ConsultationPage from "./pages/consultation/ConsultationPage";
import ConsultationDetails from "./pages/consultation/ConsultationDetail";
import PreviousConsultationsPage from "./pages/consultation/PreviousConsultationsPage";
import TestPage from "./pages/test/TestPage";
import TestDetails from "./pages/test/TestDetail";
import MedicinesForm from "./pages/forms/medicinesForm/medicines";
import { MedicinesPage } from "./pages/medicines/MedicinesPage";
import MedicineDetailsPage from "./pages/medicines/MedicineDetailsPage";
import TestForm from "./pages/forms/test/Test";
import AllergyPage from "./pages/allergy/AllergyPage";
import AllergyForm from "./pages/forms/allergy/allergy";
import AllergyDetail from "./pages/allergy/AllergyDetail";
import MedicineCategoryPage from "./pages/medicineCategory/MedicineCategoryPage";
import MedicineCategoryForm from "./pages/forms/medicineCategory/MedicineCategory";
import MedicineCategoryMappingForm from "./pages/forms/medicineCategoryMapping/MedicineCategoryMapping";
import MedicineCategoryMappingPage from "./pages/medicineCategoryMapping/medicineCategoryMappingPage";
import PermissionPage from "./pages/roles/Permission";
import PatientTestPage from "./pages/patien tests/PatientTestPage";
import PatientTestDetails from "./pages/patien tests/PatientTestDetails";
import PatientTestForm from "@/pages/forms/Patient Tests/patientTestForm";
import FindingsPage from "./pages/Findings/FindingsPage";
import FindingsForm from "./pages/forms/findings form/findings";
import FindingDetails from "./pages/Findings/FindingDetail";
import DoshaAnalysisPage from "./pages/doshaAnalysis/DoshaAnalysisPage";
import DoshaAnalysisForm from "./pages/forms/doshaAnalysisForm/doshaAnalysisForm";
import YogaAsanaPage from "./pages/yogaAsana/YogaAsanaPage";
import YogaAsanaForm from "./pages/forms/yogaAsana/yogaAsana";
import YogaAsanaDetail from "./pages/yogaAsana/YogaAsanaDetail";
import InvoicePage from "./pages/invoice/InvoicePage";
import InvoiceDetail from "./pages/invoice/InvoiceDetail";
import DepartmentsPage from "./pages/departments/departments/DepartmentsPage";
import DepartmentForm from "./pages/forms/deparmentsForm/deparmentsForm/departments";
import DepartmentDetails from "./pages/departments/departments/DepartmentDetails";
import BankDetailsPage from "./pages/bankDetails/BankDetailsPage";
import BankDetailsForm from "./pages/forms/bankDetailsForm/BankDetailsForm";
import BankDetailsDetails from "./pages/bankDetails/BankDetailsDetails";
import ConsultatoinFeesPage from "./pages/consultationFees/ConsultatoinFeesPage";
import ConsultationFeesForm from "./pages/forms/consultation fees form/consultationFeesForm";
import SurgicalHistoryPage from "./pages/surgicalHistory/SurgicalHistoryPage";
import SurgicalHistoryForm from "./pages/forms/surgicalHistory/SurgicalHistory";
import ChiefComplaintPage from "./pages/chiefComplaints/ChiefComplaintPage";
import ChiefComplaintForm from "./pages/forms/chief complaints form/chiefComplaintsForm";
import ChiefComplaintDetail from "./pages/chiefComplaints/ChiefComplaintDetail";
import OnExaminationPage from "./pages/onExamination/OnExaminationPage";
import OnExaminationForms from "./pages/forms/onExamination/OnExamination";
import AmountTypePage from "./pages/amount types/AmountTypePage";
import AmountTypeForm from "./pages/forms/amount type/AmountType";
import AmountTypeDetailsPage from "./pages/amount types/AmountTypeDetailsPage";
import ServiceCostsPage from "./pages/serviceCosts/ServiceCostsPage";
import ServiceCostForm from "./pages/forms/serviceCostForm/serviceCostForm";
import ServiceCostDetail from "./pages/serviceCosts/ServiceCostDetail";
import ComorbiditiesPage from "./pages/comorbidities/ComorbiditiesPage";
import ComorbidityForm from "./pages/forms/comorbidities/Comorbidities";
import ComorbidityDetail from "./pages/comorbidities/ComorbiditiesDetail";
import DietPage from "./pages/diet/DietPage";
import DietForm from "./pages/forms/diet/Diet";
import DiagnosisPage from "./pages/diagnosis/DiagnosisPage";
import DiagnosisForm from "./pages/forms/diagnosis/Diagnosis";
import FoodAdvicePage from "./pages/foodAdvice/FoodAdvicePage";
import FoodAdviceForm from "./pages/forms/foodAdvice/FoodAdvice";
import ExpensesForm from "./pages/forms/expenses/Expenses";
import ExpensesPage from "./pages/expenses/ExpensePage";
import ExpenseDetail from "./pages/expenses/ExpenseDetail";
import Expense from "./pages/reports/expense";
import DiagnosisDetail from "./pages/diagnosis/DiagnosisDetail";
import DietDetailsPage from "./pages/diet/DietDetailsPage";
import Invoice from "./pages/reports/invoice";
import FistulaReport from "./pages/reports/fistula";
import ConsultationReport from "./pages/reports/consultation";
import DreForm from "./pages/forms/dre/DreForm";
import ProctoscopyForm from "./pages/forms/proctoscopy/ProctoscopyForm";
import DrePage from "./pages/dre/DrePage";
import ProctoscopyPage from "./pages/proctoscopy/ProctoscopyPage";
import ManagementForm from "./pages/forms/management/ManagementForm";
import ManagementPage from "./pages/management/ManagementPage";
import ManagementDetail from "./pages/management/ManagementDetails";
import FistulaPage from "./pages/fistula/FistulaPage";
import FistulaForm from "./pages/forms/fistula/FistulaForm";
import PostSurgeryFollowUp from "./pages/patient/postSurgeryFollowUp";
import FistulaDetailsPage from "./pages/fistula/FistulaDetailsPage";
import ReferedByDocPage from "./pages/referedByDoc/ReferedByDoc";
import RefferedByDocForm from "./pages/forms/refferedByDoctor/RefferedByDoc";
import IpdEnrollmentsPage from "./pages/ipd/IpdEnrollmentsPage";
import IpdEnrollmentForm from "./pages/forms/ipdForm/IpdEnrollmentForm";
import NurseNotesPage from "./pages/ipd/NurseNotesPage";
import NoteFormPage from "./pages/forms/ipdForm/nurseNotes/NoteFormPage";
import WardsPage from "./pages/wards/WardsPage";
import WardsForm from "./pages/forms/wardsForm/wards";
import BedsPage from "./pages/beds/BedsPage";
import BedsForm from "./pages/forms/bedsForm/beds";
import BedDetails from "./pages/beds/BedDetails";
import IpdPatientsPage from "./pages/ipd patients/ipdPatientsPage";
import IpdPatientDetailsPage from "./pages/ipd patients/ipdPatientsDetail";
import PreliminaryNotesForm from "./pages/ipd patients/preliminary notes";
import DoctorNotesPage from "./pages/ipd/doctorNotes/DoctorNotesPage";
import IpdEnrollmentDetailsPage from "./pages/ipd/IpdEnrollmentDetailsPage";
import PreOperativeChecklist from "./pages/ipd patients/surgeryProcedure";
import SurgeryDetailPage from "./pages/ipd patients/surgeryProcedure/SurgeryDetailPage";
import PACListPage from "./pages/ipd/pac/PACListPage";
import PACFormPage from "./pages/ipd/pac/PACFormPage";
import PACDetailPage from "./pages/ipd/pac/PACDetailPage";
import SurgeryList from "./pages/ipd patients/SurgeryList";
import DownloadSurgeryReports from "./pages/ipd patients/downloads/SurgeryReportsDownload";
import DownloadSurgeryForm from "./pages/ipd patients/downloads/SurgeryFormDownload";
import PrefilledUploadedFiles from "./pages/ipd patients/downloads/PrefilledUploadedFiles";
import DischargeSummaryPage from "./pages/ipd/discharge-summary/DischargeSummaryPage";
import IpdBillViewPage from "./pages/ipd/billing/IpdBillViewPage";
import IpdBillDetailsPage from "./pages/ipd/billing/IpdBillDetailsPage";
import IpdBillsPage from "./pages/ipd/billing/IpdBillsPage";
import DoctorNotesForm from "./pages/forms/ipdForm/doctorNotes";
import FistulaEntryList from "./pages/patient/FistulaEntryList";
import FistulaEntryForm from "./pages/patient/FistulaEntryForm";
import OnlineAppointmentPage from "./pages/onlineAppointments/OnlineAppointmentPage";
import OnlineAppointmentDetailsPage from "./pages/onlineAppointments/OnlineAppointmentDetailsPage";
// import ProtectedRoute from "./ProtectedRoute";
// import { PERMISSIONS } from "./rolesRoute";
// import { GetPatientConsultationList } from "./utils/fetcher";
const WithLogin: React.FC<{}> = () => {
  return (
    <Routes>
      <Route
        path={IPD_BILLS_URL}
        element={
          <DashboardLayout>
            <IpdBillsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={IPD_BILL_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <IpdBillDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          IPD_BILL_DETAILS_URL +
          "/:id"
        }
        element={
          <DashboardLayout>
            <IpdBillDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={IPD_BILL_VIEW_URL + "/:id"}
        element={
          <DashboardLayout>
            <IpdBillViewPage />
          </DashboardLayout>
        }
      />
      <Route
        path={USER_TABLE_URL + USER_URL}
        element={
          <DashboardLayout>
            <Register />
          </DashboardLayout>
        }
      />
      <Route
        path={USER_TABLE_URL + EDIT_USER_URL + "/:id"}
        element={
          <DashboardLayout>
            <Register formType="edit" />
          </DashboardLayout>
        }
      />
      <Route path={FIRST_PAGE_URL} element={<Navigate to={DASHBOARD_URL} />} />
      <Route path={DASHBOARD_URL} element={<Dashboard />} />
      <Route
        path={USER_TABLE_URL}
        element={
          <DashboardLayout>
            <UsersPage />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENT_TABLE_URL}
        element={
          <DashboardLayout>
            <PatientsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENTS_FORM_URL}
        element={
          <DashboardLayout>
            <PatientAdmissionForm />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENTS_FORM_URL + "/:id"}
        element={
          <DashboardLayout>
            <PatientAdmissionForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENT_TABLE_URL + PATIENTS_FORM_URL}
        element={
          <DashboardLayout>
            <PatientAdmissionForm />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENT_TABLE_URL + PATIENTS_FORM_URL + "/:id"}
        element={
          // <ProtectedRoute permissions={[PERMISSIONS.EDIT_PATIENT]}>
          <DashboardLayout>
            <PatientAdmissionForm formType="edit" />
          </DashboardLayout>
          // </ProtectedRoute>
        }
      />
      <Route
        path={SETTINGS_URL}
        element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        }
      />
      <Route
        path={INVOICE_URL}
        element={
          <DashboardLayout>
            <InvoicePage />
          </DashboardLayout>
        }
      />
      <Route
        path={INVOICE_URL + INVOICE_DETAIL_URL + "/:id"}
        element={
          <DashboardLayout>
            <InvoiceDetail />
          </DashboardLayout>
        }
      />
      {/* <Route
        path={ROOMS_TABLE_URL}
        element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        }
      /> */}
      <Route
        path={WARD_TABLE_URL}
        element={
          <DashboardLayout>
            <WardsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={WARD_TABLE_URL + WARD_FORM_URL}
        element={
          <DashboardLayout>
            <WardsForm />
          </DashboardLayout>
        }
      />
      <Route
        path={WARD_TABLE_URL + WARD_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <WardsForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={ROLES_TABLE_URL}
        element={
          <DashboardLayout>
            <RolesPage />
          </DashboardLayout>
        }
      />
      <Route
        path={ROLES_TABLE_URL + ROLES_URL}
        element={
          <DashboardLayout>
            <RolesForm />
          </DashboardLayout>
        }
      />
      <Route
        path={ROLES_TABLE_URL + EDIT_ROLE_URL + "/:id"}
        element={
          <DashboardLayout>
            <RolesForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={USER_TABLE_URL + USER_DETAIL_URL + "/:id"}
        element={
          <DashboardLayout>
            <UserDetailPage />
          </DashboardLayout>
        }
      />
      <Route
        path={USER_PROFILE_URL + "/:id"}
        element={
          <DashboardLayout>
            <Register formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={EDIT_USER_URL + "/:id"}
        element={
          <DashboardLayout>
            <Register formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={USER_PROFILE_URL}
        element={
          <DashboardLayout>
            <UserDetailPage />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENT_TABLE_URL + PATIENT_DETAIL_URL + "/:id"}
        element={
          // <ProtectedRoute permissions={[PERMISSIONS.PATIENT_DETAILS]}>
          <DashboardLayout>
            <PatientDetailsPage />
          </DashboardLayout>
          // </ProtectedRoute>
        }
      />
      <Route
        path={PATIENT_DETAIL_URL + "/:id"}
        element={
          // <ProtectedRoute permissions={[PERMISSIONS.PATIENT_DETAILS]}>
          <DashboardLayout>
            <PatientDetailsPage />
          </DashboardLayout>
          // </ProtectedRoute>
        }
      />
      <Route
        path={OPD_TABLE_URL + OPD_FORM_URL}
        element={
          <DashboardLayout>
            <OpdCaseForm />
          </DashboardLayout>
        }
      />
      <Route
        path={OPD_TABLE_URL + EDIT_OPD_URL + "/:id"}
        element={
          <DashboardLayout>
            <OpdCaseForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={OPD_TABLE_URL + OPD_DETAIL_URL + "/:id"}
        element={
          <DashboardLayout>
            <OpdDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={OPD_TABLE_URL}
        element={
          <DashboardLayout>
            <OpdPage />
          </DashboardLayout>
        }
      />
      <Route
        path={ROOMS_TABLE_URL + ROOMS_FORM_URL}
        element={
          <DashboardLayout>
            <RoomsForm />
          </DashboardLayout>
        }
      />
      <Route
        path={ROOMS_TABLE_URL + ROOMS_FORM_URL + "/:id"}
        element={
          <DashboardLayout>
            <RoomsForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={REPORT_EXPENSES}
        element={
          <DashboardLayout>
            <Expense />
          </DashboardLayout>
        }
      />
      <Route
        path={REPORT_FISTULA}
        element={
          <DashboardLayout>
            <FistulaReport />
          </DashboardLayout>
        }
      />
      <Route
        path={REPORT_CONSULTATION}
        element={
          <DashboardLayout>
            <ConsultationReport />
          </DashboardLayout>
        }
      />
      <Route
        path={ROOMS_TABLE_URL + ROOMS_DETAIL_URL + "/:id"}
        element={
          <DashboardLayout>
            <RoomDetails />
          </DashboardLayout>
        }
      />
      <Route
        path={ROOMS_TABLE_URL}
        element={
          <DashboardLayout>
            <RoomsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={BED_TABLE_URL}
        element={
          <DashboardLayout>
            <BedsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={BED_TABLE_URL + BED_FORM_URL}
        element={
          <DashboardLayout>
            <BedsForm />
          </DashboardLayout>
        }
      />
      <Route
        path={BED_TABLE_URL + BED_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <BedsForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={BED_TABLE_URL + BED_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <BedDetails />
          </DashboardLayout>
        }
      />
      <Route
        path={APPOINTMENT_TABLE_URL + APPOINTMENT_FORM_URL}
        element={
          <DashboardLayout>
            <AppointmentForm />
          </DashboardLayout>
        }
      />
      <Route
        path={APPOINTMENT_FORM_URL}
        element={
          <DashboardLayout>
            <AppointmentForm />
          </DashboardLayout>
        }
      />
      <Route
        path={APPOINTMENT_TABLE_URL + APPOINTMENT_FORM_URL + "/:id"}
        element={
          <DashboardLayout>
            <AppointmentForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={APPOINTMENT_TABLE_URL}
        element={
          <DashboardLayout>
            <AppointmentPage />
          </DashboardLayout>
        }
      />
      <Route
        path={APPOINTMENT_TABLE_URL + APPOINTMENT_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <AppointmentDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={YOGA_ASANA_TABLE_URL + YOGA_ASANA_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <YogaAsanaDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={DEPARTMENT_TABLE_URL}
        element={
          <DashboardLayout>
            <DepartmentsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={DEPARTMENT_TABLE_URL + DEPARTMENT_FORM_URL}
        element={
          <DashboardLayout>
            <DepartmentForm />
          </DashboardLayout>
        }
      />
      <Route
        path={DEPARTMENT_TABLE_URL + DEPARTMENT_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <DepartmentForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={DEPARTMENT_TABLE_URL + DEPARTMENT_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <DepartmentDetails />
          </DashboardLayout>
        }
      />
      <Route
        path={BANK_DETAILS_TABLE_URL}
        element={
          <DashboardLayout>
            <BankDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={BANK_DETAILS_TABLE_URL + BANK_DETAILS_FORM_URL}
        element={
          <DashboardLayout>
            <BankDetailsForm />
          </DashboardLayout>
        }
      />
      <Route
        path={BANK_DETAILS_TABLE_URL + BANK_DETAILS_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <BankDetailsForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={BANK_DETAILS_TABLE_URL + BANK_DETAILS_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <BankDetailsDetails />
          </DashboardLayout>
        }
      />
      <Route
        path={EXAMINATION_TABLE_URL + EXAMINATION_FORM_URL}
        element={
          <DashboardLayout>
            <ExaminationForm />
          </DashboardLayout>
        }
      />
      <Route
        path={EXAMINATION_TABLE_URL + EXAMINATION_FORM_URL + "/:id"}
        element={
          <DashboardLayout>
            <ExaminationForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={EXAMINATION_TABLE_URL}
        element={
          <DashboardLayout>
            <ExaminationsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={EXAMINATION_TABLE_URL + EXAMINATION_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ExaminationDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={CONSULTATION_TABLE_URL + CONSULTATION_FORM_URL}
        element={
          <DashboardLayout>
            <ConsultationForm />
          </DashboardLayout>
        }
      />
      <Route
        path={CONSULTATION_TABLE_URL + CONSULTATION_EDIT_URL + "/:id"}
        element={
          <DashboardLayout mainCompClasses="!py-0">
            <ConsultationForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={CONSULTATION_TABLE_URL}
        element={
          <DashboardLayout>
            <ConsultationPage />
          </DashboardLayout>
        }
      />
      <Route
        path={CONSULTATION_TABLE_URL + CONSULTATION_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ConsultationDetails />
          </DashboardLayout>
        }
      />
      <Route
        path={
          CONSULTATION_TABLE_URL +
          PREVIOUS_CONSULTATIONS_URL +
          "/:patientId/:consultationId"
        }
        element={
          <DashboardLayout>
            <PreviousConsultationsPage />
          </DashboardLayout>
        }
      />

      <Route
        path={MEDICINE_TABLE_URL + MEDICINE_FORM_URL}
        element={
          <DashboardLayout>
            <MedicinesForm />
          </DashboardLayout>
        }
      />
      <Route
        path={MEDICINE_TABLE_URL + MEDICINE_FORM_URL + "/:id"}
        element={
          <DashboardLayout>
            <MedicinesForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={MEDICINE_TABLE_URL}
        element={
          <DashboardLayout>
            <MedicinesPage />
          </DashboardLayout>
        }
      />
      <Route
        path={MEDICINE_TABLE_URL + MEDICINE_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <MedicineDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={TEST_TABLE_URL}
        element={
          <DashboardLayout>
            <TestPage />
          </DashboardLayout>
        }
      />
      <Route
        path={TEST_TABLE_URL + TEST_FORM_URL}
        element={
          <DashboardLayout>
            <TestForm />
          </DashboardLayout>
        }
      />
      <Route
        path={TEST_TABLE_URL + TEST_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <TestForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={TEST_TABLE_URL + TEST_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <TestDetails />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENT_TEST_TABLE_URL}
        element={
          <DashboardLayout>
            <PatientTestPage />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENT_TEST_TABLE_URL + PATIENT_TEST_FORM_URL}
        element={
          <DashboardLayout>
            <PatientTestForm />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENT_TEST_TABLE_URL + PATIENT_TEST_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <PatientTestForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={PATIENT_TEST_TABLE_URL + PATIENT_TEST_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <PatientTestDetails />
          </DashboardLayout>
        }
      />
      <Route
        path={REFERRED_BY_TABLE_URL}
        element={
          <DashboardLayout>
            <ReferedByDocPage />
          </DashboardLayout>
        }
      />
      <Route
        path={REFERRED_BY_TABLE_URL + REFERRED_BY_FORM_URL}
        element={
          <DashboardLayout>
            <RefferedByDocForm />
          </DashboardLayout>
        }
      />
      <Route
        path={REFERRED_BY_TABLE_URL + REFERRED_BY_EDIT_FORM_URL + "/:id"}
        element={
          <DashboardLayout>
            <RefferedByDocForm formType="edit" />
          </DashboardLayout>
        }
      />

      {/* IPD Routes */}
      <Route
        path={IPD_ENROLLMENTS_URL}
        element={
          <DashboardLayout>
            <IpdEnrollmentsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={IPD_ENROLLMENT_FORM_URL + "/:patientId/:consultationId?"}
        element={
          <DashboardLayout>
            <IpdEnrollmentForm formType="addEnrollment" />
          </DashboardLayout>
        }
      />
      <Route
        path={IPD_ENROLLMENT_FORM_EDIT_URL + "/:patientId/:ipdCaseId"}
        element={
          <DashboardLayout>
            <IpdEnrollmentForm formType="editEnrollment" />
          </DashboardLayout>
        }
      />

      {/* PAC Routes */}
      <Route
        path="/ipd/:id/pac"
        element={
          <DashboardLayout>
            <PACListPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/ipd/:id/pac/new"
        element={
          <DashboardLayout>
            <PACFormPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/ipd/:id/pac/:pacId"
        element={
          <DashboardLayout>
            <PACFormPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/ipd/:id/pac/:pacId/view"
        element={
          <DashboardLayout>
            <PACDetailPage />
          </DashboardLayout>
        }
      />

      {/* Discharge Summary Routes */}
      <Route
        path="/ipd/:id/discharge-summary/new"
        element={
          <DashboardLayout>
            <DischargeSummaryPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/ipd/:id/discharge-summary/:summaryId"
        element={
          <DashboardLayout>
            <DischargeSummaryPage />
          </DashboardLayout>
        }
      />

      {/* Nurse Notes Routes */}
      <Route
        path={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/:id${NURSE_NOTES_URL}`}
        element={
          <DashboardLayout>
            <NurseNotesPage />
          </DashboardLayout>
        }
      />
      <Route
        path={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/:id${NURSE_NOTE_ADD_URL}`}
        element={
          <DashboardLayout>
            <NoteFormPage />
          </DashboardLayout>
        }
      />
      <Route
        path={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/:id${NURSE_NOTE_EDIT_URL}/:noteId`}
        element={
          <DashboardLayout>
            <NoteFormPage formType="edit" />
          </DashboardLayout>
        }
      />

      <Route
        path={ALLERGY_TABLE_URL}
        element={
          <DashboardLayout>
            <AllergyPage />
          </DashboardLayout>
        }
      />
      <Route
        path={ALLERGY_TABLE_URL + ALLERGY_FORM_URL}
        element={
          <DashboardLayout>
            <AllergyForm />
          </DashboardLayout>
        }
      />
      <Route
        path={ALLERGY_TABLE_URL + ALLERGY_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <AllergyForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={ALLERGY_TABLE_URL + ALLERGY_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <AllergyDetail />
          </DashboardLayout>
        }
      />

      <Route
        path={MEDICINE_CATEGORY_TABLE_URL}
        element={
          <DashboardLayout>
            <MedicineCategoryPage />
          </DashboardLayout>
        }
      />
      <Route
        path={MEDICINE_CATEGORY_TABLE_URL + MEDICINE_CATEGORY_FORM_URL}
        element={
          <DashboardLayout>
            <MedicineCategoryForm />
          </DashboardLayout>
        }
      />
      <Route
        path={MEDICINE_CATEGORY_TABLE_URL + MEDICINE_CATEGORY_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <MedicineCategoryForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={MEDICINE_CATEGORY_MAPPING_TABLE_URL}
        element={
          <DashboardLayout>
            <MedicineCategoryMappingPage />
          </DashboardLayout>
        }
      />
      <Route
        path={
          MEDICINE_CATEGORY_MAPPING_TABLE_URL +
          MEDICINE_CATEGORY_MAPPING_FORM_URL
        }
        element={
          <DashboardLayout>
            <MedicineCategoryMappingForm />
          </DashboardLayout>
        }
      />
      <Route
        path={
          MEDICINE_CATEGORY_MAPPING_TABLE_URL +
          MEDICINE_CATEGORY_MAPPING_EDIT_URL +
          "/:id"
        }
        element={
          <DashboardLayout>
            <MedicineCategoryMappingForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={ROLES_TABLE_URL + PERMISSIONS_URL}
        element={
          <DashboardLayout>
            <PermissionPage />
          </DashboardLayout>
        }
      />

      <Route
        path={FINDINGS_URL}
        element={
          <DashboardLayout>
            <FindingsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={FINDINGS_URL + FINDINGS_FORM_URL}
        element={
          <DashboardLayout>
            <FindingsForm />
          </DashboardLayout>
        }
      />
      <Route
        path={FINDINGS_URL + FINDINGS_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <FindingsForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={FINDINGS_URL + FINDINGS_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <FindingDetails />
          </DashboardLayout>
        }
      />

      <Route
        path={DOSHA_ANALYSIS_URL + "/:type"}
        element={
          <DashboardLayout>
            <DoshaAnalysisPage />
          </DashboardLayout>
        }
      />
      <Route
        path={DOSHA_ANALYSIS_URL + "/:type" + "/add"}
        element={
          <DashboardLayout>
            <DoshaAnalysisForm />
          </DashboardLayout>
        }
      />
      <Route
        path={DOSHA_ANALYSIS_URL + "/:type" + "/:id"}
        element={
          <DashboardLayout>
            <DoshaAnalysisForm formType="edit" />
            {/* null */}
          </DashboardLayout>
        }
      />
      <Route
        path={REPORT_INVOICE}
        element={
          <DashboardLayout>
            <Invoice />
          </DashboardLayout>
        }
      />
      <Route
        path={YOGA_ASANA_TABLE_URL}
        element={
          <DashboardLayout>
            <YogaAsanaPage />
          </DashboardLayout>
        }
      />
      <Route
        path={YOGA_ASANA_TABLE_URL + YOGA_ASANA_FORM_URL}
        element={
          <DashboardLayout>
            <YogaAsanaForm />
          </DashboardLayout>
        }
      />
      <Route
        path={YOGA_ASANA_TABLE_URL + YOGA_ASANA_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <YogaAsanaForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={YOGA_ASANA_TABLE_URL + YOGA_ASANA_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <AppointmentDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={SURGICAL_HISTORY_TABLE_URL}
        element={
          <DashboardLayout>
            <SurgicalHistoryPage />
          </DashboardLayout>
        }
      />
      <Route
        path={SURGICAL_HISTORY_TABLE_URL + SURGICAL_HISTORY_FORM_URL}
        element={
          <DashboardLayout>
            <SurgicalHistoryForm />
          </DashboardLayout>
        }
      />
      <Route
        path={SURGICAL_HISTORY_TABLE_URL + SURGICAL_HISTORY_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <SurgicalHistoryForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={
          SURGICAL_HISTORY_TABLE_URL + SURGICAL_HISTORY_DETAILS_URL + "/:id"
        }
        element={
          <DashboardLayout>
            <AppointmentDetailsPage />
          </DashboardLayout>
        }
      />

      {/* <Route
        path={DOSHA_ANALYSIS_URL + PRAKRITI_URL}
        element={
          <DashboardLayout>
            <DoshaAnalysisPage />
          </DashboardLayout>
        }
      />
      <Route
        path={DOSHA_ANALYSIS_URL + VIKRUTI_URL}
        element={
          <DashboardLayout>
            <DoshaAnalysisPage />
          </DashboardLayout>
        }
      /> */}

      <Route
        path={CONSULTATION_FEES_URL}
        element={
          <DashboardLayout>
            <ConsultatoinFeesPage />
          </DashboardLayout>
        }
      />
      <Route
        path={CONSULTATION_FEES_URL + CONSULTATION_FEES_FORM_URL}
        element={
          <DashboardLayout>
            <ConsultationFeesForm />
          </DashboardLayout>
        }
      />
      <Route
        path={CONSULTATION_FEES_URL + CONSULTATION_FEES_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <ConsultationFeesForm formType="edit" />
          </DashboardLayout>
        }
      />

      <Route
        path={CHIEF_COMPLAINT_URL}
        element={
          <DashboardLayout>
            <ChiefComplaintPage />
          </DashboardLayout>
        }
      />
      <Route
        path={CHIEF_COMPLAINT_URL + CHIEF_COMPLAINT_FORM_URL}
        element={
          <DashboardLayout>
            <ChiefComplaintForm />
          </DashboardLayout>
        }
      />
      <Route
        path={CHIEF_COMPLAINT_URL + CHIEF_COMPLAINT_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <ChiefComplaintForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={CHIEF_COMPLAINT_URL + CHIEF_COMPLAINT_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ChiefComplaintDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={ON_EXAMINATION_TABLE_URL}
        element={
          <DashboardLayout>
            <OnExaminationPage />
          </DashboardLayout>
        }
      />

      <Route
        path={AMOUNT_TYPE_TABLE_URL}
        element={
          <DashboardLayout>
            <AmountTypePage />
          </DashboardLayout>
        }
      />

      <Route
        path={ON_EXAMINATION_TABLE_URL + ON_EXAMINATION_FORM_URL}
        element={
          <DashboardLayout>
            <OnExaminationForms />
          </DashboardLayout>
        }
      />
      <Route
        path={ON_EXAMINATION_TABLE_URL + ON_EXAMINATION_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <OnExaminationForms formType="edit" />
          </DashboardLayout>
        }
      />
      {/* <Route
        path={ON_EXAMINATION_TABLE_URL + ON_EXAMINATION_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <OnExaminationDetails />
          </DashboardLayout>
        }
      /> */}
      <Route
        path={AMOUNT_TYPE_TABLE_URL + AMOUNT_TYPE_FORM_URL}
        element={
          <DashboardLayout>
            <AmountTypeForm />
          </DashboardLayout>
        }
      />
      <Route
        path={ON_EXAMINATION_TABLE_URL + ON_EXAMINATION_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <OnExaminationForms formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={AMOUNT_TYPE_TABLE_URL + AMOUNT_TYPE_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <AmountTypeForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={ON_EXAMINATION_TABLE_URL + ON_EXAMINATION_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ChiefComplaintDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={AMOUNT_TYPE_TABLE_URL + AMOUNT_TYPE_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <AmountTypeDetailsPage />
          </DashboardLayout>
        }
      />

      <Route
        path={SERVICE_COST_TABLE_URL}
        element={
          <DashboardLayout>
            <ServiceCostsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={SERVICE_COST_TABLE_URL + SERVICE_COST_FORM_URL}
        element={
          <DashboardLayout>
            <ServiceCostForm />
          </DashboardLayout>
        }
      />
      <Route
        path={SERVICE_COST_TABLE_URL + SERVICE_COST_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <ServiceCostForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={SERVICE_COST_TABLE_URL + SERVICE_COST_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ServiceCostDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={DIAGNOSIS_TABLE_URL}
        element={
          <DashboardLayout>
            <DiagnosisPage />
          </DashboardLayout>
        }
      />
      <Route
        path={DIAGNOSIS_TABLE_URL + DIAGNOSIS_FORM_URL}
        element={
          <DashboardLayout>
            <DiagnosisForm />
          </DashboardLayout>
        }
      />
      <Route
        path={DIAGNOSIS_TABLE_URL + DIAGNOSIS_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <DiagnosisForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={DIAGNOSIS_TABLE_URL + DIAGNOSIS_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <DiagnosisDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={FOOD_ADVICE_TABLE_URL}
        element={
          <DashboardLayout>
            <FoodAdvicePage />
          </DashboardLayout>
        }
      />
      <Route
        path={FOOD_ADVICE_TABLE_URL + FOOD_ADVICE_FORM_URL}
        element={
          <DashboardLayout>
            <FoodAdviceForm />
          </DashboardLayout>
        }
      />
      <Route
        path={FOOD_ADVICE_TABLE_URL + FOOD_ADVICE_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <FoodAdviceForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={FOOD_ADVICE_TABLE_URL + DIAGNOSIS_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ServiceCostDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={COMORBIDITIES_TABLE_URL}
        element={
          <DashboardLayout>
            <ComorbiditiesPage />
          </DashboardLayout>
        }
      />

      <Route
        path={DIET_TABLE_URL}
        element={
          <DashboardLayout>
            <DietPage />
          </DashboardLayout>
        }
      />
      <Route
        path={COMORBIDITIES_TABLE_URL + COMORBIDITIES_FORM_URL}
        element={
          <DashboardLayout>
            <ComorbidityForm />
          </DashboardLayout>
        }
      />
      <Route
        path={DIET_TABLE_URL + DIET_FORM_URL}
        element={
          <DashboardLayout>
            <DietForm />
          </DashboardLayout>
        }
      />
      <Route
        path={COMORBIDITIES_TABLE_URL + COMORBIDITIES_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <ComorbidityForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={DIET_TABLE_URL + DIET_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <DietForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={COMORBIDITIES_TABLE_URL + COMORBIDITIES_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ComorbidityDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={DIET_TABLE_URL + DIET_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <DietDetailsPage />

            {/* <ComorbidityDetail />
            nulll */}
          </DashboardLayout>
        }
      />

      <Route
        path={EXPENSES_TABLE_URL}
        element={
          <DashboardLayout>
            <ExpensesPage />
          </DashboardLayout>
        }
      />
      <Route
        path={EXPENSES_TABLE_URL + EXPENSES_FORM_URL}
        element={
          <DashboardLayout>
            <ExpensesForm />
          </DashboardLayout>
        }
      />
      <Route
        path={EXPENSES_TABLE_URL + EXPENSES_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <ExpensesForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={EXPENSES_TABLE_URL + EXPENSES_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ExpenseDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={REPORT + EXPENSES_TABLE_URL + EXPENSES_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ExpenseDetail />
          </DashboardLayout>
        }
      />

      <Route
        path={DRE_TABLE_URL}
        element={
          <DashboardLayout>
            <DrePage />
          </DashboardLayout>
        }
      />
      <Route
        path={DRE_TABLE_URL + DRE_FORM_URL}
        element={
          <DashboardLayout>
            <DreForm />
          </DashboardLayout>
        }
      />
      <Route
        path={DRE_TABLE_URL + DRE_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <DreForm formType="edit" />
          </DashboardLayout>
        }
      />

      <Route
        path={PROCTOSCOPY_TABLE_URL}
        element={
          <DashboardLayout>
            <ProctoscopyPage />
          </DashboardLayout>
        }
      />
      <Route
        path={PROCTOSCOPY_TABLE_URL + PROCTOSCOPY_FORM_URL}
        element={
          <DashboardLayout>
            <ProctoscopyForm />
          </DashboardLayout>
        }
      />
      <Route
        path={PROCTOSCOPY_TABLE_URL + PROCTOSCOPY_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <ProctoscopyForm formType="edit" />
          </DashboardLayout>
        }
      />

      <Route
        path={FISTULA_TABLE_URL}
        element={
          <DashboardLayout>
            <FistulaPage />
          </DashboardLayout>
        }
      />
      <Route
        path={MANAGEMENT_TABLE_URL}
        element={
          <DashboardLayout>
            <ManagementPage />
          </DashboardLayout>
        }
      />
      <Route
        path={FISTULA_TABLE_URL}
        element={
          <DashboardLayout>
            <FistulaPage />
          </DashboardLayout>
        }
      />
      <Route
        path={MANAGEMENT_TABLE_URL + MANAGEMENT_FORM_URL}
        element={
          <DashboardLayout>
            <ManagementForm />
          </DashboardLayout>
        }
      />

      <Route
        path={FISTULA_TABLE_URL + FISTULA_FORM_URL}
        element={
          <DashboardLayout>
            <FistulaForm />
          </DashboardLayout>
        }
      />
      <Route
        path={MANAGEMENT_TABLE_URL + MANAGEMENT_FORM_URL}
        element={
          <DashboardLayout>
            <ManagementForm />
          </DashboardLayout>
        }
      />
      <Route
        path={FISTULA_TABLE_URL + FISTULA_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <FistulaForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={MANAGEMENT_TABLE_URL + MANAGEMENT_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <ManagementForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={MANAGEMENT_TABLE_URL + MANAGEMENT_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <ManagementDetail />
          </DashboardLayout>
        }
      />
      <Route
        path={FISTULA_TABLE_URL + FISTULA_EDIT_URL + "/:id"}
        element={
          <DashboardLayout>
            <FistulaForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={FISTULA_TABLE_URL + FISTULA_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <FistulaDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={FISTULA_ENTRY_LIST_URL}
        element={
          <DashboardLayout>
            <FistulaEntryList />
          </DashboardLayout>
        }
      />
      <Route
        path={FISTULA_ENTRY_LIST_URL + FISTULA_ENTRY_FORM_URL}
        element={
          <DashboardLayout>
            <FistulaEntryForm formType="add" />
          </DashboardLayout>
        }
      />
      <Route
        path={FISTULA_ENTRY_LIST_URL + FISTULA_ENTRY_FORM_URL + "/:id"}
        element={
          <DashboardLayout>
            <FistulaEntryForm formType="edit" />
          </DashboardLayout>
        }
      />

      <Route
        path={POST_SURGERY_FOLLOW_UP_URL + "/:id"}
        element={
          <DashboardLayout>
            <PostSurgeryFollowUp />
          </DashboardLayout>
        }
      />

      <Route
        path={IPD_ENROLLMENT_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <IpdEnrollmentDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={IPD_PATIENTS_URL}
        element={
          <DashboardLayout>
            <IpdPatientsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={IPD_PATIENTS_URL + IPD_PATIENTS_DETAILS_URL + "/:id"}
        element={
          <DashboardLayout>
            <IpdPatientDetailsPage />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          PRELIMINARY_NOTES_URL +
          "/add/:id"
        }
        element={
          <DashboardLayout>
            <PreliminaryNotesForm formType="add" />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          PRELIMINARY_NOTES_URL +
          "/edit/:id"
        }
        element={
          <DashboardLayout>
            <PreliminaryNotesForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          DOCTOR_NOTES_URL +
          "/:id"
        }
        element={
          <DashboardLayout>
            <DoctorNotesPage />
          </DashboardLayout>
        }
      />
      <Route
        path={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/:id${DOCTOR_NOTES_ADD_URL}`}
        element={
          <DashboardLayout>
            <DoctorNotesForm />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          "/:id" +
          DOCTOR_NOTES_EDIT_URL +
          "/:noteId"
        }
        element={
          <DashboardLayout>
            <DoctorNotesForm formType="edit" />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          SURGERY_LIST_URL +
          "/:id"
        }
        element={
          <DashboardLayout>
            <SurgeryList />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          SURGERY_PROCEDURE_URL +
          "/:id"
        }
        element={
          <DashboardLayout>
            <PreOperativeChecklist />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          SURGERY_PROCEDURE_URL +
          "/:id/view"
        }
        element={
          <DashboardLayout>
            <SurgeryDetailPage />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          DOWNLOAD_SURGERY_FORM +
          "/:id"
        }
        element={
          <DashboardLayout>
            <DownloadSurgeryForm />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          DOWNLOAD_SURGERY_REPORTS +
          "/:id"
        }
        element={
          <DashboardLayout>
            <DownloadSurgeryReports />
          </DashboardLayout>
        }
      />
      <Route
        path={
          IPD_PATIENTS_URL +
          IPD_PATIENTS_DETAILS_URL +
          PREFILLED_UPLOADED_FILES_URL +
          "/:id"
        }
        element={
          <DashboardLayout>
            <PrefilledUploadedFiles />
          </DashboardLayout>
        }
      />

      <Route
        path={ONLINE_APPOINTMENT_TABLE_URL}
        element={
          <DashboardLayout>
            <OnlineAppointmentPage />
          </DashboardLayout>
        }
      />
      <Route
        path={ONLINE_APPOINTMENT_DETAILS_URL}
        element={
          <DashboardLayout>
            <OnlineAppointmentDetailsPage />
          </DashboardLayout>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default WithLogin;
