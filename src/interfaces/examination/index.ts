export interface Examination{
    patient_id:string;
    appointment_id:string;
    doctor_id:string;

    temperature:string;
    bp:string;
    pulse:string;
    cvs:string;
    rs:string;

    description:string;
    examination_overview:string;
    complaint:string;
    advice:string;
    preliminary_diagnosis:string;
    next_visit_date:string;

    temperature_unit:string;
}

// interface for examination slice
export interface ExaminationState{
    examinationDetails:any;
    examinationList:Examination[];
    userCompleteObj:any;
}