import * as Yup from "yup";

export const validationForm = Yup.object({
  name: Yup.string()
    .required("Finding name is required")
});

