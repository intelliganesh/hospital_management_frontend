import { GenericStatus } from "@/interfaces";
import { RoomTypes } from "@/interfaces/master/rooms";

export const roomTypeOptions = [
  RoomTypes.GENERAL,
  RoomTypes.ICU,
  RoomTypes.PRIVATE,
  RoomTypes.SEMI_PRIVATE,
  RoomTypes.DELUXE,
  RoomTypes.SUITE,
  RoomTypes.NICU,
  RoomTypes.ISOLATION,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const roomStatusOptions = [
  GenericStatus.ROOM_AVAILABLE,
  GenericStatus.ROOM_OCCUPIED,
  GenericStatus.ROOM_MAINTAINANCE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
