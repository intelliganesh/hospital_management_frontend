// @/slices/room.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, RoomState } from "@/interfaces/slices/room";

const initialState: RoomState = {
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    fetchRoomsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRoomsSuccess: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
      state.loading = false;
    },
    fetchRoomsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchRoomByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRoomByIdSuccess: (state, action: PayloadAction<Room>) => {      
      state.currentRoom = action.payload;
      state.loading = false;
    },
    clearRoomByIdSuccess: (state) => {      
      state.currentRoom = null;
    },
    fetchRoomByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addRoomStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addRoomSuccess: (state, action: PayloadAction<Room>) => {
      state.rooms.push(action.payload);
      state.loading = false;
    },
    addRoomFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateRoomStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateRoomSuccess: (state, action: PayloadAction<Room>) => {
      // const index = state.rooms.findIndex(room => room.id === action.payload.id);
      // if (index !== -1) {
      //   state.rooms[index] = action.payload;
      // }
      // if (state.currentRoom && state.currentRoom.id === action.payload.id) {
        state.currentRoom = action.payload;
      // }
      state.loading = false;
    },
    updateRoomFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteRoomStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteRoomSuccess: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter((room: { id: string; }) => room.id !== action.payload);
      if (state.currentRoom && state.currentRoom.id === action.payload) {
        state.currentRoom = null;
      }
      state.loading = false;
    },
    deleteRoomFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  clearRoomByIdSuccess,
  fetchRoomsStart,
  fetchRoomsSuccess,
  fetchRoomsFailure,
  fetchRoomByIdStart,
  fetchRoomByIdSuccess,
  fetchRoomByIdFailure,
  addRoomStart,
  addRoomSuccess,
  addRoomFailure,
  updateRoomStart,
  updateRoomSuccess,
  updateRoomFailure,
  deleteRoomStart,
  deleteRoomSuccess,
  deleteRoomFailure
} = roomSlice.actions;

export default roomSlice.reducer;