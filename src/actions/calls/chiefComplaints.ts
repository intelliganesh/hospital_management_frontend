 import { useDispatch } from "react-redux";
import LaunchApi from "@/actions/api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  chiefComplaintDetailSlice,
  chiefComplaintListSlice,
  chiefComplaintDropdownSlice,
} from "@/actions/slices/chiefComplaints";
import {
  CHIEF_COMPLAINT_ADD_URL,
  CHIEF_COMPLAINT_DELETE_URL,
  CHIEF_COMPLAINT_DETAILS_URL,
  CHIEF_COMPLAINT_DROPDOWN_URL,
  CHIEF_COMPLAINT_EDIT_URL,
  CHIEF_COMPLAINT_LIST_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

 const api = new LaunchApi();

export const useChiefComplaint = () => {
  const dispatch = useDispatch();

  const chiefComplaintDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        CHIEF_COMPLAINT_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(chiefComplaintDetailSlice(response.data));
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

  const chiefComplaintListHandler = async (
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
        `${CHIEF_COMPLAINT_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(chiefComplaintListSlice(response.data));
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

  const addChiefComplaintHandler = async (
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        CHIEF_COMPLAINT_ADD_URL,
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

  const editChiefComplaintHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        CHIEF_COMPLAINT_EDIT_URL + "/" + id,
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

  const deleteChiefComplaintHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        CHIEF_COMPLAINT_DELETE_URL,
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

  const chiefComplaintDropdownHandler = async (
    callback: ApiCallback,
    // departmentValue?: string
  ): Promise<void> => {
    try {
      await api.get(
        `${CHIEF_COMPLAINT_DROPDOWN_URL}/All`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(chiefComplaintDropdownSlice(response.data));
            return callback(true);
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
    chiefComplaintDetailHandler,
    chiefComplaintListHandler,
    addChiefComplaintHandler,
    editChiefComplaintHandler,
    deleteChiefComplaintHandler,
    chiefComplaintDropdownHandler,
  };
};
