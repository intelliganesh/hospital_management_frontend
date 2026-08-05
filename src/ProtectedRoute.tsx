// ProtectedRoute.tsx
import React from "react";
// import { Navigate } from "react-router-dom";
import {
  usePermissions,
  PermissionValue,
} from "./utils/custom-hooks/use-permissions";

interface ProtectedRouteProps {
  permissions: PermissionValue[];
  requireAll?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permissions,
  requireAll = false,
  children,
}) => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  const allowed = requireAll
    ? permissions.every((p) => hasPermission(p)) // AND
    : hasAnyPermission(permissions); // OR

  // if (!allowed) return <Navigate to="/dashboard" replace />;
  if (!allowed) return;

  return <>{children}</>;
};

export default ProtectedRoute;
