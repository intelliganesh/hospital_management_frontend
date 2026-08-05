import * as Yup from "yup";

export const validationForm = Yup.object({
  amount: Yup.number().required("Amount is required"),
  amount_for: Yup.string().required("Amount for is required"),
});
