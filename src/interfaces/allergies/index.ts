export enum AllergenType {
  FOOD = "Food",
  DRUG = "Drug",
  LATEX = "Latex",
  PLANT = "Plant",
  OTHER = "Other",
  ANIMAL = "Animal",
  INSECT = "Insect",
  VACCINE = "Vaccine",
  CHEMICAL = "Chemical",
  ENVIRONMENTAL = "Environmental",
}

//   type AllergenType = "Medication" | "Food" | "Environmental" | string;

export enum SeverityLevel {
  Mild = "Mild",
  Moderate = "Moderate",
  Severe = "Severe",
}

// Main interface for Allergy Record
export interface AllergyRecord {
  // patient_id: number; // Reference to Patients table
  // ipd_number: number; // Reference to IPD Cases
  allergen_name: string;
  allergen_type: AllergenType;
  department_type: string;
  // reaction_type: string;
  // severity: SeverityLevel;
  // date_first_experienced: Date; // Auto filled if days provided
  // days: number; // auto filled if date_first_experienced provided
  // management: string;
  documented_by: string;
  notes?: string; // Optional
  other_allergen_type?: string;
}
