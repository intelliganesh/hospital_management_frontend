// Helpers to keep the server-sent permissions (RBAC) in the stored session user.
// Session user = localStorage.userDetails (JSON). usePermissions() reads
// userDetails.permissions first and falls back to ROLE_PERMISSIONS[role].

export const PERMISSIONS_UPDATED_EVENT = "hms:permissions-updated";

/** Find a `permissions: string[]` inside an API payload (looks a few levels deep). */
export const extractPermissions = (payload: any, depth = 0): string[] | null => {
  if (!payload || typeof payload !== "object" || depth > 4) return null;
  if (
    Array.isArray(payload.permissions) &&
    payload.permissions.every((p: unknown) => typeof p === "string")
  ) {
    return payload.permissions as string[];
  }
  for (const key of ["data", "result", "token", "user"]) {
    const found = extractPermissions(payload[key], depth + 1);
    if (found) return found;
  }
  return null;
};

/** Merge permissions into the stored session user (no-op when the server sent none). */
export const persistPermissions = (permissions: string[] | null | undefined) => {
  if (!permissions) return;
  try {
    const raw = localStorage.getItem("userDetails");
    const user = raw ? JSON.parse(raw) : null;
    if (!user || typeof user !== "object") return;
    const prev = JSON.stringify(user.permissions ?? null);
    if (prev === JSON.stringify(permissions)) return;
    localStorage.setItem(
      "userDetails",
      JSON.stringify({ ...user, permissions })
    );
    window.dispatchEvent(new Event(PERMISSIONS_UPDATED_EVENT));
  } catch (error) {
    console.error("Unable to store permissions", error);
  }
};
