import { GenericStatus } from "@/interfaces";
import { BedType } from "@/interfaces/beds";

export const bedTypeOptions = Object.values(BedType).map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

// export const bedSizeOptions = Object.values(Size).map((value) => ({
//   value,
//   label: value.replace(/_/g, " ")?.charAt(0)?.toUpperCase() + value?.slice(1),
// }));

export const bedStatusOptions = Object.values([
  GenericStatus.ROOM_AVAILABLE,
  GenericStatus.ROOM_OCCUPIED,
  GenericStatus.RESERVED,
  GenericStatus.UNDER_CLEANING,
]).map((value) => {
  return {
    value,
    label: value.replace(/_/g, " "),
  };
});
