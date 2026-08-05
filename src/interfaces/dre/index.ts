 import { GenericStatus } from "../index";

export type Status =
  | GenericStatus.ACTIVE
  | GenericStatus.INACTIVE;

export interface Dre {
  id?: number;
  dre_name: string;
//   description?: string;
  department_type: string;
}

export interface DreState {
  dreDetailData: any;
  dreListData: Dre[] | any;
  dreDropdownData: any[];
}