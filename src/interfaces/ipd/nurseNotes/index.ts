export interface NurseNotes{
    ipd_id: string;
    nurse_id: number | null;
    bp?: string;
    spo2?: string;
  temperature?: string;
  pulse?: string;
  remark1?: string;
  remark2?: string;
  datetime: string;

}

export interface NurseNotesState {
  nurseNotesDetailData: any;
  nurseNotesListData: NurseNotes[] | any;
  nurseNotesDropdownData: any[];
}
