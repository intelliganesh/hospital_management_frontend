import { GenericStatus } from "@/interfaces/index";

export type ResultStatus =
  | GenericStatus.PENDING
  | GenericStatus.STARTED
  | GenericStatus.COMPLETED;

export interface Test {
  id?: number;
  test_name: string;
  test_description: string;
  tax_price: number;
  test_price: number;
  // department_type: string;
}

export interface PatientTest extends Test {
  consultation_id: number;
  test_id?: number;
  test_place: string;
  billing_amount?: number;
  result_status: ResultStatus;
  result_uploaded_by?: string;
  document_upload?: string;

  patient_id?: string;
  doctor_id?: number;
}

export interface pateintTestState {
  patientTestDetailData: any;
  patientTestListData: PatientTest[] | any;
  userCompleteObj?: any;
}
