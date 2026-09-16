import * as Yup from "yup";

const optionalString = Yup.string().nullable().notRequired();

export const validationForm = Yup.object({
  ipd_id: Yup.string().required("IPD ID is required"),
  ipd_surgery_id: Yup.string().required("IPD Surgery ID is required"),
  ipd_anaesthesia_id: optionalString,
  surgical_procedure: optionalString,
  time_patient_received: optionalString,
  monitors: optionalString,
  post_operative_complications: optionalString,
  post_operative_medications: optionalString,
  patient_score_on_admission: optionalString,
  patient_score_before_transfer: optionalString,
  vital_monitoring: optionalString,
  transfer_to: optionalString,
  time_of_transfer: optionalString,
  pulse_at_shifting: optionalString,
  sbp_at_shifting: optionalString,
  dbp_at_shifting: optionalString,
  rr_at_shifting: optionalString,
  post_operative_instructions: optionalString,
  summary: optionalString,
});
