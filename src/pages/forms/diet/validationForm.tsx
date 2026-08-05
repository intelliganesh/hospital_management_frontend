import * as Yup from "yup";
export const validationForm = Yup.object({
  diet_name: Yup.string().required("Diet Name is required"),
  calories: Yup.string().nullable().test(
    "is-valid-calories",
    "Calories can only contain numbers",
    function (value) {
      if (!value) return true;
      return !isNaN(Number(value));
    }
  ),
  is_active: Yup.string().required("Status is required"),
  description: Yup.string(),
  department_type: Yup.string().required("Department Type is required"),
});
