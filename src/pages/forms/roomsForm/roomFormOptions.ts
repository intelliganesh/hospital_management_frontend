import { GenericStatus } from "@/interfaces";
import { RoomLocation } from "@/interfaces/master/rooms";

export const roomTypeOptions = [
  RoomLocation.EAST,
  RoomLocation.WEST,
  RoomLocation.NORTH,
  RoomLocation.SOUTH,
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
