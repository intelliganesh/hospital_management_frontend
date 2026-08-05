export enum Dosage {
  TAKE_DOSAGE = "1",
  SKIP_DOSAGE = "0",
}

export type DosageSchedule = Dosage.TAKE_DOSAGE | Dosage.SKIP_DOSAGE;

export type Time = "morning" | "evening" | "night";

export interface Prescription {
  consultationId: number; 
  medicineId?: string; 

  medicineName: string;
  dosage: DosageSchedule; //1-0-1
  duration: string; //days
  time: Time; //morning|evening
  foodAdvice: string;
}
