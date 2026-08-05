import { FistulaType } from "@/interfaces/fistula";
export const statusOptions = [
  "Active",
  "Inactive",
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const subFistulaOptions = [
  FistulaType.POSITION,
  FistulaType.SPHINCTER,
  FistulaType.CRYPT,
  FistulaType.HIGH_LOW_RIDING
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
