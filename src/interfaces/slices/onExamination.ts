import { GenericStatus } from "..";

export interface OnExamination {
  id?: number;
  finding: string;
  is_active: string;
  normal_range: string;
  examination_type: string;
  department_type: string;
}

export interface OnExaminationState {
  loading: boolean;
  onExaminationDetailData: any;
  onExaminationListData: OnExamination[] | any;
  onExaminationDropdownData: any[];
}

export const onExaminationTypeOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
