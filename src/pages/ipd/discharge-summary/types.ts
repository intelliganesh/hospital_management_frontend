export interface DischargeSummaryIpdDetails {
  ipd_number?: string;
  patient_name?: string;
  patient_number?: string;
  patient_age?: string | number;
  patient_phone?: string;
  patient_attendant_name?: string;
  patient_attendant_phone?: string;
  doctor_name?: string;
  ward_number?: string;
  ward_type?: string;
  room_number?: string;
  room_type?: string;
  bed_number?: string;
  admission_date_time?: string;
  status?: string;
  patient_address?: string;
}

export interface DischargeSummaryForm {
  id?: string;
  ipd?: DischargeSummaryIpdDetails;
  discharge_date?: string;
  discharge_time?: string;
  doctor_incharge?: string;
  consultants?: string;
  diagnosis?: string;
  case_history_and_complaints?: string;
  general_examination?: string;
  systemic_examination?: string;
  investigations?: string;
  operation_done?: string;
  findings_and_procedure?: string;
  course_in_hospital?: string;
  patient_health_condition_at_discharge?: string;
  special_instruction?: string;
  advice_on_discharge?: string;
}
