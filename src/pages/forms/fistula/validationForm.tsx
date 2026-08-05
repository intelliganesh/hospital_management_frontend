import * as Yup from "yup";
export const validationForm = Yup.object({
  fistula_name: Yup.string().required("Fistula Name is required"),
  sub_fistula_name: Yup.string().required("Sub Fistula Name is required"),
  description: Yup.string().nullable(),
  department_type: Yup.string().required("Department Type is required"),
  is_active: Yup.string().required("Status is required"),
});
