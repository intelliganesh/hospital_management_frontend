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

// Unique international calling codes used by countries and territories.
// Countries that share a calling code (for example, the NANP countries using
// +1) intentionally appear once because this selector stores only the code.
const countryCallingCodes = [
  "+1", "+7", "+20", "+27", "+30", "+31", "+32", "+33", "+34", "+36",
  "+39", "+40", "+41", "+43", "+44", "+45", "+46", "+47", "+48", "+49",
  "+51", "+52", "+53", "+54", "+55", "+56", "+57", "+58", "+60", "+61",
  "+62", "+63", "+64", "+65", "+66", "+81", "+82", "+84", "+86", "+90",
  "+91", "+92", "+93", "+94", "+95", "+98", "+211", "+212", "+213", "+216",
  "+218", "+220", "+221", "+222", "+223", "+224", "+225", "+226", "+227", "+228",
  "+229", "+230", "+231", "+232", "+233", "+234", "+235", "+236", "+237", "+238",
  "+239", "+240", "+241", "+242", "+243", "+244", "+245", "+246", "+247", "+248",
  "+249", "+250", "+251", "+252", "+253", "+254", "+255", "+256", "+257", "+258",
  "+260", "+261", "+262", "+263", "+264", "+265", "+266", "+267", "+268", "+269",
  "+290", "+291", "+297", "+298", "+299", "+350", "+351", "+352", "+353", "+354",
  "+355", "+356", "+357", "+358", "+359", "+370", "+371", "+372", "+373", "+374",
  "+375", "+376", "+377", "+378", "+380", "+381", "+382", "+383", "+385", "+386",
  "+387", "+389", "+420", "+421", "+423", "+500", "+501", "+502", "+503", "+504",
  "+505", "+506", "+507", "+508", "+509", "+590", "+591", "+592", "+593", "+594",
  "+595", "+596", "+597", "+598", "+599", "+670", "+672", "+673", "+674", "+675",
  "+676", "+677", "+678", "+679", "+680", "+681", "+682", "+683", "+685", "+686",
  "+687", "+688", "+689", "+690", "+691", "+692", "+850", "+852", "+853", "+855",
  "+856", "+880", "+886", "+960", "+961", "+962", "+963", "+964", "+965", "+966",
  "+967", "+968", "+970", "+971", "+972", "+973", "+974", "+975", "+976", "+977",
  "+992", "+993", "+994", "+995", "+996", "+998",
] as const;

export const countryCodeOptions = countryCallingCodes.map((code) => ({
  label: code,
  value: code,
  selected: code === "+91",
}));
