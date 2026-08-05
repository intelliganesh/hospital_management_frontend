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

// export interface

export const rolesTypeOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
