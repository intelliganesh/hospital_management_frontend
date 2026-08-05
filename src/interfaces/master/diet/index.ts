import { GenericStatus } from "../../index";

export type Status =
  | GenericStatus.ACTIVE
  | GenericStatus.INACTIVE;

export interface Diet {
  id?: number;
  diet_name: string;
  calories?: number;
  description?: string;
  is_active: Status;
  department_type: string;
}

export interface DietState {
  dietDetailData: any;
  dietListData: Diet[] | any;
  dietDropdownData: any[];
}