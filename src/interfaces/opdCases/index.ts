import { GenericStatus } from "../index";

export type OpdStatus =
  | GenericStatus.PENDING
  | GenericStatus.COMPLETED
  | GenericStatus.CONVERTED_TO_IPD
  | GenericStatus.CANCELLED
 

export interface OpdCase {
  // name: string;
  // phone_no: number | string;
  // email?: string;
  // readonly id: number; // Primary Key, Auto-increment
  // opdNumber: string;
  patient_id: string;

  appointment_id?: number;

  status: OpdStatus;
  visit_date: Date;

  complaint: string;

  referred_to_doctor_id?: number|string;
  convertedToIpdId?: number;
}
