export interface DoctorNotes{
    id?: string;
    ipd_id: string;
    doctor_id: number;
    gc?: string;
    bp?: string;
    pr?: string;
    clinical_notes?: string;
    diagnosis?: string;
    datetime?: string;
    date?: string;
    time?: string;
}

export interface DoctorNotesState {
  doctorNotesDetailData: any;
  doctorNotesListData: DoctorNotes[] | any;
  doctorNotesDropdownData: any[];
}
