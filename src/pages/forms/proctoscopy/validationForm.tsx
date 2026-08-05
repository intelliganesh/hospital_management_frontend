import * as Yup from "yup";
export const validationForm = Yup.object({
  proctoscopys_name: Yup.string().required("Proctoscopy Name is required"),
  department_type: Yup.string().required("Department Type is required"),
});
