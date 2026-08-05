import * as Yup from "yup";
export const validationForm = Yup.object({
  amount_for: Yup.string().required("Amount Type Name is required").test(
    "is-valid-name",
    "Amount Type Name should contain only letters and numbers",
    function (value) {
      if (!value) return true;
      return /^[A-Za-z0-9\s]+$/.test(value);
    }
  ),
  status: Yup.string().required("Status is required"),
  description: Yup.string()
});
