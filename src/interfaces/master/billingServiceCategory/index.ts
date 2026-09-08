import { GenericStatus } from "@/interfaces";

export type Status = GenericStatus.ACTIVE | GenericStatus.INACTIVE;

export interface BillingServiceCategory {
  id?: string | number;
  category_name: string;
  status: Status | string;
}

export interface BillingServiceCategoryState {
  billingServiceCategoryDetailData: BillingServiceCategory | any;
  billingServiceCategoryListData: BillingServiceCategory[] | any;
  billingServiceCategoryDropdownData: BillingServiceCategory[] | any;
}