
export interface RoomData {
    id: string | number;
    name: string;
    // Add other room properties as needed
    description?: string;
    capacity?: number;
    status?: string;
    floor?: string | number;
    // Add any other relevant room fields
  }
  
  export interface RoomState {
    rooms: RoomData[];
    currentRoom: RoomData | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface RoomPayload {
    success: boolean;
    result?: RoomData | RoomData[] | null;
    error?: string;
    api_key?: {
      original: {
        token: string;
        expires_in: number;
      }
    }
  }