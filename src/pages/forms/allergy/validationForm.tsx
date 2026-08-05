import * as Yup from "yup";
export const validationForm = Yup.object({
  allergen_name: Yup.string().required("Allergy Name is required"),
  department_type: Yup.string().required("Department Type is required"),
  // allergen_type: Yup.string().required("Allergy Type is required"),
  // reaction_type: Yup.string().required("Reaction Type is required"),
  // severity: Yup.string().required("Severity is required"),
  // date_first_experienced: Yup.date().required(
  //   "Date First Experienced is required"
  // ),
  // management: Yup.string().required("Management is required"),
  // documented_by: Yup.string().required("Documented By is required"),
  notes: Yup.string().required("Notes is required"),
});
