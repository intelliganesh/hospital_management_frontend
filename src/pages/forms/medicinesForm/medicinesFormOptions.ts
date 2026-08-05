import { DosageForm, StrengthUnit } from "@/interfaces/medicines";

export const dosageFormOptions = Object.values(DosageForm).map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
export const strengthUnitOptions = Object.values(StrengthUnit).map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}))

