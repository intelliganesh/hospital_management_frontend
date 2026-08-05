import * as Yup from "yup";

export const validationForm = Yup.object({
  name: Yup.string().required("Comorbidity Name is required"),
  // is_chronic: Yup.boolean().required("Chronic Status is required"),
  department_type: Yup.string().required("Department Type is required"),
  is_active: Yup.string().required("Active Status is required"),
});
