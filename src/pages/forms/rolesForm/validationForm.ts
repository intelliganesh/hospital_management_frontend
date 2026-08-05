import * as Yup from "yup";

export const validationForm = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Role name can only contain letters and spaces")
    .required("Role name is required"),
  description: Yup.string()
    .max(255, "Descripton must be at most 255 characters"),
    // .required("Description is required"),
  status: Yup.string().required("Status is required"),
});

