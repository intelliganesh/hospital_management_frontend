// src/pages/forms/consultationForm/validationForm.ts
import * as Yup from "yup";

// Create the validation schema for the consultation form
const validationForm = Yup.object({
  consultation_amount: Yup.string().required("Consultation amount is required"),
  advice_admition: Yup.boolean().nullable(),
  patient_id: Yup.string().required(
    "Patient record is missing. Please re-select the patient.",
  ),
  advice_admition_date: Yup.date().when(
    "advice_admition",
    (advice_admition: any, schema) => {
      if (advice_admition === true) {
        return schema.required("Advice Admission Date is required");
      } else {
        return schema.nullable();
      }
    },
  ),
  fistula_recurrence: Yup.string(),
  fistula_recurrence_surgery_count: Yup.string().when(
    "fistula_recurrence",
    (fistula_recurrence: any, schema) => {
      if (fistula_recurrence[0] === "recurrence") {
        return schema.required("Fistula Recurrence Surgery Count is required");
      } else {
        return schema.nullable();
      }
    },
  ),

  //     type: Yup.string().required("Consultation Type is required"),
  //  appointment_type: Yup.string().required("Appointment Type is required"),
  //  patient_id: Yup.string().required("Patient is required"),
  //  appointment_id: Yup.string().required("Appointment is required"),
  //  doctor_id: Yup.string().required("Doctor is required"),
  //  reffered_by_name: Yup.string().nullable(),

  //  // medical history
  //  chief_complaints: Yup.array().of(
  //     Yup.object().shape({
  //       id: Yup.string().required(),
  //       label: Yup.string().required(),
  //       value: Yup.string().required(),
  //     })
  //   ).nullable(),
  //   surgical_history: Yup.array().of(
  //     Yup.object().shape({
  //       id: Yup.string().required(),
  //       label: Yup.string().required(),
  //       value: Yup.string().required(),
  //     })
  //   ).nullable(),
  //   co_morbidities: Yup.array().of(
  //     Yup.object().shape({
  //       id: Yup.string().required(),
  //       label: Yup.string().required(),
  //       value: Yup.string().required(),
  //     })
  //   ).nullable(),
  //   on_examination: Yup.array().of(
  //     Yup.object().shape({
  //       id: Yup.string().required(),
  //       label: Yup.string().required(),
  //       value: Yup.string().required(),
  //     })
  //   ).nullable(),
  //   diet_plan: Yup.array().of(
  //     Yup.object().shape({
  //       id: Yup.string().required(),
  //       label: Yup.string().required(),
  //       value: Yup.string().required(),
  //     })
  //   ).nullable(),
  //   preliminary_diagnosis: Yup.array().of(
  //     Yup.object().shape({
  //       id: Yup.string().required(),
  //       label: Yup.string().required(),
  //       value: Yup.string().required(),
  //     })
  //   ).nullable(),
  //   treatment_plan: Yup.string().nullable(),
  //   medicines: Yup.string().nullable(),
  //   dosage: Yup.string().nullable(),
  //   timing: Yup.string().nullable(),
  //   take_with: Yup.string().nullable(),

  //  next_visit_date: Yup.date().nullable()
});

export default validationForm;
