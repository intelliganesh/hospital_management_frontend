export interface BankDetails {
  title: string;
  details: string;
  is_active?: 0 | 1 | boolean | string;
}

export interface BankDetailsState {
  bankDetailsDetailData: BankDetails | any;
  bankDetailsListData: any;
  bankDetailsDropdownData: any[];
}
