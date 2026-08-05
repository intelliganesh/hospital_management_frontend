import {
  BloodGroups,
  Gender,
  GenericStatus,
  MaratalStatus,
} from "@/interfaces";
import { Footype } from "@/interfaces/patients";

export const admissionStatusOptions = [
  GenericStatus.ADMISSION_PENDING,
  GenericStatus.ADMITTED,
  GenericStatus.DISCHARGE_PENDING,
  GenericStatus.DISCHARGED,
  GenericStatus.CLOSED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const treatmentStatusOptions = [
  GenericStatus.UNDER_DIAGNOSIS,
  GenericStatus.TEST_PENDING,
  GenericStatus.TEST_COMPLETED,
  GenericStatus.PRESCRIBED,
  GenericStatus.IN_TREATMENT,
  GenericStatus.UNDER_OBSERVATION,
  GenericStatus.FOLLOW_UP_REQUIRED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const emergencyStatusOptions = [
  GenericStatus.EMERGENCY,
  GenericStatus.CRITICAL,
  GenericStatus.STABLE,
  GenericStatus.DECEASED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const surgeryStatusOptions = [
  GenericStatus.SURGERY_SCHEDULED,
  GenericStatus.SURGERY_IN_PROGRESS,
  GenericStatus.SURGERY_COMPLETED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const referralStatusOptions = [
  GenericStatus.NOT_REFERRED,
  GenericStatus.REFERRED,
  GenericStatus.TRANSFERRED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const paymentStatusOptions = [
  GenericStatus.PAYMENT_PENDING,
  GenericStatus.PAYMENT_COMPLETED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const administrativeStatusOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
  GenericStatus.PENDING,
  GenericStatus.CANCELLED,
  GenericStatus.APPROVED,
  GenericStatus.COMPLETED,
  GenericStatus.DRAFT,
  GenericStatus.RESOLVED,
  GenericStatus.UNRESOLVED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
export const genderOptions = Object.values(Gender).map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export const maritalStatusOptions = Object.values(MaratalStatus).map(
  (value) => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase(),
  })
);

export const bloodGroupOptions = Object.values(BloodGroups).map((value) => ({
  value,
  label: value,
}));

export const foodTypeOptions = Object.values(Footype).map((value) => ({
  value,
  label: value,
}));

export const countryCodeOptions = [
  { label: "+91", value: "+91", selected: true },
  { label: "+1", value: "+1" },
  { label: "+44", value: "+44" }, // EU/UK
  { label: "+44", value: "+44" },
  { label: "+81", value: "+81" },
  { label: "+7", value: "+7" },
  { label: "+82", value: "+82" },
  { label: "+234", value: "+234" },
  { label: "+972", value: "+972" },
  { label: "+84", value: "+84" },
  { label: "+66", value: "+66" },
  { label: "+380", value: "+380" },
  { label: "+48", value: "+48" },
  { label: "+57", value: "+57" },
  { label: "+90", value: "+90" },
  { label: "+54", value: "+54" },
  { label: "+7", value: "+7" }, // Kazakhstan shares with Russia
  { label: "+855", value: "+855" },
  { label: "+92", value: "+92" },
].map((value) => ({
  value,
  label: value.label,
}));
