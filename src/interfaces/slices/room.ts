import { ReactNode } from "react";
import { RoomStatus } from "../master/rooms";

// @/interfaces/slices/room.ts
export interface Room {
    status: RoomStatus;
    ward_type: ReactNode;
    ward_name: ReactNode;
    type: ReactNode;
    capacity: ReactNode;
    floor: ReactNode;
    location: any;
    id: string;
    name: string;
    // Add other room properties here
  }
  
  export interface RoomState {
    rooms: Room[]|any;
    currentRoom: Room | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface RoomPayload {
    result?: Room | Room[] | null;
    success: boolean;
    error?: string;
  }