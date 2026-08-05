import { MedicineCategoryMapping } from "../medicines/medicine_category";

export interface MedicineCategoryMappingState {
  loading: boolean;
  medicineCategoryMappingDetails: any;
  medicineCategoryMappingAllListData: any;
  medicineCategoryMappingListData: MedicineCategoryMapping[] | any;
}
