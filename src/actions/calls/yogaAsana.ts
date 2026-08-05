import { ApiCallback } from "@/interfaces/api";
import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  YOGA_ASANA_ADD_URL,
  YOGA_ASANA_DELETE_URL,
  YOGA_ASANA_DETAILS_URL,
  YOGA_ASANA_DROPDOWN_URL,
  YOGA_ASANA_EDIT_URL,
  YOGA_ASANA_LIST_URL,
} from "@/utils/urls/backend";
import { yogaAsanaDetailSlice, yogaAsanaDropdownSlice, yogaAsanaListSlice } from "../slices/yogaAsana";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();
export const useYogaAsana = () => {
  const dispatch = useDispatch();
  const addYogaAsanaHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        YOGA_ASANA_ADD_URL,
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

  const yogaAsanaListHandler = async (
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
        `${YOGA_ASANA_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(yogaAsanaListSlice(response.data));
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

  const yogaAsanaDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${YOGA_ASANA_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(yogaAsanaDetailSlice(response.data));
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

  const editYogaAsanaHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        `${YOGA_ASANA_EDIT_URL}/${id}`,
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

  const deleteYogaAsanaHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        YOGA_ASANA_DELETE_URL,
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

  const yogaAsanaDropdownHandler = async (
    callback: ApiCallback,
    // departmentValue?: string
  ): Promise<void> => {
    try {
      await api.get(
        // `${YOGA_ASANA_DROPDOWN_URL}/${departmentValue ?? "All"}`,
        `${YOGA_ASANA_DROPDOWN_URL}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(yogaAsanaDropdownSlice(response.data));
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
    addYogaAsanaHandler,
    yogaAsanaListHandler,
    yogaAsanaDetailHandler,
    editYogaAsanaHandler,
    deleteYogaAsanaHandler,
    yogaAsanaDropdownHandler,
    cleanUp,
  };
};
