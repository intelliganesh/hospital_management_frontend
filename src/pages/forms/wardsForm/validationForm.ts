import * as Yup from "yup";

export const validationForm = Yup.object({
  name: Yup.string().required("Ward name is required"),
  ward_number: Yup.string().required("Ward number is required"),
  type: Yup.string().required("Ward type is required"),
  floor: Yup.string().required("Floor is required"),
  status: Yup.string().required("Status is required"),
  description: Yup.string().nullable(),
});
