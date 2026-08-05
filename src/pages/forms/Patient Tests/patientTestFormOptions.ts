import { GenericStatus } from "@/interfaces";

export const resultStatusOptions = [
  GenericStatus.PENDING,
  GenericStatus.STARTED,
    GenericStatus.COMPLETED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));


