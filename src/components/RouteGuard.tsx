import React from "react";
import { Lock } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Text from "@/components/text";
import View from "@/components/view";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import { usePermissions } from "@/utils/custom-hooks/use-permissions";
import {
  getFirstPermittedPage,
  isRouteAllowed,
} from "@/utils/routePermissions";

/**
 * Wraps the page area of DashboardLayout: if the logged-in user's permissions do
 * not cover the current URL (utils/routePermissions.ts) a friendly "Not
 * authorised" screen is shown instead of the page. It never logs the user out.
 */
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission } = usePermissions();

  // no stored session user (should not happen): do not block, the API still enforces
  if (!user) return <>{children}</>;
  if (isRouteAllowed(pathname, hasPermission)) return <>{children}</>;

  const home = getFirstPermittedPage(hasPermission);

  // landing on the dashboard without dashboard access (e.g. right after login)
  if (home && pathname.startsWith("/dashboard") && home.path !== "/dashboard") {
    return <Navigate to={home.path} replace />;
  }

  return (
    <Card className="mx-auto mt-10 max-w-xl p-8 text-center">
      <View className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/30">
        <Lock size={28} />
      </View>
      <Text as="h1" className="mb-2 text-xl font-semibold text-text-DEFAULT">
        Not authorised
      </Text>
      <Text as="p" className="mb-6 text-text-light">
        Your role does not have access to this page. If you think this is a
        mistake, please contact your administrator.
      </Text>
      <View className="flex justify-center gap-3">
        <Button variant="outline" onPress={() => navigate(-1)}>
          Go back
        </Button>
        {home && (
          <Button variant="primary" onPress={() => navigate(home.path)}>
            Go to {home.label}
          </Button>
        )}
      </View>
    </Card>
  );
};

export default RouteGuard;
