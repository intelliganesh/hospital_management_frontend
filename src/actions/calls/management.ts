import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { ApiCallback } from "@/interfaces/api";
import {
  MANAGEMENT_ADD_URL,
  MANAGEMENT_DELETE_URL,
  MANAGEMENT_DETAILS_URL,
  MANAGEMENT_DROPDOWN_URL,
  MANAGEMENT_EDIT_URL,
  MANAGEMENT_LIST_URL,
} from "@/utils/urls/backend";
import { AuthPayload } from "@/interfaces/slices/auth";

import { LoadingStatus } from "@/interfaces";
import {
  managmentDetailSlice,
  managmentDropdownSlice,
  managmentListSlice,
} from "../slices/management";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useManagement = () => {
  const dispatch = useDispatch();

  const addManagement = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        MANAGEMENT_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, { success: true, data: response.data });
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

  const managementList = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    // filter?: string | null
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${MANAGEMENT_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(managmentListSlice(response.data));
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

  const updateManagement = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        `${MANAGEMENT_EDIT_URL}/${id}`,
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

  const deleteManagement = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        MANAGEMENT_DELETE_URL,
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

  const managementDetail = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${MANAGEMENT_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(managmentDetailSlice(response.data));
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

  const managementDropdown = async (
    callback: ApiCallback,
    departmentValue?: string
  ): Promise<void> => {
    try {
      await api.get(
        `${MANAGEMENT_DROPDOWN_URL}/${departmentValue ?? "All"}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(managmentDropdownSlice(response.data));
            return callback(true, response.data);
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
    addManagement,
    managementList,
    updateManagement,
    deleteManagement,
    managementDetail,
    managementDropdown,
  };
};
