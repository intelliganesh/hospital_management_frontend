import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
import {
  BILLING_SERVICE_CATEGORY_ADD_URL,
  BILLING_SERVICE_CATEGORY_DELETE_URL,
  BILLING_SERVICE_CATEGORY_DETAILS_URL,
  BILLING_SERVICE_CATEGORY_DROPDOWN_URL,
  BILLING_SERVICE_CATEGORY_LIST_URL,
  BILLING_SERVICE_CATEGORY_UPDATE_URL,
} from "@/utils/urls/backend";
import {
  billingServiceCategoryDetailSlice,
  billingServiceCategoryDropdownSlice,
  billingServiceCategoryListSlice,
} from "@/actions/slices/billingServiceCategory";

const api = new LaunchApi();

export const useBillingServiceCategory = () => {
  const dispatch = useDispatch();

  const billingServiceCategoryListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        `${BILLING_SERVICE_CATEGORY_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(billingServiceCategoryListSlice(response.data));
            return callback(true, response.data);
          }
          response && handleApiError(response);
          return callback(false);
        },
        data,
        (status) => isLoading?.(status),
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const billingServiceCategoryDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        `${BILLING_SERVICE_CATEGORY_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(billingServiceCategoryDetailSlice(response.data));
            return callback(true, response.data);
          }
          response && handleApiError(response);
          return callback(false);
        },
        data,
        (status) => isLoading?.(status),
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const addBillingServiceCategoryHandler = async (
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        BILLING_SERVICE_CATEGORY_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) return callback(true, response.data);
          response && handleApiError(response);
          return callback(false);
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const editBillingServiceCategoryHandler = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        `${BILLING_SERVICE_CATEGORY_UPDATE_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) return callback(true, response.data);
          response && handleApiError(response);
          return callback(false);
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const deleteBillingServiceCategoryHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.delete(
        BILLING_SERVICE_CATEGORY_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) return callback(true);
          response && handleApiError(response);
          return callback(false);
        },
        (status) => isLoading?.(status),
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const billingServiceCategoryDropdownHandler = async (
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        BILLING_SERVICE_CATEGORY_DROPDOWN_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(billingServiceCategoryDropdownSlice(response.data));
            return callback(true, response.data);
          }
          response && handleApiError(response);
          return callback(false);
        },
        data,
        (status) => isLoading?.(status),
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
    billingServiceCategoryListHandler,
    billingServiceCategoryDetailHandler,
    addBillingServiceCategoryHandler,
    editBillingServiceCategoryHandler,
    deleteBillingServiceCategoryHandler,
    billingServiceCategoryDropdownHandler,
  };
};