import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  medicineCategoryMappingList,
  medicineCategoryMappingAllList,
  medicineCategoryMappingDetails,
} from "../slices/medicineCategoryMapping";
import {
  MEDICINE_CATEGORY_MAPPING_ADD_URL,
  MEDICINE_CATEGORY_MAPPING_EDIT_URL,
  MEDICINE_CATEGORY_MAPPING_LIST_URL,
  MEDICINE_CATEGORY_MAPPING_DETAILS_URL,
  MEDICINE_CATEGORY_MAPPING_ALL_LIST_URL,
  MEDICINE_CATEGORY_MAPPING_DELETE_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useMedicineCategoryMapping = () => {
  const dispatch = useDispatch();

  const addMedicineCategoryMappingHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        MEDICINE_CATEGORY_MAPPING_ADD_URL,
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

  const listMedicineCategoryMappingHandler = async (
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
        `${MEDICINE_CATEGORY_MAPPING_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(medicineCategoryMappingList(response.data));
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

  const editMedicineCategoryMappingHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        MEDICINE_CATEGORY_MAPPING_EDIT_URL + "/" + id,
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

  const medicineCategoryMapingAllList = async (callback: ApiCallback) => {
    try {
      await api.get(
        MEDICINE_CATEGORY_MAPPING_ALL_LIST_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(medicineCategoryMappingAllList(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      // console.error(error);
      callback(false);
    }
  };
  const medicineCategoryMapingGet = async (
    id: string,
    callback: ApiCallback
  ) => {
    try {
      await api.get(
        MEDICINE_CATEGORY_MAPPING_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(medicineCategoryMappingDetails(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        }
      );
    } catch (error) {
      // console.error(error);
      error && handleApiError(error);
      callback(false);
    }
  };

  const medicineCategoryMapingDeleteHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ) => {
    try {
      await api.delete(
        MEDICINE_CATEGORY_MAPPING_DELETE_URL,
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
    medicineCategoryMapingGet,
    medicineCategoryMapingAllList,
    addMedicineCategoryMappingHandler,
    listMedicineCategoryMappingHandler,
    editMedicineCategoryMappingHandler,
    medicineCategoryMapingDeleteHandler,
  };
};
