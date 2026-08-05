import { ROLE_PERMISSIONS, PERMISSIONS } from "@/rolesRoute";
export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const usePermissions = () => {
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

  const hasPermission = (permission: PermissionValue): boolean => {
    return getUserPermissions().includes(permission);
  };

  const hasAnyPermission = (permissions: PermissionValue[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  return {
    user,
    getUserRole: resolveUserRole,
    getUserPermissions,
    hasPermission,
    hasAnyPermission,
  };
};
