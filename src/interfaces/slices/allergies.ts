import { AllergyRecord } from "../allergies";

export interface AllergyState {
  allergiesDetailData: any;
  allergiesListData: AllergyRecord[] | any;
  loading: boolean;
}
