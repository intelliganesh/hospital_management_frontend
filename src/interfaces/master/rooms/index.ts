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

export interface Rooms {
  name: string;
  type: string;
  ward_name: string;
  ward_type: string;
  capacity: number; //default 1
  location: Location;
  status: RoomStatus;
  floor: string;
}
