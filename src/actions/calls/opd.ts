import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import {
  OPD_ADD_URL,
  OPD_EDIT_URL,
  OPD_LIST_URL,
  OPD_DELETE_URL,
  OPD_DETAILS_URL,
  OPD_PUA_LIST_URL,
} from "@/utils/urls/backend";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { opdDetailSlice, opdListSlice, puaListSlice } from "../slices/opd";

const api = new LaunchApi();

export const useOpd = () => {
  const dispatch = useDispatch();

  const addOpdHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        OPD_ADD_URL,
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

  const opdListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null
  ): Promise<void> => {
    try {
      await api.get(
        `${OPD_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(opdListSlice(response.data));
            callback(true);
          } else {
            callback(false);
          }
        }
      );
    } catch (error) {
      callback(false);
    }
  };

  const opdDetailHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        OPD_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(opdDetailSlice(response));
            return callback(true, response.data);
          } else {
            return callback(false);
          }
        }
      );
    } catch (error) {
      callback(false);
    }
  };

  const opdEditHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        OPD_EDIT_URL + "/" + id,
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

  const OpdDeleteHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.delete(
        OPD_DELETE_URL,
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

  const PuaListHandler = async (callback: ApiCallback): Promise<void> => {
    try {
      await api.get(
        OPD_PUA_LIST_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(puaListSlice(response));
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
    addOpdHandler,
    opdListHandler,
    opdEditHandler,
    opdDetailHandler,
    OpdDeleteHandler,
    PuaListHandler,
  };
};
