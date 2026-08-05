import { GenericStatus } from "..";

export type paymentStatus = GenericStatus.PENDING | GenericStatus.COMPLETED;
// export type AppointmentTypeProps = "Follow-up" | "First Visit";
export enum AppointmentTypeProps {
  "Follow-up" = "Follow-up",
  "First Visit" = "First Visit",
}
export type ExaminationType = "Proctology" | "Non Proctology";

export type PreviousScar = GenericStatus.YES | GenericStatus.NO;

export interface Consultation {
  id?: number | string;
  appointment_id: string;
  patient_id: string;
  doctor_id: number;
  next_visit_date?: Date;
  referred_by_name?: string;
  complaint: string;
  advice_admition_date?: Date;
  advice: string;
  patient_document?: File[] | string[] | null | string | any[];
  // preliminary_diagnosis: Array<{ id: number | string; label: string | number; value: string | number }>[];
  preliminary_diagnosis: string;
  preliminary_diagnostic: string;
  diagnosis_summary: string;
  description: string;
  temperature: string;
  temperature_unit: string;
  bp: string;
  pulse: string;
  cvs: string;
  rs: string;
  type: ExaminationType;
  appointment_type: AppointmentTypeProps;
  relinkPatient: boolean;
  complaint_name?: any;
  chief_complaints?: any[];
  surgical_history?: Array<{
    id: number | string;
    label: string | number;
    value: string | number;
  }>[];
  co_morbidities?: any[];
  co_morbidities_description?: string;
  // co_morbidities?: Array<{ id: number | string; label: string | number; value: string | number }>[];
  // co_morbidities_data?: any[];
  on_examination?: Array<{
    id: number | string;
    label: string | number;
    value: string | number;
  }>[];
  previous_scar?: PreviousScar;
  previous_scar_position?: string;
  abscess?: PreviousScar;
  abscess_position?: string;
  internal_opening_position?: string;
  anal_valve?: string;
  secondary_opening_position?: string;
  secondary_anal_valve?: string;
  diet_plan?: Array<{
    id: number | string;
    label: string | number;
    value: string | number;
  }>[];
  diagnosis?: Array<{
    id: number | string;
    label: string | number;
    value: string | number;
  }>[];
  treatment_plan?: string;
  type_of_fistula_position?: string;
  type_of_fistula_sphincter?: string;
  no_of_tracks_in_one_fistula?: string;
  any_other?: string;
  no_of_external_opening_position?: string;
  internal_opening_distance?: string;
  no_of_secondary_opening_position?: string;
  type_of_crypt: string;
  crypt_cause: string;
  basis_of_high_low_riding?: string;
  distant_visceral_communication?: string;
  sono_fistula_gram?: string;
  mri_fistula_gram?: string;
  type_of_fistula?: string;
  no_of_fistula?: string;
  posterior_fistulous_angle?: string;
  sonologist?: string;
  sonologist_findings?: string;
  other_investigation?: string;
  pfa?: string;
  external_opening_position: string;
  internal_opening_position_at?: string;
  internal_opening_level?: string;
  fistula_recurrence?: string;
  fistula_recurrence_surgery_count?: string;
  managements?: any[];
  managements_date?: Date;
  fistula_remark?: string;
  amount?: number;
  surgical_cost?: number;
  consultation_amount?: number;
  currency?: string;
  additional_cost?: string;

  // description: string;
  examination_overview?: string;
  medicines?: string;
  finding_fields: string[];

  dosage?: string;
  timing?: string;
  take_with?: string;
  medicine_days?: string;

  combination_dosage?: string;
  combination_timing?: string;
  combination_take_with?: string;
  combination_medicine_days?: string;

  combination_medicines?: {
    id: string;
    combination_ingredients?: {
      id: string;
      combination_medicine: string;
      combination_quantity: string;
      combination_unit: string;
    }[];
    combination_dosage?: string;
    combination_timing?: string;
    combination_take_with?: string;
    combination_medicine_days?: string;
  };

  // Proctology
  doc_upload: File[] | string[] | null;
  advice_field: string;
  consultation_id: number;
  consultation_discount?: number;
  advice_admition?: boolean;
  test_id?: any;
  tests?: any;
  test_in_same_hospital?: boolean;
  //  test_id?: number;
  fees?: number;
  dre?: any[];
  dre_induration_at?: string;
  // dre_secondary_position?: string;
  proctoscopy?: any[];
  proctoscopy_secondary_position?: string;
  proctoscopy_anal_polyp_at?: string;
  //  cost?: number;

  // findings?: string[];

  // Non-Proctology
  yoga_asana?: any[];
  // food_prescription?: string;
  food_advice?: any[];
  yoga_advice?: Array<{
    id: number | string;
    label: string | number;
    value: string | number;
  }>[];
  vikruti?: string;
  prakriti?: string;
  koshta?: string;
  avastha?: string;
  agni?: string;

  breakfast?: string;
  lunch?: string;
  dinner?: string;
  general_advice?: string;
  // yoga_asana?: string;
  post_surgery_details?: string;
  post_surgery_followup?: any[];

  payment_status: paymentStatus;
  status:
    | GenericStatus.PENDING
    | GenericStatus.COMPLETED
    | GenericStatus.REJECTED
    | GenericStatus.CANCELLED
    | GenericStatus.ONGOING
    | GenericStatus.CLOSED
    | GenericStatus.RESCHEDULED;

  existing_documents?: string[];
  new_documents?: File[];

  existing_file_urls?: string | null;
  new_files?: File[];
  Service: string;
}
