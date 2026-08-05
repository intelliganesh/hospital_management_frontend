import { GenericStatus } from "../index";
import { OpdCase } from "../opdCases";


export type LineOfTreatment = GenericStatus.MEDICAL | GenericStatus.SURGICAL;

export interface IpdCase extends OpdCase {
    // readonly id: number; // Primary Key, Auto-increment
    ipdNumber: string; 
    patientId: string; 

    passportOrAdharNo?: number; 

    admittedDate: Date; 
    
    // Attendant Details
    attendantPhoneNumber: string; 
    attendantName?: string; 
    attendantEmail?: string; 
    attendantAlternatePhoneNo?: number; 

    consultantsId?: string; 
    
    // Medical History & Complaints
    chiefComplaintsWithDuration?: string; 
    associatedComplaints?: string; // 
    previousTreatmentHistory?: string; // 
    associatedMedicalIllnessAndCurrentTreatment?: string; 
    allergiesIfAny?: number; 
    investigationId?: number; 
    
    // Diagnosis & Treatment
    provisionalDiagnosis?: string; 
    finalDiagnosis?: string; 
    lineOfTreatment: LineOfTreatment; 
    treatmentAdvised?: string; 
    preoperativeInstructions?: string; 
    treatmentGiven?: string; 
    dischargeDate?: Date; 
} 

