import * as Yup from "yup";

export const validationForm = Yup.object({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
  ward_name: Yup.string().required("Ward Name is required"),
  ward_type: Yup.string().required("Ward Type is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .typeError("Capacity must be a number")
    .integer("Capacity must be an integer"),
  location: Yup.string().required("Location is required"),
  floor: Yup.string().required("Floor is required"),
  status: Yup.string().required("Status is required"),
});
