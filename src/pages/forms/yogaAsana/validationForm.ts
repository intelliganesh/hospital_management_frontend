import * as Yup from "yup";

export const validationForm = Yup.object({
  asana_name: Yup.string().required("Asana name is required"),
  // description: Yup.string().required("Asana Description is required"),
  // benefits: Yup.string().required("Asana Benefits is required"),
  // contraindications: Yup.string().required(
  //   "Asana contraindications is required"
  // ),
  // recommended_duration: Yup.string().required(
  //   "Recommended Duration is required"
  // ),
  difficulty_level: Yup.string().required("Difficulty level is required"),
  status: Yup.string().required("Status is required"),
});
