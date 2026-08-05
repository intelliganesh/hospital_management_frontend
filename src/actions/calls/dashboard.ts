import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { DASHBOARD_URL } from "@/utils/urls/backend";
import { AuthPayload } from "@/interfaces/slices/auth";
import { dashboardDataSlice } from "../slices/dashboard";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useDashboard = () => {
  const dispatch = useDispatch();
 const getDashboardDataHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any,
    isLoading?: (status:  LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${DASHBOARD_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(dashboardDataSlice(response));
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
      callback(false, { success: false });
    }
  };
  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    getDashboardDataHandler,
  };
};
