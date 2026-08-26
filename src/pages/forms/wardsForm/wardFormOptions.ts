import { GenericStatus } from "@/interfaces";
import { WardType } from "@/interfaces/wards";

export const wardTypeOptions = [
  WardType.GENERAL,
  WardType.ICU,
  WardType.EMERGENCY,
  WardType.NEUROLOGY,
  WardType.SURGICAL,
  WardType.PEDIATRIC,
  WardType.MATERNITY,
  WardType.PSYCHIATRIC,
  WardType.ONCOLOGY,
  WardType.OBSERVATION,
  WardType.CARDIOLOGY,
  WardType.ORTHOPEDIC,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const wardStatusOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
  GenericStatus.UNDER_MAINTAINANCE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

// export const wardLocationOptions = [
//   Location.NORTH,
//   Location.SOUTH,
//   Location.EAST,
//   Location.WEST,
// ].map((value) => ({
//   value,
//   label: value.replace(/_/g, " "),
// }));
