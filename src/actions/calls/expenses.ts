import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { ApiCallback } from "@/interfaces/api";
import {
  EXPENSES_ADD_URL,
  EXPENSES_DELETE_URL,
  EXPENSES_DETAILS_URL,
  EXPENSES_DROPDOWN_URL,
  EXPENSES_EDIT_URL,
  EXPENSES_LIST_URL,
  EXPENSES_VOUCHER_DOWNLOAD,
} from "@/utils/urls/backend";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  expenseDetailSlice,
  expenseDropdownSlice,
  expenseListSlice,
} from "../slices/expenses";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useExpenses = () => {
  const dispatch = useDispatch();

  const addExpenses = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        EXPENSES_ADD_URL,
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

  const expensesList = async (
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
        `${EXPENSES_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(expenseListSlice(response.data));
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

  const updateExpenses = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        `${EXPENSES_EDIT_URL}/${id}`,
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

  const deleteExpenses = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        EXPENSES_DELETE_URL,
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

  const expensesDetail = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        `${EXPENSES_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(expenseDetailSlice(response.data));
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

  const expensesDropdown = async (callback: ApiCallback): Promise<void> => {
    try {
      await api.get(
        EXPENSES_DROPDOWN_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(expenseDropdownSlice(response.data));
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

  const downloadVoucherHandler = async <T>(
    id: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}${EXPENSES_VOUCHER_DOWNLOAD}/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        response && handleApiError(response);
        throw new Error(`Failed to fetch download link: ${response.status}`);
      }

      const data = await response.json();

      if (data.data.url) {
        window.open(data.data.url, "_blank");

        callback(true);
      } else {
        console.error("No download URL returned by backend");

        callback(false, { success: false, error: "Download URL missing" });
      }
    } catch (error) {
      error && handleApiError(error);
      console.error("Download error:", error);
      callback(false, { success: false, error: "Unexpected error" });
    }
  };
  const cleanUp = () => {
    api.cleanup();
  };

  return {
    addExpenses,
    expensesList,
    updateExpenses,
    deleteExpenses,
    expensesDetail,
    expensesDropdown,
    downloadVoucherHandler,
    cleanUp,
  };
};
