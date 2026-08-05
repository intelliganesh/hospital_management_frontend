import { GenericStatus } from "../../index";

export type Status = GenericStatus.ACTIVE | GenericStatus.INACTIVE;

export interface ServiceCost {
  id?: number;
  service_name: string;
  cost: number;
  description?: string;
  status: Status;
  department_type: string;
  case_type: string;
}

export interface ServiceCostState {
  serviceCostDetailData: any;
  serviceCostListData: ServiceCost[] | any;
  serviceCostDropdownData: any[];
  totalServiceCost: number;
  discountPercent: number;
}
