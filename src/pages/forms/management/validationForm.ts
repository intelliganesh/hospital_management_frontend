import * as Yup from "yup";

export const validationForm = Yup.object({
  management_name: Yup.string().required("Management Name is required"),
  is_active: Yup.string().required("Status is required"),
  department_type: Yup.string().required("Department Type is required"),
});
