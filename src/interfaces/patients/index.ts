import {
  Gender,
  MaratalStatus,
  BloodGroups,
  GenericStatus,
  PaymentType,
  AmountFor,
} from "../index";

export type AdmissionStatus =
  | GenericStatus.ADMISSION_PENDING // Awaiting admission
  | GenericStatus.ADMITTED // Officially admitted
  | GenericStatus.DISCHARGE_PENDING // Discharge process initiated but not yet completed
  | GenericStatus.DISCHARGED // Successfully discharged
  | GenericStatus.CLOSED; // Case officially closed

export type TreatmentStatus =
  | GenericStatus.UNDER_DIAGNOSIS // Patient is being evaluated for illness
  | GenericStatus.TEST_PENDING // Lab tests or scans are pending
  | GenericStatus.TEST_COMPLETED // Diagnostic tests completed
  | GenericStatus.PRESCRIBED // Medication has been prescribed
  | GenericStatus.IN_TREATMENT // Actively receiving medical care
  | GenericStatus.UNDER_OBSERVATION // Being monitored before further treatment
  | GenericStatus.FOLLOW_UP_REQUIRED; // Follow-up consultation required

export type SurgeryStatus =
  | GenericStatus.SURGERY_SCHEDULED // Surgery is planned and scheduled
  | GenericStatus.SURGERY_IN_PROGRESS // Surgery is currently being performed
  | GenericStatus.SURGERY_COMPLETED; // Surgery was successfully performed

export type EmergencyStatus =
  | GenericStatus.EMERGENCY // Patient in emergency case
  | GenericStatus.CRITICAL // Patient is in a critical condition (ICU, high risk)
  | GenericStatus.STABLE // Patient’s condition is stable post-treatment
  | GenericStatus.DECEASED; // Patient has passed away

export type ReferralStatus =
  | GenericStatus.NOT_REFERRED // Patient has been referred to another specialist/hospital
  | GenericStatus.REFERRED
  | GenericStatus.TRANSFERRED; // Patient moved to another hospital/department

export type PaymentStatus =
  | GenericStatus.PAYMENT_PENDING // Payment has not been made
  | GenericStatus.PAYMENT_COMPLETED; // Payment successfully completed

export type AdministrativeStatus =
  | GenericStatus.ACTIVE // Patient is currently under care
  | GenericStatus.INACTIVE // Patient is not actively receiving treatment
  | GenericStatus.PENDING // Awaiting confirmation or next steps
  | GenericStatus.CANCELLED // Appointment or procedure canceled
  | GenericStatus.APPROVED // Request or procedure approved
  | GenericStatus.COMPLETED // Treatment successfully completed
  | GenericStatus.DRAFT // Draft status (e.g., incomplete registration)
  | GenericStatus.RESOLVED // Patient issue or complaint resolved
  | GenericStatus.UNRESOLVED; // Pending issue or complaint not resolved

export enum Footype {
  VEGETARIAN = "Vegtarian",
  NON_VEGETARIAN = "Non Vegtarian",
  EGGTARIAN = "Eggtarian",
  VEGAN = "Vegan",
}

// export interface PatientInterface {
//     // readonly patientId: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     phoneNo: string;
//     dob: Date;
//     readonly age: number;
//     gender: Gender;
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//     maratalStatus: MaratalStatus;
//     boodGroup?: BloodGroups;
//     insuranceProvider?: string;
//     insurance_policy_no?: string;
//     referedBy?: string;
//     referedByPhoneNo?: string;
//     referedTo?: string;
//     admissionStatus: AdmissionStatus;
//     treatmentStatus: TreatmentStatus;
//     surgeryStatus?: SurgeryStatus;
//     emergencyStatus?: EmergencyStatus;
//     referralStatus?: ReferralStatus;
//     paymentStatus: PaymentStatus;
//     status: AdministrativeStatus;
// }

export interface PatientInterface {
  // readonly patientId: string;
  first_name: string;
  last_name: string;
  email: string;
  // password: string;
  countryContactCode: string;
  uploadPayload: any;
  phone_no: string;
  dob: Date;
  age: number;
  gender: Gender;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  marital_status: MaratalStatus;
  attendantCountryContactCode?: string;
  blood_group?: BloodGroups;
  insurance_provider?: string;
  insurance_policy_no?: string;
  patient_document?: File[] | string[] | null | string;
  id_type?: string;
  id_value?: string;
  consent: boolean;
  image?: File[] | string[] | null;
  attendant_image?: File[] | string[] | null;
  id_edited?: boolean;
  attendant_id_edited?: boolean;
  id_number_masked?: string;
  attendant_id_number_masked?: string;
  id_proof_for_pan?: string;
  // referred_by?: string;
  attendant_id_type: string;
  attendant_consent: boolean;
  attendant_id_value: string;
  attendant_id_proof_for_pan: string;
  enroll_fees: string;
  attendant_with_patient_name?: string;
  // referred_by_phone_no?: string;
  attendant_with_patient_phone_no?: string;
  dietary_preference?: Footype;
  referred_to?: string;
  front_desk_user_id?: string;
  referred_by_name?: string;
  referred_by_phone_no?: string;
  referred_by_email?: string;
  referred_by_hospital_name?: string;
  admission_status: AdmissionStatus;
  treatment_status: TreatmentStatus;
  surgery_status?: SurgeryStatus;
  emergency_status?: EmergencyStatus;
  referral_status?: ReferralStatus;
  payment_status: PaymentStatus;
  status: AdministrativeStatus;
  referred_by?: string;
  payment_type: PaymentType;
  amount_for: AmountFor;
  created_at: string;
}
