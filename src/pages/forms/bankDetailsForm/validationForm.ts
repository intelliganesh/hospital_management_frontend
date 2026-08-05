import * as Yup from "yup";

export const validationForm = Yup.object({
  title: Yup.string()
    .required("Bank name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  details: Yup.string()
    .required("Account details are required")
    .min(5, "Account details must be at least 5 characters"),
  is_active: Yup.number()
    .oneOf([0, 1], "Active status must be Yes or No")
    .required("Active status is required")
    .typeError("Active status must be Yes or No"),
});
