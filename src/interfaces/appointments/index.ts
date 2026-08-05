import { AmountFor, GenericStatus, PaymentType } from "../index";
export type AppointmentType =
  | GenericStatus.FIRST_VISIT
  | GenericStatus.FOLLOW_UP
  | GenericStatus.POST_FOLLOW_UP;
export type AppointmentStatus =
  | GenericStatus.PENDING
  | GenericStatus.COMPLETED
  | GenericStatus.CANCELLED;
export type PaymentStatus = GenericStatus.PENDING | GenericStatus.COMPLETED;

export interface AppointmentStats {
  total_appointments: number | null | string;
  todays_appointments: number | null | string;
  completed_appointments: number | null | string;
  pending_appointments: number | null | string;
}

export interface Appointment {
  // readonly appointmentId: number; // Primary Key, Auto-increment
  // appointmentNumber: string; // Unique Appointment Identifier (VARCHAR)
  patient_id: string; // Foreign Key to Patients (UUID)
  doctor_id: number; // Foreign Key to Users (INT - Doctor ID)
  referred_to: number; // Foreign Key to Users (INT - Doctor ID)

  complaint: string; // Detailed reason for the appointment (TEXT)
  chief_complaints: string;
  type: AppointmentType; // First Visit | Follow-up
  // enroll_fees: number; // Appointment Fees (FLOAT)
  // appointment_fees: number; // Appointment Fees (FLOAT)
  amount: number; // Appointment Fees (FLOAT)

  appointment_date?: Date; // Nullable DATE
  appointment_time?: string; // Nullable TIME (Stored as HH:MM:SS format)
  advice?: string;
  preliminary_diagnosis?: string;
  front_desk_user_id: string;
  payment_type: PaymentType;
  payment_status: PaymentStatus;
  amount_for: AmountFor;
  status: AppointmentStatus; // Pending | Completed | Cancelled
  referred_by_name?: string;
  referred_by_phone_no?: string;
  referred_by_email?: string;
  referred_by_hospital_name?: string;
}

// slice initial state
export interface AppointmentState {
  appointmentDetailData: any;
  appointmentListData: Appointment[];
  appointmentStatsData: AppointmentStats;
  userCompleteObj: any;
}
