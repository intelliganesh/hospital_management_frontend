import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/button";
import Checkbox from "@/components/CheckBox";
import Select from "@/components/Select";
import Text from "@/components/text";
import View from "@/components/view";
import BouncingLoader from "@/components/BouncingLoader";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { RootState } from "@/actions/store";
import { useRoles } from "@/actions/calls/roles";
import { refreshSessionPermissions } from "@/actions/calls/auth";
import { PermissionModule } from "@/interfaces/roles";
import { usePermissions } from "@/utils/custom-hooks/use-permissions";
import { commanButtonStyle } from "@/utils/helperFunctions";

/**
 * Roles > Permissions: checkbox matrix (grouped by module) that loads and saves
 * the permissions of one role through GET/PUT /role_permissions/{role_id}.
 * Reached from the Roles list (role name / "Permissions" button) as
 * /roles-list/permissions?role=<id>.
 */
const PermissionPage: React.FC<{}> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleId = searchParams.get("role") ?? "";
  const { getUserRole } = usePermissions();

  const {
    roleDropdownHandler,
    getPermissionsCatalogue,
    getRolePermissions,
    saveRolePermissions,
  } = useRoles();

  const roles: { id: number | string; name: string }[] =
    useSelector((state: RootState) => state.roles.rolesDropdown) ?? [];

  const [modules, setModules] = useState<PermissionModule[]>([]);
  const [granted, setGranted] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);
  const [loadingRole, setLoadingRole] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedRole = roles.find((r) => String(r.id) === roleId);
  // Super Admin keeps full access whatever is ticked (prevents lock-out)
  const isLockedRole = selectedRole?.name === "Super Admin";

  useEffect(() => {
    roleDropdownHandler(() => {});
    getPermissionsCatalogue((data) => {
      setModules(data ?? []);
      setLoadingCatalogue(false);
    });
  }, []);

  useEffect(() => {
    if (!roleId) {
      setGranted(new Set());
      setSaved(new Set());
      return;
    }
    setLoadingRole(true);
    getRolePermissions(roleId, (permissions) => {
      const next = new Set(permissions ?? []);
      setGranted(next);
      setSaved(new Set(next));
      setLoadingRole(false);
    });
  }, [roleId]);

  const allKeys = useMemo(
    () => modules.flatMap((m) => m.permissions.map((p) => p.key)),
    [modules]
  );
  const isDirty =
    granted.size !== saved.size || [...granted].some((k) => !saved.has(k));

  const setMany = (keys: string[], checked: boolean) => {
    setGranted((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => (checked ? next.add(k) : next.delete(k)));
      return next;
    });
  };

  const handleSave = () => {
    if (!roleId) return;
    setIsSaving(true);
    saveRolePermissions(roleId, [...granted], (completed, result) => {
      setIsSaving(false);
      if (completed && result?.success) {
        setSaved(new Set(granted));
        toast({
          title: "Permissions saved",
          description: `${selectedRole?.name ?? "Role"} now has ${granted.size} permissions.`,
          variant: "success",
        });
        // editing my own role: reload my menu / route access
        if (selectedRole?.name === getUserRole()) refreshSessionPermissions(true);
      }
    });
  };

  const disabled = !roleId || loadingRole || isLockedRole || isSaving;

  return (
    <React.Fragment>
      <View className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <View>
          <Text as="h1" className="text-2xl font-bold text-text-DEFAULT mb-1">
            Role Permissions
          </Text>
          <Text as="p" className="text-text-light">
            Choose what each role can open and do. Changes apply the next time
            the user signs in or reloads the page.
          </Text>
        </View>
        <View className="flex flex-wrap items-end gap-3">
          <View className="min-w-[220px]">
            <Select
              name="role"
              label="Role"
              fullWidth
              value={roleId}
              placeholder="Select a role"
              options={roles.map((r) => ({
                value: String(r.id),
                label: r.name,
              }))}
              onChange={(e) =>
                setSearchParams({ role: e.target.value }, { replace: true })
              }
            />
          </View>
          <Button
            variant="outline"
            disabled={disabled}
            onPress={() => setMany(allKeys, true)}
          >
            Select all
          </Button>
          <Button
            variant="outline"
            disabled={disabled}
            onPress={() => setMany(allKeys, false)}
          >
            Clear all
          </Button>
          <Button
            variant="primary"
            className={commanButtonStyle}
            disabled={disabled || !isDirty}
            onPress={handleSave}
          >
            {isSaving ? "Saving..." : "Save permissions"}
          </Button>
        </View>
      </View>

      {isLockedRole && (
        <Card className="mb-4 border-l-4 border-yellow-400 bg-yellow-50 p-3">
          <Text as="p" className="text-sm text-yellow-800">
            Super Admin always has full access and cannot be changed here.
          </Text>
        </Card>
      )}

      {loadingCatalogue || loadingRole ? (
        <BouncingLoader isLoading notFixed />
      ) : !roleId ? (
        <Card className="p-6 text-center text-text-light">
          Select a role to view and edit its permissions.
        </Card>
      ) : modules.length === 0 ? (
        <Card className="p-6 text-center text-text-light">
          No permissions were returned by the server.
        </Card>
      ) : (
        <View className="grid gap-4 lg:grid-cols-2">
          {modules.map((m) => {
            const keys = m.permissions.map((p) => p.key);
            const checkedCount = keys.filter(
              (k) => isLockedRole || granted.has(k)
            ).length;
            return (
              <Card key={m.module} className="p-4">
                <View className="mb-3 flex items-center justify-between border-b pb-2">
                  <Text as="h2" className="font-semibold text-text-DEFAULT">
                    {m.module}{" "}
                    <Text as="span" className="text-xs font-normal text-text-light">
                      ({checkedCount}/{keys.length})
                    </Text>
                  </Text>
                  <View className="flex items-center gap-2">
                    <Text as="span" className="text-xs text-text-light">
                      All
                    </Text>
                    <Checkbox
                      checked={checkedCount === keys.length}
                      disabled={disabled}
                      onChange={(e) => setMany(keys, e.target.checked)}
                    />
                  </View>
                </View>
                <View className="grid gap-2 sm:grid-cols-2">
                  {m.permissions.map((p) => (
                    <View key={p.key} className="flex items-center gap-2">
                      <Checkbox
                        checked={isLockedRole || granted.has(p.key)}
                        disabled={disabled}
                        onChange={(e) => setMany([p.key], e.target.checked)}
                      />
                      <Text as="span" className="text-sm" title={p.key}>
                        {p.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </React.Fragment>
  );
};

export default PermissionPage;
