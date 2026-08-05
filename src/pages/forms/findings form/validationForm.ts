import * as Yup from "yup";

export const validationForm = Yup.object({
  finding_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Finding name can only contain letters and spaces")
    .required("Finding name is required"),
  finding_description: Yup.string()
    .max(255, "Descripton must be at most 255 characters"),
  category: Yup.string().required("Category is required"),
  status: Yup.string().required("Status is required"),

});

