import { BloodGroups } from "@/interfaces/index";

export enum Type {
  ALLERGY = "allergy",
  MEDICAL_HISTORY = "medical history",
  CURRENT_MEDICATION = "current medication",
}
export type InfoType =
  | Type.ALLERGY
  | Type.CURRENT_MEDICATION
  | Type.MEDICAL_HISTORY;

export interface PatientMedicalInfo {
  patientId: string;
  type:InfoType;
  value:string;
  bloodgroup:BloodGroups;
  patientNumber:string;
  name:string;
  dob:Date;
  age:string;
}
