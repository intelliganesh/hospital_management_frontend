 import { GenericStatus } from "../../index";

export type Status =
  | GenericStatus.ACTIVE
  | GenericStatus.INACTIVE;

export interface ChiefComplaint {
  id?: number;
  complaint_name: string;
  description: string;
  is_active: Status;
  department_type: string;
}

export interface ChiefComplaintState {
  chiefComplaintDetailData: any;
  chiefComplaintListData: ChiefComplaint[] | any;
  chiefComplaintDropdownData: any[];
}