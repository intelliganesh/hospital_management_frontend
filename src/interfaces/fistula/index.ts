 import { GenericStatus } from "../index";

export type Status =
  | GenericStatus.ACTIVE
  | GenericStatus.INACTIVE;

export enum FistulaType {
  POSITION = "position",
  SPHINCTER = "sphincter",
  CRYPT="crypt",
  HIGH_LOW_RIDING="high_low_riding"
}

export interface Fistula {
  id?: number;
  fistula_name: string;
  description?: string;
  sub_fistula_name?: FistulaType;
  department_type: string;
  is_active: Status;
}

export interface FistulaState {
  fistulaDetailData: any;
  fistulaListData: Fistula[] | any;
  patientFistulaDetailData: any;
  patientFistulaListData: Fistula[] | any;
  fistulaDropdownData: any[];
}