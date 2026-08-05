import LaunchApi from "../../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { doshaAnalysisDetailSlice, doshaAnalysisListSlice, doshaOptionsListSlice } from "../../slices/doshaAnalysis";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
// import {
//   PRAKRITI_LIST_URL,
//   PRAKRITI_DETAILS_URL,
//   PRAKRITI_ADD_URL,
//   PRAKRITI_EDIT_URL,
//   PRAKRITI_DELETE_URL,
//   PRAKRITI_OPTIONS_LIST_URL,
// } from "@/utils/urls/backend";

const api = new LaunchApi();

export const useDoshaApi = (url: string) => {
  const dispatch = useDispatch();

  const ListHandler = async (
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
        `${url}_list?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(doshaAnalysisListSlice(response?.data));
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

  const DetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        url + "_details" + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(doshaAnalysisDetailSlice(response.data));
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

  const addHandler = async (
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        url + "_add",
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
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

  const editHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
       url + "_update" + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
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

  const deleteHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        url + "_delete",
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

  const OptionsListHandler = async (
    callback: (data:any)=>void
  ): Promise<void> => {
    try {
      await api.get(
        url + "_options_list",
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(doshaOptionsListSlice(response.data));
            return callback(response.data);
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


  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    ListHandler,
    DetailHandler,
    addHandler,
    editHandler,
    deleteHandler,
    OptionsListHandler,
  };
};







