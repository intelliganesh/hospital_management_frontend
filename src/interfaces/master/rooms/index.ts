import { GenericStatus } from "@/interfaces";


export type RoomStatus =
  | GenericStatus.ROOM_AVAILABLE
  | GenericStatus.ROOM_OCCUPIED
  | GenericStatus.ROOM_MAINTAINANCE;

export enum RoomLocation {
  EAST = "East Wing",
  WEST = "West Wing",
  NORTH = "North Wing",
  SOUTH = "South Wing",
}

export type Location =
  | RoomLocation.EAST
  | RoomLocation.WEST
  | RoomLocation.NORTH
  | RoomLocation.SOUTH;

export enum RoomTypes {
  GENERAL = "General",
  ICU = "ICU",
  PRIVATE = "Private",
  SEMI_PRIVATE = "Semi Private",
  DELUXE = "Deluxe",
  SUITE = "Suite",
  NICU = "NICU",
  ISOLATION = "Isolation",
}

export interface Rooms {
  name: string;
  room_type: RoomTypes;
  ward_id: number | string;
  room_number: string;
  bed_count: number;
  description: string;
  status: RoomStatus;
  floor: string;
}
