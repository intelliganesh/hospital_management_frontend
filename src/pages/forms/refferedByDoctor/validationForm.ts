import * as Yup from "yup";

export const validationForm = Yup.object({
  name: Yup.string().required("Name is required"),
  is_active: Yup.string().required("Status is required"),
});
