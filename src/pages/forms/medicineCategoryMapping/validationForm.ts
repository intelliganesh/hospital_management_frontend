import * as Yup from "yup";

export const validationForm = Yup.object({
  medicine_id: Yup.string().required("Medicine Name is required"),
  category_id: Yup.string().required("Category Name is required"),
});
