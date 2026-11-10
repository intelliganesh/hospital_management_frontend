import { useEffect, useState } from "react";
import { ROLE_PERMISSIONS, PERMISSIONS } from "@/rolesRoute";
import { PERMISSIONS_UPDATED_EVENT } from "@/utils/sessionPermissions";
export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const usePermissions = () => {
  // re-render consumers when permissions are refreshed from the server
  const [, setTick] = useState(0);
  useEffect(() => {
    const onUpdate = () => setTick((t) => t + 1);
    window.addEventListener(PERMISSIONS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(PERMISSIONS_UPDATED_EVENT, onUpdate);
  }, []);

  const getUserData = () => {
    try {
      const userDetailsStr = localStorage.getItem("userDetails");
      if (userDetailsStr) {
        return JSON.parse(userDetailsStr);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
    return null;
  };

  const user = getUserData();

  const resolveUserRole = (): string | null => {
    if (!user) return null;

    // Support both `role` and `roles` from API
    if (user.role) return user.role;
    if (Array.isArray(user.roles)) return user.roles[0];
    if (typeof user.roles === "string") return user.roles;

    return null;
  };

  const getUserPermissions = (): PermissionValue[] => {
    // 1. Use API permissions if present
    if (user?.permissions && Array.isArray(user.permissions)) {
      return user.permissions;
    }
    // 2. Fallback to hardcoded role → permissions
    const userRole = resolveUserRole();
    if (!userRole) return [];
    return ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] ?? [];
  };

  const isAdminRole = (): boolean => {
    const role = resolveUserRole();
    return role === "Super Admin" || role === "Admin";
  };

  const hasPermission = (permission: PermissionValue): boolean => {
    // Admin roles can always manage roles, so an admin can never lock
    // themselves out of the permission matrix.
    if (permission === PERMISSIONS.MANAGE_ROLES && isAdminRole()) return true;
    return getUserPermissions().includes(permission);
  };

  const hasAnyPermission = (permissions: PermissionValue[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  return {
    user,
    getUserRole: resolveUserRole,
    getUserPermissions,
    isAdminRole,
    hasPermission,
    hasAnyPermission,
  };
};
