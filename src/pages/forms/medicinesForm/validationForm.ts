import * as Yup from "yup";

export const validationForm = Yup.object({
medicine_name: Yup.string()
    .required("Medicine name is required"),

  generic_name: Yup.string(),

  manufacturer: Yup.string()
   ,

  is_active: Yup.boolean()
    .required("Status is required"),

  dosage_form: Yup.string()
,

 strength: Yup.string()
  .test("is-valid-strength", "Strength must be a number", (value) => {
    if (!value) return true; // allow empty strings
    return /^[0-9]+$/.test(value);
  }),

  stock_quantity: Yup.number()
    .typeError("Stock quantity must be a number")
    .min(0, "Cannot be negative")
    ,

  unit_price: Yup.number()
    .typeError("Unit price must be a number")
    .min(0, "Cannot be negative")
    ,

  expiry_date: Yup.date()
    .typeError("Invalid date format")
    .min(new Date(), "Expiry date must be in the future")
    ,

  // department_type: Yup.string()
  //   .required("Department Type is required"),
 
});
