export interface PreOperativeChecklistData {
  ipd_id: string;
  ipd_surgery_id: string;
  q01_investigations: string;
  q02_chest_xray_ecg: string;
  q03_minor_age_parents: string;
  q04a_blood_thinners: string;
  q04b_blood_thinners_details: string;
  q05a_asthma: string;
  q05b_asthma_treatment: string;
  q06_medication_allergy: string;
  q07_tooth_extraction: string;
  q08_surgical_procedure: string;
  q09a_diabetic: string;
  q09b_blood_sugar: string;
  q10_thyroid_medication: string;
  q11a_hypertension: string;
  q11b_hypertension_medicine: string;
  q11c_hypertension_medication_taken: string;
  q12_informed_consent: string;
  q13_anesthesia_awareness: string;
  q14_operative_procedure_awareness: string;
  q15a_male_patient_age: string;
  q15b_urinary_symptoms: string;
  q16_urinary_obstruction: string;
  q17_lithotomy_position: string;
  q18_previous_surgery: string;
  q19_community: string;
  q20_previous_surgery_events: string;
  q21_female_pregnant: string;
  q22_epilepsy: string;
  q23_antipsychotic: string;
  q24_last_food_intake: string;
  summary: string;
  datetime: string;
  id?: string;
  upload_pdf_path?: File[] | string[] | null | string;
}

// export interface PreOperativeChecklist {
//   preOperativeChecklistDetailData: PreOperativeChecklistData | null;
//   preOperativeChecklistList: PreOperativeChecklistData[];
// }
