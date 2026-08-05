import * as Yup from "yup";

export const validationForm = Yup.object({
  patient_id: Yup.string().required("Patient is required"),
  appointment_id: Yup.string().required("Patient is required"),
  doctor_id: Yup.string().required("Doctor is required"),
 
});
