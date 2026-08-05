import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  ON_EXAMINATION_ADD_URL,
  ON_EXAMINATION_DELETE_URL,
  ON_EXAMINATION_DETAILS_URL,
  ON_EXAMINATION_DROPDOWN_URL,
  ON_EXAMINATION_EDIT_URL,
  ON_EXAMINATION_LIST_URL,
} from "@/utils/urls/backend";
import {
  onExaminationDetailSlice,
  onExaminationDropdownSlice,
  onExaminationListSlice,
} from "../slices/onExamination";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useOnExamination = () => {
  const dispatch = useDispatch();

  const addOnExamination = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        ON_EXAMINATION_ADD_URL,
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

  const onExaminationList = async (
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
        `${ON_EXAMINATION_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(onExaminationListSlice(response.data));
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

  const updateOnExamination = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        ON_EXAMINATION_EDIT_URL + `/${id}`,
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

  const deleteOnExamination = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        ON_EXAMINATION_DELETE_URL,
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

  const onExaminationDetail = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${ON_EXAMINATION_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(onExaminationDetailSlice(response.data));
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

  const onExaminationDropdownHandler = async (
    callback: ApiCallback,
    // departmentValue?: string
  ): Promise<void> => {
    try {
      await api.get(
        `${ON_EXAMINATION_DROPDOWN_URL}/All`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(onExaminationDropdownSlice(response.data));
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
    addOnExamination,
    onExaminationList,
    updateOnExamination,
    deleteOnExamination,
    onExaminationDetail,
    onExaminationDropdownHandler,
    cleanUp,
  };
};
