import * as yup from "yup";

export const validationForm = yup.object({
  finding: yup.string().required("Findings is required"),
  is_active: yup.string().required("Status is required"),
  department_type: yup.string().required("Department Type is required"),
});
