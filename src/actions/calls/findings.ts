import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { findingDetailSlice, findingDropdownSlice, findingListSlice } from "../slices/findings";
import {
  FINDINGS_ADD_URL,
  FINDINGS_LIST_URL,
  FINDINGS_EIDT_URL,
  FINDINGS_DELETE_URL,
  FINDINGS_DETAILS_URL,
  FINDINGS_OPTIONS_LIST_URL,
} from "@/utils/urls/backend";
import { GENERIC_ERROR_MESSAGE } from "@/utils/message";

const api = new LaunchApi();

export const useFindings = () => {
  const dispatch = useDispatch();

  const findingDetailHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        FINDINGS_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(findingDetailSlice(response?.data));
            return callback(true);
          } else {
            callback(false, { success: false });
          }
        }
      );
    } catch (error) {
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const findingListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any
  ): Promise<void> => {
    try {
      await api.get(
        `${FINDINGS_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(findingListSlice(response.data));
            return callback(true);
          } else {
            callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const addFindingHandler = async (
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        FINDINGS_ADD_URL,
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

  const editFindingHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        FINDINGS_EIDT_URL + "/" + id,
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

  const deleteFindingHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.delete(
        FINDINGS_DELETE_URL,
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


  const findingDropdownHandler = async (
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        FINDINGS_OPTIONS_LIST_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(findingDropdownSlice(response.data));
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
    findingDetailHandler,
    findingListHandler,
    addFindingHandler,
    editFindingHandler,
    deleteFindingHandler,
    findingDropdownHandler,
  };
};



