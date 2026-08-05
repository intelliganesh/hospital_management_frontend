import { GenericStatus } from "@/interfaces";

export interface Diagnosis {
  diagnosis_name: string;
  icd_code: string;
  description: string;
  is_active: string;
  department_type: string;
}

export interface DiagnosisState {
  loading: boolean;
  diagnosisDetails: any;
  diagnosisList: Diagnosis[];
  diagnosisDropdownList: any[];
}

export const diagnosisStatusOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
