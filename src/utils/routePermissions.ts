// Route -> required permission map (UI side of RBAC).
//
// One guard (components/RouteGuard.tsx, mounted in DashboardLayout) checks the
// current pathname against RULES, so individual <Route> lines stay untouched.
// Rules are matched top to bottom, first match wins -> keep specific rules first.
// A route that matches no rule is allowed (it is listed in
// docs/changes/rbac-frontend.md). `any` = at least one of the permissions.
// Admin roles (Super Admin / Admin) are never locked out of MANAGE_ROLES
// (see use-permissions.ts).
//
// The permission keys are the same strings the API uses (config/rbac.php);
// keep this file in sync with the sidebar (components/Sidebar.tsx).
import { matchPath } from "react-router-dom";
import { PERMISSIONS } from "@/rolesRoute";
import type { PermissionValue } from "@/utils/custom-hooks/use-permissions";

export interface RouteRule {
  /** react-router pattern; "/x/*" matches "/x" and everything below it */
  path: string;
  /** user needs at least one of these */
  any: PermissionValue[];
}

const P = PERMISSIONS;

// every master / settings-like screen reachable from Sidebar > Masters (or legacy)
const MASTER_PREFIXES = [
  "/department-list",
  "/ward-list",
  "/bank-details-list",
  "/system-rooms",
  "/bed-list",
  "/fistula-list",
  "/test-list",
  "/referred-by-list",
  "/amount-type-list",
  "/consultation-fees",
  "/chief-complaint",
  "/medicine-category-list",
  "/medicine-list",
  "/allergy-list",
  "/surgical-history",
  "/on-examination",
  "/comorbidities-list",
  "/management-list",
  "/food-advice-list",
  "/findings-list",
  "/dosha-analysis",
  "/yoga-asana-list",
  "/service-cost-list",
  "/billing-service-category-list",
  "/diet-list",
  "/dre-list",
  "/proctoscopy-list",
  "/diagnosis-list",
  // legacy screens that are routed but not in the sidebar
  "/opd-list",
  "/examination-list",
  "/patient-test-list",
];

export const ROUTE_RULES: RouteRule[] = [
  { path: "/dashboard/*", any: [P.VIEW_DASHBOARD] },

  // Patients
  { path: "/patient-list/*", any: [P.VIEW_PATIENTS] },
  { path: "/patientsform/*", any: [P.VIEW_PATIENTS] },
  { path: "/patient_details/*", any: [P.VIEW_PATIENTS] },
  { path: "/post-surgery-follow-up/*", any: [P.VIEW_PATIENTS, P.POST_SURGERY_FOLLOW_UP] },

  // Appointments
  { path: "/appointment-list/*", any: [P.VIEW_APPOINTMENTS] },
  { path: "/appointment-form/*", any: [P.VIEW_APPOINTMENTS] },
  { path: "/online-appointments/*", any: [P.VIEW_ONLINE_APPOINTMENTS] },

  // Consultations
  { path: "/consultation-list/*", any: [P.VIEW_CONSULTATIONS] },

  // IPD (enrollments, patients hub and all its sub pages, billing)
  { path: "/ipd-enrollments/*", any: [P.VIEW_IPD] },
  { path: "/ipd-enrollment-details/*", any: [P.VIEW_IPD] },
  { path: "/ipd-patients-list/*", any: [P.VIEW_IPD] },
  { path: "/ipd/*", any: [P.VIEW_IPD] },
  { path: "/ipd-bills/*", any: [P.VIEW_IPD] },
  { path: "/ipd-bill-details/*", any: [P.VIEW_IPD] },
  { path: "/ipd-bill-view/*", any: [P.VIEW_IPD] },

  // Bills
  { path: "/invoice/*", any: [P.VIEW_BILLS] },

  // Expenses and reports
  { path: "/expenses-list/*", any: [P.VIEW_EXPENSES] },
  { path: "/report/*", any: [P.VIEW_EXPENSE_REPORT, P.VIEW_EXPENSES] },
  { path: "/report-expenses/*", any: [P.VIEW_EXPENSE_REPORT] },
  { path: "/report-invoice/*", any: [P.VIEW_INVOICE_REPORT] },
  { path: "/report-fistula/*", any: [P.VIEW_FISTULA_REPORT] },
  { path: "/report-consultation/*", any: [P.VIEW_CONSULTATION_REPORT] },
  { path: "/report-ipd/*", any: [P.VIEW_REPORTS] },

  // Admin: roles + permission matrix, users, settings
  { path: "/roles-list/*", any: [P.MANAGE_ROLES] },
  { path: "/user-list/register-user", any: [P.CREATE_USER] },
  { path: "/user-list/edit-user/:id", any: [P.EDIT_USER] },
  { path: "/user-list", any: [P.VIEW_USERS] },
  { path: "/settings/*", any: [P.VIEW_SETTINGS] },
  // shown as a Settings tab as well as a master
  { path: "/medicine-category-mapping-list/*", any: [P.VIEW_MASTERS, P.VIEW_SETTINGS] },

  { path: "/shloka-list/*", any: [P.VIEW_SHLOKA] },
  ...MASTER_PREFIXES.map((prefix) => ({ path: `${prefix}/*`, any: [P.VIEW_MASTERS] })),
];

// Intentionally NOT mapped (always allowed once logged in):
//   "/" (redirects), "/fistula-entry/*" (sidebar item has no permission),
//   "/user_profile_details(/:id)", "/edit-user/:id" (own profile / self edit),
//   "/user-list/user-detail/:id" (staff cards are linked from clinical pages),
//   "/register-user" (public form, not part of the private tree) and "*" (404).

export const findRouteRule = (pathname: string): RouteRule | null => {
  for (const rule of ROUTE_RULES) {
    if (matchPath({ path: rule.path, end: true }, pathname)) return rule;
  }
  return null;
};

export const isRouteAllowed = (
  pathname: string,
  hasPermission: (p: PermissionValue) => boolean
): boolean => {
  const rule = findRouteRule(pathname);
  if (!rule) return true;
  return rule.any.some((p) => hasPermission(p));
};

// First page a user can land on, in sidebar order (used after "Not authorised").
const LANDING_PAGES: { path: string; label: string }[] = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/patient-list?currentPage=1", label: "Patients" },
  { path: "/appointment-list?currentPage=1", label: "Appointments" },
  { path: "/online-appointments?currentPage=1", label: "Online Appointments" },
  { path: "/consultation-list?currentPage=1", label: "Consultations" },
  { path: "/ipd-enrollments?currentPage=1", label: "IPD Enrollments" },
  { path: "/invoice?currentPage=1", label: "Bills" },
  { path: "/expenses-list?currentPage=1", label: "Expenses" },
  { path: "/report-expenses?currentPage=1", label: "Expenses Report" },
  { path: "/report-invoice?currentPage=1", label: "Invoice Report" },
  { path: "/report-fistula?currentPage=1", label: "Fistula Report" },
  { path: "/report-consultation?currentPage=1", label: "Consultation Report" },
  { path: "/report-ipd?currentPage=1", label: "IPD Report" },
  { path: "/department-list?currentPage=1", label: "Masters" },
  { path: "/user-list?currentPage=1", label: "Users" },
  { path: "/settings?tab=system-settings", label: "Settings" },
  { path: "/fistula-entry?currentPage=1", label: "Fistula Entry" },
];

export const getFirstPermittedPage = (
  hasPermission: (p: PermissionValue) => boolean
): { path: string; label: string } | null => {
  for (const page of LANDING_PAGES) {
    if (isRouteAllowed(page.path.split("?")[0], hasPermission)) return page;
  }
  return null;
};

// Delete buttons (ActionMenu) that have an explicit delete permission, by list page.
const DELETE_PERMISSIONS: { path: string; permission: PermissionValue }[] = [
  { path: "/patient-list/*", permission: PERMISSIONS.DELETE_PATIENT },
  { path: "/appointment-list/*", permission: PERMISSIONS.DELETE_APPOINTMENT },
  { path: "/consultation-list/*", permission: PERMISSIONS.DELETE_CONSULTATION },
  { path: "/invoice/*", permission: PERMISSIONS.DELETE_BILL },
  { path: "/expenses-list/*", permission: PERMISSIONS.DELETE_EXPENSE },
  { path: "/user-list/*", permission: PERMISSIONS.DELETE_USER },
];

/** Permission needed for the Delete action on the page at `pathname` (null = none defined). */
export const getDeletePermission = (pathname: string): PermissionValue | null => {
  const hit = DELETE_PERMISSIONS.find((d) =>
    matchPath({ path: d.path, end: true }, pathname)
  );
  return hit ? hit.permission : null;
};
