import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  MEDICINE_CATEGORY_ADD_URL,
  MEDICINE_CATEGORY_DELETE_URL,
  MEDICINE_CATEGORY_DETAILS_URL,
  MEDICINE_CATEGORY_EDIT_URL,
  MEDICINE_CATEGORY_LIST_URL,
} from "@/utils/urls/backend";
import {
  medicineCategoryDetailSlice,
  medicineCategoryListSlice,
} from "../slices/medicineCategory";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useMedicineCategory = () => {
  const dispatch = useDispatch();

  const addMedicineCategoryHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        MEDICINE_CATEGORY_ADD_URL,
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

  const listMedicineCategoryHandler = async (
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
        `${MEDICINE_CATEGORY_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(medicineCategoryListSlice(response.data));
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

  const detailMedicineCategoryHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        MEDICINE_CATEGORY_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(medicineCategoryDetailSlice(response.data));
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
      // console.error(error);
      callback(false);
    }
  };

  const editMedicineCategoryHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        MEDICINE_CATEGORY_EDIT_URL + "/" + id,
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

  const deleteMedicineCategoryHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        MEDICINE_CATEGORY_DELETE_URL,
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

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addMedicineCategoryHandler,
    listMedicineCategoryHandler,
    detailMedicineCategoryHandler,
    editMedicineCategoryHandler,
    deleteMedicineCategoryHandler,
  };
};
