import { GenericStatus } from "@/interfaces";

export const statusOptions = [
  GenericStatus.PENDING,
  GenericStatus.COMPLETED,
  GenericStatus.CONVERTED_TO_IPD,
  GenericStatus.CANCELLED,
  // GenericStatus.ACTIVE,
  // GenericStatus.DISCHARGED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
