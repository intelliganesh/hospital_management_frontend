import LaunchApi from "@/actions/api";
import { useDispatch } from "react-redux";
import { LoadingStatus } from "@/interfaces";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { FISTULA_REPORT_URL } from "@/utils/urls/backend";
import { getList } from "@/actions/slices/fistulaReport";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useFistulaReport = () => {
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
      await api.get(
        `${FISTULA_REPORT_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }${from_date ? "&from_date=" + from_date : ""}${
          to_date ? "&to_date=" + to_date : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getList(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            callback(false);
          }
        },
        data,
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

  return {
    cleanUp,
    getListApi,
  };
};
