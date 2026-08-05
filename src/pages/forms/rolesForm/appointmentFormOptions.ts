import { GenericStatus } from "@/interfaces";

export const statusOptions = [
  GenericStatus.PENDING,
  GenericStatus.COMPLETED,
  GenericStatus.CANCELLED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const appointmentTypeOptions = [
  GenericStatus.FIRST_VISIT,
  GenericStatus.FOLLOW_UP,
  GenericStatus.POST_FOLLOW_UP,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
