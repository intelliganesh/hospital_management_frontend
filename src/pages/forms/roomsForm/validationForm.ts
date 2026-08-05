import * as Yup from "yup";

export const validationForm = Yup.object({
  name: Yup.string().required("Name is required"),
  room_type: Yup.string().required("Type is required"),
  room_number: Yup.string().required("Room Number is required") ,
  ward_id: Yup.string().required("Ward is required"),
  bed_count: Yup.number()
    .required("Bed Count is required")
    .typeError("Bed Count must be a number")
    .integer("Bed Count must be an integer"),
  floor: Yup.string().optional(),
  description: Yup.string().optional(),
  status: Yup.string().required("Status is required"),
});
