import * as Yup from "yup";

export const validationForm = Yup.object({
  complaint_name: Yup.string().required("Chief Complaint is required"),
  // description: Yup.string().required("Description is required"),
  is_active: Yup.string().required("Status is required"),
  department_type: Yup.string().required("Department Type is required"),
});
