// useUsers.ts
import LaunchApi from "@/actions/api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  USER_ADD_URL,
  USER_EDIT_URL,
  USER_LIST_URL,
  USER_DELETE_URL,
  USER_DETAILS_URL,
  USER_PROFILE_URL,
  USER_ROLE_LIST_URL,
  USER_OLDPASSWORD_CHECK_URL,
} from "@/utils/urls/backend";
import {
  addUserStart,
  deleteUserStart,
  getUserListStart,
  deleteUserSuccess,
  getUserListSuccess,
  getUserDetailsStart,
  getUserDetailsSuccess,
  userRoleListSlice,
} from "../slices/userSlice";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useUsers = () => {
  const dispatch = useDispatch();

  const getUserList = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    dispatch(getUserListStart());
    try {
      await api.get(
        `${USER_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getUserListSuccess(response?.data));
            return callback(true, { success: true });
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

  const getUserDetails = async (
    userId: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    dispatch(getUserDetailsStart());
    try {
      await api.get(
        `${USER_DETAILS_URL}/${userId}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getUserDetailsSuccess(response));
            callback(true, { success: true });
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
  const getProfilerDetails = async (
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    dispatch(getUserDetailsStart());
    try {
      await api.get(
        `${USER_PROFILE_URL}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getUserDetailsSuccess(response));
            callback(true, { success: true });
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

  const addUser = async <T>(data: T, callback: ApiCallback): Promise<void> => {
    dispatch(addUserStart());
    try {
      await api.post(
        USER_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true, { success: true, data: response.data });
          } else {
            callback(false, { success: false });
            response && handleApiError(response);
          }
        },
        data
      );
    } catch (error) {
      console.log(error);

      error && handleApiError(error);
      callback(false, { success: false, data: error });
    }
  };

  const updateUser = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        USER_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, { success: true, data: response.data });
          } else if (statusCode && statusCode !== 204) {
            callback(false, { success: false });
            response && handleApiError(response);
          }
        },
        data
      );
    } catch (error) {
      // console.log(error);
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const deleteUser = async (
    userId: string,
    callback: ApiCallback
  ): Promise<void> => {
    dispatch(deleteUserStart());
    try {
      await api.delete(
        USER_DELETE_URL,
        userId,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(deleteUserSuccess(userId));
            callback(true, { success: true });
          } else {
            callback(false, { success: false });
            response && handleApiError(response);
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const rolesList = async (callback: ApiCallback): Promise<void> => {
    try {
      await api.get(
        USER_ROLE_LIST_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(userRoleListSlice(response.data));
            callback(true);
          } else {
            response && handleApiError(response);
            callback(false);
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const checkOldPassword = async (
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        USER_OLDPASSWORD_CHECK_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(response.data?.updated);
          } else {
            response && handleApiError(response);
            callback(false);
          }
        },
        data
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
    addUser,
    cleanUp,
    rolesList,
    updateUser,
    deleteUser,
    getUserList,
    getUserDetails,
    checkOldPassword,
    getProfilerDetails,
  };
};
