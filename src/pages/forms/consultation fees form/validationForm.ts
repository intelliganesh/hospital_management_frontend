import * as Yup from "yup";

export const validationForm = Yup.object({
  consultation_name: Yup.string().required("Consultation Name is required"),
  amount: Yup.string()
    .required("Consultation Amount is required")
    .test("is-valid-amount", "Amount can only contain numbers", function (value) {
      if (!value) return true;
      return !isNaN(Number(value));
    }),
  status: Yup.string().required("Status is required"),
  // department_type: Yup.string().required("Department Type is required"),
});

