export interface PreliminaryNotes {
  patient_name: string;
  patient_age: number | string;
  gender: string;

  patient_address: string;
  profession?: string;

  patient_phone: string;
  patient_email?: string;
  identification_no?: string;

  discharge_date_time?: string;
  admission_date_time?: string;
  dod_date?: string;
  dod_time?: string;

  patient_attendant_name?: string;
  attendant_relation?: string;
  patient_attendant_phone?: string;

  chief_complaint: string;
  //   duration?: string; //confirm
  associated_complaint?: string;
  previous_treatment_history?: string;

  medical_history?: string; //associated med illness & current medi/treatment

  family_history?: string;
  personal_history?: string;
  allergy?: string;

  bp?: string;
  pulse?: string;
  temperature?: string;

  weight?: string;
  height?: string;
  spo2?: string;

  cvs?: string;
  rs?: string;
  per_abdomen?: string;

  pr?: string;
  dre?: string;
  proctoscopy?: string;

  blood_urea?: string;
  esr?: string;
  hiv?: string;
  hbsag?: string;

  hb?: string;
  tc?: string;
  rbs?: string;
  bt?: string;
  ct?: string;
  hcv?: string;

  provisional_diagnosis?: string;
  final_diagnosis?: string;
  line_of_treatment?: string;
  treatment_given?: string;
  treatment_advised?: string;
  preoperative_instruction?: string;
}
