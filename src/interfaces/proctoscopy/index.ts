//  import { GenericStatus } from "../index";

// export type Status =
//   | GenericStatus.ACTIVE
//   | GenericStatus.INACTIVE;

export interface Proctoscopy {
  id?: number;
  proctoscopys_name: string;
//   description?: string;
//   is_active: Status;
  department_type: string;
}

export interface ProctoscopyState {
  proctoscopyDetailData: any;
  proctoscopyListData: Proctoscopy[] | any;
  proctoscopyDropdownData: any[];
}
