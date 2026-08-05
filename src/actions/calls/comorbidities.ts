import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { ApiCallback } from "@/interfaces/api";
import {
  COMORBIDITIES_ADD_URL,
  COMORBIDITIES_DELETE_URL,
  COMORBIDITIES_DETAILS_URL,
  COMORBIDITIES_DROPDOWN_URL,
  COMORBIDITIES_EDIT_URL,
  COMORBIDITIES_LIST_URL,
} from "@/utils/urls/backend";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  comorbidityDetailSlice,
  comorbidityDropdownSlice,
  comorbidityListSlice,
} from "../slices/comorbidities";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useComorbidity = () => {
  const dispatch = useDispatch();

  const addComorbidity = async <T>(
    data: T,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        COMORBIDITIES_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const comorbidityList = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
    // filter?: string | null
  ): Promise<void> => {
    try {
      await api.get(
        `${COMORBIDITIES_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(comorbidityListSlice(response.data));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const comorbidityDetail = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        `${COMORBIDITIES_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(comorbidityDetailSlice(response.data));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const comobidityUpdate = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        COMORBIDITIES_EDIT_URL + `/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const comobidityDelete = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.delete(
        COMORBIDITIES_DELETE_URL,
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
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const comorbidityDropdownHandler = async (
    callback: ApiCallback,
    // departmentValue?: string,
  ): Promise<void> => {
    try {
      await api.get(
        `${COMORBIDITIES_DROPDOWN_URL}/All`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(comorbidityDropdownSlice(response.data));
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
    addComorbidity,
    comorbidityList,
    comorbidityDetail,
    comobidityUpdate,
    comobidityDelete,
    comorbidityDropdownHandler,
  };
};
