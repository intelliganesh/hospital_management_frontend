export interface IpdEnrollment {
    patient_id?: string;
    consultation_id?: string;
    consultant_doctor_id: string;
    duty_doctor?: string[];
    nurse?: string[];
    consultant_doctor?: string[];
    admission_date_time: string;
    ward_id?: number | null;
    room_id?: number | null;
    bed_id?: number | null;
    advance_amount?: number | null;
}

export interface NewIPDPatientWithEnrollment extends IpdEnrollment {
    patient_first_name: string;
    patient_last_name: string;
    patient_gender: string;
    patient_attendant_name: string;
    patient_attendant_phone: string;
}

export interface IpdStates {
    ipdEnrollmentData: any;
    ipdEnrolledPatientDetails: any;
    ipdPatientList: [];
    ipdPatientDetailData: any;
    ipdPatientStatsData: any;
    prefilledUploadedPdfData: any;
}
