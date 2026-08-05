import * as Yup from "yup";

export const validationForm = Yup.object({
  patient_id: Yup.string().required("Patient is required"),
  appointment_id: Yup.string().required("Appointment Id is required"),
  status: Yup.string().required("Status is required"),  
  visit_date: Yup.string().required("Visit Date is required"),
  complaint: Yup.string().required("Complaint is required"),
  referred_to_doctor_id: Yup.string().required(
    "Reffered to doctor Id number is required"
  ),
  // converted_to_ipd_id: Yup.string().required("Converted to Idp Id is required"),
});
