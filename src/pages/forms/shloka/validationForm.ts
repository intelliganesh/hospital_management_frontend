import * as Yup from "yup";

export const validationForm = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  verse_text: Yup.string().trim().required("Shloka text is required"),
  status: Yup.string().required("Status is required"),
});
