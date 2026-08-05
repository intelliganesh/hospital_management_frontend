import * as Yup from "yup";

export const validationForm = Yup.object({
    test_name: Yup.string().required("Test Name is required"),
    test_description: Yup.string().required("Test Description is required"),
})