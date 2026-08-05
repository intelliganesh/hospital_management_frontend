import { GenericStatus } from "@/interfaces";
import { AppointmentTypeProps } from "@/interfaces/consultation/index";

export const paymentStatusOptions = [
  GenericStatus.PENDING,
  GenericStatus.COMPLETED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const statusOptions = [
  GenericStatus.PENDING,
  GenericStatus.COMPLETED,
  GenericStatus.REJECTED,
  GenericStatus.CANCELLED,
  GenericStatus.ONGOING,
  GenericStatus.CLOSED,
  GenericStatus.RESCHEDULED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const appointmentTypeOptions = [
  AppointmentTypeProps["First Visit"],
  AppointmentTypeProps["Follow-up"],
  GenericStatus.POST_FOLLOW_UP,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

// export const findingOptions = findingDropdownData?.map((value) => ({
//   value,
//   label: value.replace(/_/g, " "),
// }));

export const previousScarOptions = [
  GenericStatus.YES,
  GenericStatus.NO,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const abscessOptions = [
  GenericStatus.YES,
  GenericStatus.NO,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const fistulaPositionTypes = [
  "Anterior midline",
"Posterior midline",
"Left lateral",
"Right lateral",
"Right anterolateral",
"Left anterolateral",
"Right posterolateral",
"Left posterolateral"
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const fistulaSphincterTypes = [
  "Suprasphinteric",
"Intersphincteric",
"Transphincteric",
"Extrasphincteric",
"subcutaneous",
"submucous"
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
