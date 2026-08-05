import * as Yup from "yup";

export const validationForm = Yup.object({
    advice_text: Yup.string().required("Food Advice is required"),
    meal_times: Yup.string().required("Meal Time is required"),
    status: Yup.string().required("Status is required"),
    department_type: Yup.string().required("Department Type is required"),
});