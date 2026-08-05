import * as Yup from "yup";

export const validationForm = Yup.object({
  type: Yup.string().required("Type is required"),
  patient_id: Yup.string().required("Patient is required"),
  doctor_id: Yup.string().required("Doctor is required"),
  // complaint: Yup.string().required("Complaint is required"),
  // appointment_date: Yup.string().required("Appointment Date is required"),
  // appointment_time: Yup.string().required("Appointment Time is required"),
  // enroll_fees: Yup.string().required("Enroll Fees is required"),
  // status: Yup.string().required("Status is required"),
});
