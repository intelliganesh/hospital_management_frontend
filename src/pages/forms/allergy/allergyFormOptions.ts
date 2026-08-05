import { AllergenType, SeverityLevel } from "@/interfaces/allergies";

export const AllergyTypeOptions = Object.values(AllergenType).map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const SeverityOptions = [
  SeverityLevel.Mild,
  SeverityLevel.Moderate,
  SeverityLevel.Severe,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
