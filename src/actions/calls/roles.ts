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
  PERMISSIONS_LIST_URL,
  ROLE_PERMISSIONS_URL,
} from "@/utils/urls/backend";
import { PermissionModule } from "@/interfaces/roles";
import { extractPermissions } from "@/utils/sessionPermissions";
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

  /** GET /permissions_list -> permission catalogue grouped by module. */
  const getPermissionsCatalogue = async (
    callback: (modules: PermissionModule[] | null) => void
  ): Promise<void> => {
    try {
      await api.get(
        PERMISSIONS_LIST_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(normalizePermissionModules(response?.data));
          }
          response && handleApiError(response);
          callback(null);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(null);
    }
  };

  /** GET /role_permissions/{id} -> permission keys currently granted to the role. */
  const getRolePermissions = async (
    roleId: string | number,
    callback: (permissions: string[] | null) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${ROLE_PERMISSIONS_URL}/${roleId}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            const d = response?.data;
            return callback(
              Array.isArray(d) ? d : extractPermissions(response) ?? []
            );
          }
          response && handleApiError(response);
          callback(null);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(null);
    }
  };

  /** PUT /role_permissions/{id} {permissions: string[]} */
  const saveRolePermissions = async (
    roleId: string | number,
    permissions: string[],
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        `${ROLE_PERMISSIONS_URL}/${roleId}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, { success: true });
          }
          response && handleApiError(response);
          callback(false, { success: false });
        },
        { permissions } as any
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
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
    updatePermission,
    getRolePermissions,
    saveRolePermissions,
    getPermissionsCatalogue,
    // getRoleDetails,
  };
};

const toTitle = (key: string) =>
  key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const toItem = (raw: any): { key: string; label: string } | null => {
  if (typeof raw === "string") return { key: raw, label: toTitle(raw) };
  const key = raw?.key ?? raw?.name ?? raw?.permission;
  if (typeof key !== "string") return null;
  return { key, label: raw?.label ?? raw?.title ?? toTitle(key) };
};

/**
 * GET /permissions_list tolerant parser. Accepts
 *  - [{module, permissions:[{key,label}]}]            (groups)
 *  - {Module: [{key,label} | "key"]}                  (object keyed by module)
 *  - [{key,label,module}]                              (flat list)
 * (also wrapped in {modules|groups|permissions: ...}).
 */
export const normalizePermissionModules = (raw: any): PermissionModule[] => {
  let data = raw;
  for (const wrap of ["modules", "groups", "permissions"]) {
    if (data && !Array.isArray(data) && data[wrap]) {
      data = data[wrap];
      break;
    }
  }
  const out: PermissionModule[] = [];
  const add = (module: string, items: any[]) => {
    const permissions = items
      .map(toItem)
      .filter((i): i is { key: string; label: string } => !!i);
    if (permissions.length) out.push({ module, permissions });
  };
  if (Array.isArray(data)) {
    const groups = data.filter(
      (g) => g && typeof g === "object" && Array.isArray(g.permissions ?? g.items)
    );
    if (groups.length) {
      groups.forEach((g) =>
        add(g.module ?? g.name ?? g.label ?? "Other", g.permissions ?? g.items)
      );
    } else {
      const byModule: Record<string, any[]> = {};
      data.forEach((p) => {
        const m = (typeof p === "object" && (p.module ?? p.group)) || "Other";
        (byModule[m] = byModule[m] || []).push(p);
      });
      Object.entries(byModule).forEach(([m, items]) => add(m, items));
    }
  } else if (data && typeof data === "object") {
    Object.entries(data).forEach(([m, items]) => {
      if (Array.isArray(items)) add(m, items);
    });
  }
  return out;
};
