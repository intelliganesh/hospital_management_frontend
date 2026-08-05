export interface ReferedByDoc {
  name: string;
  is_active: string;
}
export interface ReferedByDocState {
  referedByDetailData: any;
  referedByListData: ReferedByDoc[] | any;
  referedByDropdownData: any;
}
