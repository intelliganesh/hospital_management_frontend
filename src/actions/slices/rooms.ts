import { createSlice } from "@reduxjs/toolkit";
import { RoomState } from "@/interfaces/rooms";

const initialState: RoomState = {
  rooms: [],
  roomDetailData: {},
  roomDropdownData: [],
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    roomDetailSlice: (state, action) => {
      state.roomDetailData = action?.payload;
    },
    roomListSlice: (state, action) => {
      state.rooms = action?.payload;
    },
    roomDropdownSlice: (state, action) => {
      state.roomDropdownData = action?.payload;
    },
    clearRoomDetailSlice: (state) => {
      state.roomDetailData = null;
    },
  }
});

export const {
  roomDetailSlice,
  roomListSlice,
  roomDropdownSlice,
  clearRoomDetailSlice,
} = roomSlice.actions;

export default roomSlice.reducer;