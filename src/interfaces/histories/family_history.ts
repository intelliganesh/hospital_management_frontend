export type Relationship =
| "Father"
| "Mother"
| "Sister"
| "Brother"
| "Maternal Grandmother"
| "Maternal Grandfather"
| "Paternal Grandmother"
| "Paternal Grandfather"
| "Uncle"
| "Aunt"
| "Cousin"
| "Other";

export interface FamilyHistory {
    patient_id: number; 
    ipd_number: number; 
    relationship: Relationship; 
    other_relationship?: string; // Optional field for non-standard relationships
    name: string;
    age: number;
    living_status: boolean | true;
    age_at_death?: number; 
    cause_of_death?: string; 
    additional_notes?: string;
  }
  
 
  