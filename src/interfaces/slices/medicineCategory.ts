import { MedicineCategory } from "../medicines/medicine_category";

export interface MedicineCategoryState {
  loading: boolean;
  medicineCategoryListData: MedicineCategory[] | any;
  medicineCategoryDetailData: any;
}
