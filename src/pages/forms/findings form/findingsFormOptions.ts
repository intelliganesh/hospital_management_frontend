import { GenericStatus } from "@/interfaces";
import { Category } from "@/interfaces/findings";

export const categoryOptions = [
  Category.ENT,
  Category.cVitals,
  Category.Other,
  Category.Dental,
  Category.Clinical,
  Category.ECG_EKG,
  Category.Radiology,
  Category.Pathology,
  Category.Endoscopy,
  Category.Laboratory,
  Category.Ultrasound,
  Category.Neurological,
  Category.Ophthalmology,
  Category.Dermatological,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const statusOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
