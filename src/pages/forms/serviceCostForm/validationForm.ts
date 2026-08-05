import * as Yup from "yup";

export const validationForm = Yup.object({
  service_name: Yup.string().required("Service Name is required"),
  cost: Yup.string()
    .required("Service Amount is required")
    .test(
      "is-valid-amount",
      "Amount can only contain numbers",
      function (value) {
        if (!value) return true;
        return !isNaN(Number(value));
      }
    ),
  description: Yup.string().nullable(),
  status: Yup.string().required("Status is required"),
  // department_type: Yup.string().required("Department Type is required"),
  case_type: Yup.string().required("Case Type is required"),
});
