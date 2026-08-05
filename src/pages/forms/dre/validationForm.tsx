import * as Yup from "yup";
export const validationForm = Yup.object({
  dre_name: Yup.string().required("DRE Name is required"),
  department_type: Yup.string().required("Department Type is required"),
});
