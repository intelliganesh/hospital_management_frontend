import { MaratalStatus } from "../index";

export interface HabitUsage {
    uses: boolean;
    description?: string; // e.g., "1 pack/day for 10 years"
  }
  
  export interface FemalePersonalHistory {
    pregnancies: number;
    live_births: number;
    last_menstrual_period: string;
  }

export interface PersonalHistory {
    occupation: string;
    marital_status: MaratalStatus;
    tobacco_use: HabitUsage; // Boolean + Description
    alcohol_consumption?: string; // e.g., "Occasional, 2-3 drinks/week"
    drug_use: boolean;
    diet?: string; // e.g., "Regular, no restrictions"
    exercise?: string; // e.g., "Walks 30 minutes, 3 times/week"
    sleep_pattern?: string; // e.g., "7 hours nightly"
    past_medical_conditions?: string; // optional: include if relevant to personal history
    surgical_history?: string; 
    current_medications?: string; 
    allergies?: string; 
    female_data?: FemalePersonalHistory; // Optional section for female patients
  }
  
 
  

  