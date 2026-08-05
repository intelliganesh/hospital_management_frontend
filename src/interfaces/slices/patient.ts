import { PatientInterface } from "../patients";

export interface PatientStatsInterface {
  total_patients: number;
  active_patients: number;
}

export interface PatientState {
  patientDetailData: any;
  patientListData: PatientInterface[];
  userCompleteObj: any;
  patientConsultationData: any[];
  patientStatsData: PatientStatsInterface;
}
