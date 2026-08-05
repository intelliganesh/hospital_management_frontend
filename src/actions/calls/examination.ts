import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { GENERIC_ERROR_MESSAGE, TRYBLOCK_ERROR_MESSAGE } from "@/utils/message";
import {
    examinationListReducer,
    examinationDetailReducer,
} from "../slices/examination";
import {
  EXAMINATION_ADD_URL,
  EXAMINATION_LIST_URL,
  EXAMINATION_EIDT_URL,
  EXAMINATION_DELETE_URL,
  EXAMINATION_DETAILS_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useExaminations = () => {
  const dispatch = useDispatch();

  const examinationDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        EXAMINATION_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(examinationDetailReducer(response));
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
  const examinationListHandler = async (
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
        `${EXAMINATION_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          
          if (success && statusCode === 200) {
            dispatch(examinationListReducer(response?.data));
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
  const addExaminationHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        EXAMINATION_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(addPatientSlice());
            callback(true, response.data);
            // callback(true, { success: true, message: response.data.message  });
          } else {
            response && handleApiError(response);
            callback(false);
            // callback(false, Object.values(response.errors)[0]);
            // callback(false, { success: false, message: response.data.message  });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };
  const editExaminationHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        EXAMINATION_EIDT_URL + "/" + id,
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
  const deleteExaminationHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        EXAMINATION_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(deletePatientSuccess(id));
            return callback(true, {
              success: true,
              message: response.data.message,
            });
          } else {
            response && handleApiError(response);
            return callback(false, {
              success: false,
              error: TRYBLOCK_ERROR_MESSAGE,
            });
          }
        },
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      return callback(false, { success: false });
    }
  };

  
  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addExaminationHandler,
    editExaminationHandler,
    examinationListHandler,
    deleteExaminationHandler,
    examinationDetailHandler,
  };
};
