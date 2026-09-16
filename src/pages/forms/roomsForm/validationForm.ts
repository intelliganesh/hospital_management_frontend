import * as Yup from "yup";

export const validationForm = Yup.object({
  name: Yup.string().required("Name is required"),
  room_type: Yup.string().required("Room Type is required"),
  floor: Yup.string().required("Floor is required"),
  status: Yup.string().required("Status is required"),
  ward_id: Yup.number()
    .required("Ward is required")
    .typeError("Ward is required"),
  room_number: Yup.string().required("Room Number is required"),
  bed_count: Yup.number()
    .required("Bed Count is required")
    .typeError("Bed Count must be a number")
    .integer("Bed Count must be an integer")
    .min(1, "Bed Count must be at least 1"),
  description: Yup.string().nullable(),
});
