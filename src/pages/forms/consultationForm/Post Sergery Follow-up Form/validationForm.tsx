import * as Yup from "yup";
export const validationForm = Yup.object({
  name: Yup.string().required("Name is required"),
  age: Yup.string().required("Age is required"),
  date: Yup.string().required("Date is required"),
});
