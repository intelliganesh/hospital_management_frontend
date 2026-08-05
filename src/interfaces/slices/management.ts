import { GenericStatus } from "..";

export interface Management {
  management_name: string;
  description: string;
  department_type: string;
  is_active: string;
}

export interface ManagementState {
  loading: boolean;
  managementDetails: any;
  managementList: any[];
  managementDropdownList: any[];
}

export const managementStatusOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));