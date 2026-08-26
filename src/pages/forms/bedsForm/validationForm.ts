import * as Yup from "yup";

export const validationForm = Yup.object({
  bed_number: Yup.string()
    .required("Bed No is required"),

  bed_type: Yup.string()
    .required("Bed Type is required"),

  // size: Yup.string()
  //   .required("Bed Size is required"), // you can customize

  room_id: Yup.string()
    .optional(),

  status: Yup.string()
    .required("Status is required"),
});
