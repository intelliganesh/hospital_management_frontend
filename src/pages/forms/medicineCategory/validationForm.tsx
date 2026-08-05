import * as Yup from "yup";

export const validationForm = Yup.object({
  category_name: Yup.string().required("Category Name is required"),
});
