import * as yup from "yup";

export const validationForm = yup.object({
  diagnosis_name: yup.string().required("Diagnosis Name is required"),
  is_active: yup.string().required("Active Status is required"),
  department_type: yup.string().required("Department Type is required"),
});
