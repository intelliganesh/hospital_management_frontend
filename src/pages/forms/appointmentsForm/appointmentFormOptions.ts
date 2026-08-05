import { AmountFor, GenericStatus, PaymentType } from "@/interfaces";

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
  GenericStatus.FIRST_VISIT,
  GenericStatus.FOLLOW_UP,
  GenericStatus.POST_FOLLOW_UP,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const paymentTypeOptions = [
  PaymentType.UPI,
  PaymentType.EMI,
  PaymentType.Card,
  PaymentType.CASH,
  PaymentType.ONLINE,
  PaymentType.CHEQUE,
  PaymentType.WALLET,
  PaymentType["By Insurance"],
  PaymentType["Bank Transfer"],
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const amountOptions = [
  AmountFor.Test,
  AmountFor.Surgery,
  AmountFor.Medicine,
  AmountFor.RoomRent,
  AmountFor.Ambulance,
  AmountFor.LabCharges,
  AmountFor.ICUCharges,
  AmountFor.Enrollment,
  AmountFor.Appointment,
  AmountFor.Consultation,
  AmountFor.AdmissionFee,
  AmountFor.DischargeFee,
  AmountFor.NursingCharges,
  AmountFor.OperationTheatre,
  AmountFor.EquipmentCharges,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const paymentStatusOptions = [
  GenericStatus.PENDING,
  GenericStatus.COMPLETED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
