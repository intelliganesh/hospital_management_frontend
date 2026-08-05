import * as Yup from "yup";

export const validationForm = Yup.object({
    test_name: Yup.string().required("Test Name is required"),
    // department_type: Yup.string().required("Department Type is required"),
    test_description: Yup.string(),
})