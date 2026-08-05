import { GenericStatus } from "@/interfaces";
import { RoomLocation } from "@/interfaces/master/rooms";
import { RoomTypes } from "@/interfaces/rooms";

export const roomLocatioinOptions = [
  RoomLocation.EAST,
  RoomLocation.WEST,
  RoomLocation.NORTH,
  RoomLocation.SOUTH,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

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
  GenericStatus.UNDER_MAINTAINANCE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
