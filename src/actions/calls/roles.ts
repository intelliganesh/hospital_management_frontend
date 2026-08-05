// @/actions/calls/role.ts
import LaunchApi from "@/actions/api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  ROLE_ADD_URL,
  ROLE_EDIT_URL,
  ROLE_LIST_URL,
  ROLE_DELETE_URL,
  ROLES_DROPDOWN_URL,
  PERMISSION_ADD_URL,
  PERMISSION_EDIT_URL,
} from "@/utils/urls/backend";
import {
  addRoleStart,
  deleteRoleStart,
  getRoleListSuccess,
  roleDropdownSlice,
  //   getRoleDetailsStart,
  //   getRoleDetailsSuccess,
} from "../slices/roleSlice";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useRoles = () => {
  const dispatch = useDispatch();

  const getRoleList = async (
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
        `${ROLE_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getRoleListSuccess(response.data));
            return callback(true, { success: true });
          } else {
            response && handleApiError(response);
            return callback(false, { success: false });
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

  // const getRoleDetails = async (
  //   roleId: string,
  //   callback: ApiCallback
  // ): Promise<void> => {
  //   dispatch(getRoleDetailsStart());
  //   try {
  //     await api.get(
  //       `${ROLE_DETAILS_URL}/${roleId}`,
  //       (response: AuthPayload, success: boolean, statusCode: number) => {
  //         if (success && statusCode === 200) {
  //           dispatch(getRoleDetailsSuccess(response));
  //           callback(true, { success: true });
  //         } else {
  //           callback(false, { success: false });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     callback(false, { success: false });
  //   }
  // };

  const roleDropdownHandler = async (callback: ApiCallback): Promise<void> => {
    try {
      await api.get(
        ROLES_DROPDOWN_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(roleDropdownSlice(response?.data));
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

  const addRole = async <T>(data: T, callback: ApiCallback): Promise<void> => {
    dispatch(addRoleStart());
    try {
      await api.post(
        ROLE_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true, { success: true });
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const updateRole = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        ROLE_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else if (statusCode && statusCode !== 204) {
            response && handleApiError(response);
            return callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const deleteRole = async (
    roleId: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    dispatch(deleteRoleStart());
    try {
      await api.delete(
        ROLE_DELETE_URL,
        roleId,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(deleteRoleSuccess(roleId) );
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

  const cleanUp = () => {
    api.cleanup();
  };

  const addPermission = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        PERMISSION_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true, { success: true });
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };
  const updatePermission = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        PERMISSION_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  return {
    addRole,
    cleanUp,
    updateRole,
    deleteRole,
    getRoleList,
    roleDropdownHandler,
    addPermission,
    updatePermission
    // getRoleDetails,
  };
};
