import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  FOOD_ADVICE_ADD_URL,
  FOOD_ADVICE_DELETE_URL,
  FOOD_ADVICE_DETAILS_URL,
  FOOD_ADVICE_DROPDOWN_URL,
  FOOD_ADVICE_EDIT_URL,
  FOOD_ADVICE_LIST_URL,
} from "@/utils/urls/backend";
import {
  foodAdviceDetailSlice,
  foodAdviceDropdownListSlice,
  foodAdviceListSlice,
} from "../slices/foodAdvice";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();
export const useFoodAdvice = () => {
  const dispatch = useDispatch();

  const addFoodAdvice = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        FOOD_ADVICE_ADD_URL,
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

  const foodAdviceList = async (
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
        `${FOOD_ADVICE_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(foodAdviceListSlice(response.data));
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

  const updateFoodAdvice = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        `${FOOD_ADVICE_EDIT_URL}/${id}`,
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

  const deleteFoodAdvice = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        FOOD_ADVICE_DELETE_URL,
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

  const foodAdviceDetail = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${FOOD_ADVICE_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(foodAdviceDetailSlice(response.data));
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

  const foodAdviceDropdownHandler = async (
    callback: ApiCallback,
    departmentValue?: string
  ): Promise<void> => {
    try {
      await api.get(
        `${FOOD_ADVICE_DROPDOWN_URL}/${departmentValue ?? "All"}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(foodAdviceDropdownListSlice(response.data));
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
    addFoodAdvice,
    foodAdviceList,
    updateFoodAdvice,
    deleteFoodAdvice,
    foodAdviceDetail,
    foodAdviceDropdownHandler,
    cleanUp,
  };
};
