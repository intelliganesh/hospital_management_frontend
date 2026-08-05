import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  SURGICAL_HISTORY_ADD_URL,
  SURGICAL_HISTORY_DELETE_URL,
  SURGICAL_HISTORY_DETAILS_URL,
  SURGICAL_HISTORY_DROPDOWN_URL,
  SURGICAL_HISTORY_EDIT_URL,
  SURGICAL_HISTORY_LIST_URL,
} from "@/utils/urls/backend";
import { ApiCallback } from "@/interfaces/api";
import {
  surgicalHistoryDetailSlice,
  surgicalHistoryDropdownSlice,
  surgicalHistoryListSlice,
} from "../slices/surgicalHistory";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useSurgicalHistory = () => {
  const dispatch = useDispatch();

  const addSurgicalHistory = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        SURGICAL_HISTORY_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };
  const surgicalHistoryList = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
    // filter?: string | null
  ): Promise<void> => {
    try {
      await api.get(
        `${SURGICAL_HISTORY_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(surgicalHistoryListSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const surgicalHistoryDetail = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${SURGICAL_HISTORY_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(surgicalHistoryDetailSlice(response.data));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const surgicalHistoryUpdate = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        SURGICAL_HISTORY_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const surgicalHistoryDelete = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        SURGICAL_HISTORY_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const surgicalHistoryDropdownHandler = async (
    callback: ApiCallback,
    // departmentValue?: string
  ): Promise<void> => {
    try {
      await api.get(
        `${SURGICAL_HISTORY_DROPDOWN_URL}/All`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(surgicalHistoryDropdownSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addSurgicalHistory,
    surgicalHistoryList,
    surgicalHistoryDetail,
    surgicalHistoryUpdate,
    surgicalHistoryDelete,
    surgicalHistoryDropdownHandler,
  };
};
