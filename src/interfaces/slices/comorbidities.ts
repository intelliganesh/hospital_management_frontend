import { GenericStatus } from "..";

export interface Comorbidity {
  name: string;
  description: string;
  is_chronic: boolean | any;
  is_active: string;
  department_type: string;
}

export interface ComorbidityState {
  isLoading: boolean;
  comorbidityDetails: any;
  comorbidityList: Comorbidity[];
  comorbidityDropdown: Comorbidity[] | null | any;
}

export const comorbidityStatusTyeOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

// export const isChronicTypeOptions = [
//   GenericStatus.TRUE,
//   GenericStatus.FALSE,
// ].map((value) => ({
//   value,
//   label: value.replace(/_/g, " "),
// }));

export const isChronicTypeOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];
