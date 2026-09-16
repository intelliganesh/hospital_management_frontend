import * as Yup from "yup";

const optionalNumber = Yup.number()
  .transform((value, originalValue) =>
    originalValue === "" || originalValue === null ? undefined : value,
  )
  .typeError("Must be a valid number");

const optionalString = Yup.string().nullable().notRequired();
const optionalBoolean = Yup.boolean().nullable().notRequired();

export const validationForm = Yup.object({
  ipd_id: Yup.string().required("IPD ID is required"),
  ipd_surgery_id: Yup.string().required("IPD Surgery ID is required"),
  ipd_anaesthesia_id: Yup.string().required("IPD Anaesthesia ID is required"),
  pre_anaesthesia_state: optionalString,
  ventilated_patient: optionalString,
  npo_status: optionalString,
  patient_safety: optionalString,
  pre_oxygenation: optionalString,
  induction: optionalString,
  laryngoscopy: optionalString,
  difficult_intubation: optionalBoolean,
  mask_anaesthesia: optionalString,
  throat_pack: optionalString,
  nasogastric_tube: optionalString,
  maintenance: optionalString,
  iv_access: optionalString,
  central_blocks_spinal: optionalString,
  central_blocks_spinal_needle_g: optionalString,
  central_blocks_epidural: optionalString,
  central_blocks_epidural_g: optionalString,
  regional_blocks: optionalString,
  nerve_stimulator: optionalString,
  drugs_regional: optionalString,
  regional_supplements: optionalString,
  endotracheal_tube: optionalString,
  endotracheal_tube_size: optionalString,
  endotracheal_tube_fixed_at: optionalString,
  airway: optionalString,
  airway_size: optionalString,
  monitoring: optionalString,
  temperature: optionalString,
  crystalloids_ml: optionalNumber,
  colloids_ml: optionalNumber,
  blood_ml: optionalNumber,
  anaesthesia_technique_brief: optionalString,
  abp_details: optionalString,
  cvp_details: optionalString,
  summary: optionalString,
  // upload_pdf_path: Yup.(),
  // datetime: Yup.date().required("Datetime is required"),
});
