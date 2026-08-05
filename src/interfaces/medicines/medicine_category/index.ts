export interface MedicineCategory {
  category_name: string;
}

export interface MedicineCategoryMapping {
  medicine_id: string;
  category_id: string;
}

interface MedicineCategoryList {
  id: string;
  category_name: string;
}
interface MedicineList {
  id: string;
  medicine_name: string;
}
export interface MedicineCategoryAllMapping {
  medicine: MedicineList;
  medicine_category: MedicineCategoryList;
}
