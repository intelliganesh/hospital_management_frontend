import { GenericStatus } from "../index";

export interface Role {
  id?: number;
  name: string;
  description?: string;
  status: GenericStatus.ACTIVE | GenericStatus.INACTIVE;
}

export interface Permissions {
  role?: string;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

/** One permission key as returned by GET /permissions_list. */
export interface PermissionItem {
  key: string;
  label: string;
}

/** Permissions grouped by module (e.g. Patients, Billing) for the matrix. */
export interface PermissionModule {
  module: string;
  permissions: PermissionItem[];
}

// export interface

export const rolesTypeOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
