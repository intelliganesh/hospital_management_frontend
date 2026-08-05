import { GenericStatus } from "../../index";

export type Status = GenericStatus.ACTIVE | GenericStatus.INACTIVE;

export interface ConsultationFees {
  id?: number;
  consultation_name: string;
  department_type: string;
  amount: number;
  status: Status;
}

export interface ConsultationFeesState {
  consultationFeesDetailData: any;
  consultationFeesListData: ConsultationFees[] | any;
  consultationFeesDropdownData: any[];
}