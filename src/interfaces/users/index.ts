import { Gender, MaratalStatus } from "../index";

export enum Role {
  ADMIN = "Admin",
  DOCTOR = "Doctor",
  NURSE = "Nurse",
  RECEPTIONIST = "Receptionist",
  PHARMACIST = "Pharmacist",
  LABORATORIST = "Laboratorist",
  ACCOUNTANT = "Accountant",
  PATIENT = "patient",
  //   USER = "User",
}

export interface UserInterface {
  //    readonly userId: string,
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  countryContactCode: string;
  phone: string;
  system_settings_id: number;
  // readonly password: string;
  // image: File | string;
  age: number;
  DOB: Date;
  gender: Gender;
  address: string;
  country: string | "India";
  state: string;
  city: string;
  pincode: string;
  marital_status: MaratalStatus;
  id_type?: string;
  id_value?: string;
  id_number_masked?: string;
  id_edited?: boolean;
  consent: boolean;
  Adhar?: string;
  Passport?: string;
  Voter_ID?: string;
  Driving_License?: string;
  Ration_Card?: string;
  id_proof_for_pan?: string;
  // idValue: string;
  department: string;
  designation: string;
  qualification: string;
  letter_header_info: string;
  letter_footer_info: string;
  // department: string;
  role: Role;
  files?: File[] | string[] | null;
  status: boolean;
  // existing_files?: string[] | null;

  // Doctor availability
  // available_days holds both active days and their session time ranges:
  // { "Monday": { "morning": ["09:00","13:00"], "afternoon": ["14:00","17:00"] }, "Friday": { "evening": ["17:00","21:00"] } }
  available_days?: Record<string, Record<string, string[]>>;
  available_time_slots?: string[];
  not_available_dates?: string[];
  slot_duration?: number;
  leave_date?: string[];

  // status: boolean;
}
