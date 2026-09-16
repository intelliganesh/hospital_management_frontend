import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  wardDetailSlice,
  wardListSlice,
  wardDropdownSlice,
} from "../slices/wards";
import {
  WARD_LIST_URL,
  WARD_ADD_URL,
  WARD_EDIT_URL,
  WARD_DELETE_URL,
  WARD_DETAILS_URL,
  WARD_DROPDOWN_URL,
} from "@/utils/urls/backend";

const api = new LaunchApi();

export const useWards = () => {
  const dispatch = useDispatch();

  const wardDetailHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        WARD_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(wardDetailSlice(response.data));
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

  const wardListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null
  ): Promise<void> => {
    try {
      await api.get(
        `${WARD_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(wardListSlice(response.data));
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

  const addWardHandler = async (
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        WARD_ADD_URL,
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

  const editWardHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        WARD_EDIT_URL + "/" + id,
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

  const deleteWardHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.delete(
        WARD_DELETE_URL,
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

  const wardDropdownHandler = async (
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        WARD_DROPDOWN_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(wardDropdownSlice(response.data));
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
    wardDetailHandler,
    wardListHandler,
    addWardHandler,
    editWardHandler,
    deleteWardHandler,
    wardDropdownHandler,
  };
};
