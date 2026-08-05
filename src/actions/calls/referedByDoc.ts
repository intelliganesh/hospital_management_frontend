import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { GENERIC_ERROR_MESSAGE } from "@/utils/message";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
import {
  REFERED_BY_DOCTOR_ADD_URL,
  REFERED_BY_DOCTOR_DELETE_URL,
  REFERED_BY_DOCTOR_DETAILS_URL,
  REFERED_BY_DOCTOR_DROPDOWN_URL,
  REFERED_BY_DOCTOR_EDIT_URL,
  REFERED_BY_DOCTOR_LIST_URL,
} from "@/utils/urls/backend";
import {
  referedByDocDetailReducer,
  referedByDocDropdownReducer,
  referedByDocListReducer,
} from "../slices/referedByDoc";

const api = new LaunchApi();

export const useReferedByDoc = () => {
  const dispatch = useDispatch();

  const addReferedByDoc = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        REFERED_BY_DOCTOR_ADD_URL,
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

  const referedByDocListHandler = async (
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
        `${REFERED_BY_DOCTOR_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(referedByDocListReducer(response?.data));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(true, { success: false });
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const referedByDocDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        REFERED_BY_DOCTOR_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(referedByDocDetailReducer(response));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const editReferedByDoc = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        REFERED_BY_DOCTOR_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, {
              success: true,
              message: response.data?.message,
            });
          } else if (success && statusCode !== 204) {
            response && handleApiError(response);
            return callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const deleteReferedByDoc = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        REFERED_BY_DOCTOR_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
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

  const referedByDocDropdownHandler = async (
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.get(
        REFERED_BY_DOCTOR_DROPDOWN_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(referedByDocDropdownReducer(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
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
    addReferedByDoc,
    referedByDocListHandler,
    referedByDocDetailHandler,
    editReferedByDoc,
    deleteReferedByDoc,
    referedByDocDropdownHandler,
  };
};
