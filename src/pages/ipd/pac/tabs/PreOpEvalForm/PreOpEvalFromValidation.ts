import * as Yup from "yup";

export const validationForm = Yup.object({
  ipd_id: Yup.string().required("IPD ID is required"),
  ipd_surgery_id: Yup.string().required("IPD Surgery ID is required"),
  ipd_anaesthesia_id: Yup.string(),
  previous_anaesthesia_surgery: Yup.string(),
  current_medication: Yup.string(),
  allergies: Yup.string(),
  asa_grading: Yup.string().nullable().notRequired(),
  mouth_opening: Yup.string(),
  teeth: Yup.string(),
  neck_movement: Yup.string(),
  mallampati_score: Yup.string(),
  dentures_check: Yup.string().nullable().notRequired(),
  summary: Yup.string(),
  // upload_pdf_path: Yup.(),
  // datetime: Yup.date().required("Datetime is required"),
});
