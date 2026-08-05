import { GenericStatus } from "..";

export interface SurgicalHistory {
  is_active: string;
  description: string;
  surgery_name: string;
  department_type: string;
}

export interface DataProps {
  data: SurgicalHistory[];
}

export interface SurgicalHistoryState {
  surgicalHistoryDetailData: any;
  surgicalHistoryListFullData: SurgicalHistory[] | any;
  surgicalHistoryListData: DataProps;
  surgicalHistoryDropdownData: any[];
  loading: boolean;
}

export const surgicalHistoryTypeOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
