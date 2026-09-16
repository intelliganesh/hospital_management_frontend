// @/actions/room.ts
import { useDispatch } from "react-redux";
import LaunchApi from "@/actions/api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
// import { RoomPayload } from "@/interfaces/slices/room";
// import { GENERIC_ERROR_MESSAGE } from "@/utils/message";
import {
   roomListSlice,
   roomDetailSlice,
   roomDropdownSlice,
} from "@/actions/slices/rooms";

import {
  ROOM_LIST_URL,
  ROOM_DETAIL_URL,
  ROOM_ADD_URL,
  ROOM_UPDATE_URL,
  ROOM_DELETE_URL,
  ROOM_DROPDOWN_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";

const api = new LaunchApi();

export const useRoom = () => {
  const dispatch = useDispatch();

  // Get room list
  const getRoomList = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${ROOM_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(roomListSlice(response.data));
            callback(true);
          } else {
            // dispatch(fetchRoomsFailure(response.error || GENERIC_ERROR_MESSAGE));
            // return callback(false, { success: false, error: response.error || GENERIC_ERROR_MESSAGE });
            callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      //   dispatch(fetchRoomsFailure(GENERIC_ERROR_MESSAGE));
      callback(false);
    }
  };

  // Get room by ID
  const getRoomById = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${ROOM_DETAIL_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(roomDetailSlice(response.data));
             callback(true);
          } else {
            // dispatch(fetchRoomByIdFailure(response.error || GENERIC_ERROR_MESSAGE));
             callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      //   dispatch(fetchRoomByIdFailure(GENERIC_ERROR_MESSAGE));
      callback(false);
    }
  };

  // Add new room
  const addRoom = async <T>(data: T, callback: ApiCallback): Promise<void> => {
    try {
      await api.post(
        ROOM_ADD_URL,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
           return callback(true);
          } else if(statusCode && statusCode !== 204) {
            return callback(false);
          }
        },
        data,
      );
    } catch (error) {
      //   dispatch(addRoomFailure(GENERIC_ERROR_MESSAGE));
      callback(false);
    }
  };

  // Update room
  const updateRoom = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        `${ROOM_UPDATE_URL}/${id}`,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
             callback(true);
          } else if(statusCode && statusCode !== 204) {
             callback(false);
          }
        },
        data
      );
    } catch (error) {
      //   dispatch(updateRoomFailure(GENERIC_ERROR_MESSAGE));
      callback(false);
    }
  };

  // Delete room
  const deleteRoom = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      // dispatch(deleteRoomStart());
      await api.delete(
        ROOM_DELETE_URL,
        id,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true);
          } else {
            callback(false);
          }
        },
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      callback(false);
    }
  };

  const roomDropdownHandler = async (
    ward_id: number,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        `${ROOM_DROPDOWN_URL}/${ward_id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(roomDropdownSlice(response.data));
            return callback(true);
          } else {
            return callback(false);
          }
        }
      );
    } catch (error) {
      callback(false);
    }
  };

  // Clean up any active requests
  const cleanUp = () => {
    api.cleanup();
  };

  return {
    getRoomList,
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom,
    roomDropdownHandler,
    cleanUp,
  };
};
