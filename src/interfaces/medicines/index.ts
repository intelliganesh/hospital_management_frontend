// Enum for Dosage Form
export enum DosageForm {
    Tablet = "Tablet",
    Capsule = "Capsule",
    Syrup = "Syrup",
    Injection = "Injection",
    Other = "Other",
  }
  
  // Enum for Strength Unit
  export enum StrengthUnit {
    mg = "mg",
    g = "g",
    ml = "ml",
    l = "l",
    Other = "Other",
  }
  
  // Main interface for Medicine record
  export interface Medicine {
    medicine_name: string;
    generic_name?: string; 
    dosage_form: DosageForm;
    // category_id: number; // Foreign key to a medicine category table
    // dosage_form: DosageForm; 
    // dosage_form_other?: string; // Optional
    strength?: string; // Optional free-form string (e.g., "500mg/5ml")
    strength_value?: number; 
    strength_unit?: StrengthUnit;
    department_type?: string; 
    // strength_unit_other?: string; // Optional
    manufacturer: string; 
    stock_quantity: number | 0; // Default 0 if not specified
    unit_price: number; 
    expiry_date?: Date; 
    is_active: boolean | true; // Defaults to true
  }
  
  export interface MedicineState{
    medicineDetailData: any,
    medicineListData: Medicine[] | any,
    medicineDropdownData: any,
    userCompleteObj: any,
}