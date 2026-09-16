import LaunchApi from "@/actions/api";
import { useDispatch } from "react-redux";
import { LoadingStatus } from "@/interfaces";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { getList } from "@/actions/slices/ipdReport";
import { IPD_REPORT_URL } from "@/utils/urls/backend";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

const appendParam = (params: URLSearchParams, key: string, value?: any) => {
  if (value !== undefined && value !== null && value !== "") {
    params.append(key, String(value));
  }
};

export const useIpdReport = () => {
  const dispatch = useDispatch();

  const getListApi = async (
    page: number | string = 1,
    callback: ApiCallback,
    onLoading?: (status: LoadingStatus) => void,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    from_date?: string | null,
    to_date?: string | null,
    data?: any
  ) => {
    try {
      const params = new URLSearchParams();
      appendParam(params, "page", page);
      appendParam(params, "search", search);
      appendParam(params, "sort_by", sort_by);
      appendParam(params, "sort_order", sort_order);
      appendParam(params, "from_date", from_date);
      appendParam(params, "to_date", to_date);

      const multipleFilter = data?.multiple_filter || data || {};
      Object.entries(multipleFilter).forEach(([key, value]) => {
        appendParam(params, `multiple_filter[${key}]`, value);
      });

      await api.get(
        `${IPD_REPORT_URL}?${params.toString()}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getList(response.data));
            return callback(true);
          }

          response && handleApiError(response);
          callback(false);
        },
        undefined,
        (isLoading) => onLoading?.(isLoading)
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return { cleanUp, getListApi };
};