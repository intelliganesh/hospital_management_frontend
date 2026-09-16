import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  bedDetailSlice,
  bedDropdownSlice,
  bedListSlice,
//   bedDropdownSlice,
//   clearBedDetailSlice,
} from "../slices/beds";
import {
  BED_LIST_URL,
  BED_ADD_URL,
  BED_EDIT_URL,
  BED_DELETE_URL,
  BED_DETAILS_URL,
  BED_DROPDOWN_URL,
} from "@/utils/urls/backend";

const api = new LaunchApi();

export const useBeds = () => {
  const dispatch = useDispatch();

  const bedDetailHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        BED_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(bedDetailSlice(response.data));
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

  const bedListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null
  ): Promise<void> => {
    try {
      await api.get(
        `${BED_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(bedListSlice(response.data));
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

  const addBedHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        BED_ADD_URL,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else {
            return callback(false);
          }
        },
        data
      );
    } catch (error) {
      callback(false);
    }
  };

  const editBedHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        BED_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            return callback(false);
            }
        },
        data
      );
    } catch (error) {
      callback(false);
    }
  };

  const deleteBedHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.delete(
        BED_DELETE_URL,
        id,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
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

  const bedDropdownHandler = async (
    room_id: number,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        `${BED_DROPDOWN_URL}/${room_id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(bedDropdownSlice(response.data));
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

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    bedDetailHandler,
    bedListHandler,
    addBedHandler,
    editBedHandler,
    deleteBedHandler,
    bedDropdownHandler,
  };
};
