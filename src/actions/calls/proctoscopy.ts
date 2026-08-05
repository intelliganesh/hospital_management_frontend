import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  PROCTOSCOPY_ADD_URL,
  PROCTOSCOPY_DELETE_URL,
  PROCTOSCOPY_DETAILS_URL,
  PROCTOSCOPY_DROPDOWN_URL,
  PROCTOSCOPY_EDIT_URL,
  PROCTOSCOPY_LIST_URL,
 } from "@/utils/urls/backend";
import {
  proctoscopyDetailSlice,
  proctoscopyListSlice,
  proctoscopyDropdownSlice,
} from "../slices/proctoscopy";
import { LoadingStatus } from "@/interfaces";
import { GENERIC_ERROR_MESSAGE } from "@/utils/message";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

 export const useProctoscopy = () => {
  const dispatch = useDispatch();

  const proctoscopyDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        PROCTOSCOPY_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(proctoscopyDetailSlice(response.data));
            return callback(true);
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

  const proctoscopyListHandler = async (
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
            `${PROCTOSCOPY_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
              sort_by ? "&sort_by=" + sort_by : ""
            }${sort_order ? "&sort_order=" + sort_order : ""}`,
            (response: AuthPayload, success: boolean, statusCode: number) => {
              if (success && statusCode === 200) {
                dispatch(proctoscopyListSlice(response.data));
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
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const addProctoscopyHandler = async (
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        PROCTOSCOPY_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const editProctoscopyHandler = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        PROCTOSCOPY_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const deleteProctoscopyHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        PROCTOSCOPY_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const proctoscopyDropdownHandler = async (
    callback: ApiCallback,
    departmentValue?: string
  ): Promise<void> => {
    try {
      await api.get(
        `${PROCTOSCOPY_DROPDOWN_URL}/${departmentValue ?? "All"}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(proctoscopyDropdownSlice(response.data));
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
    proctoscopyDetailHandler,
    proctoscopyListHandler,
    addProctoscopyHandler,
    editProctoscopyHandler,
    deleteProctoscopyHandler,
    proctoscopyDropdownHandler,
  };
};
