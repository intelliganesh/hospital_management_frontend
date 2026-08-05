    import { GenericStatus } from "@/interfaces/index";

export type AmountTypeStatus =
  | GenericStatus.ACTIVE
  | GenericStatus.INACTIVE;

export interface AmountType {
  amount_for: string;
  description?: string;
  status: AmountTypeStatus;
}

export interface AmountTypeState {
  amountTypeDetailData: any;
  amountTypeListData: AmountType[] | any;
  amountTypeDropdownData: AmountType[]| any;
}
