import { ListResponse } from "@/interfaces";

export interface Anaesthesia {
  ipd_id: string;
  ipd_surgery_id: string;
  ipd_anaesthesia_id: string;
  diagnosis?: string;
  position?: string;
  anaesthetist_assistant?: string;
  datetime?: Date;
  patient_height?: string;
  patient_weight?: string;
  patient_community?: string;
  patient_mother_tongue?: string;
}

export interface AnaesthesiaList extends Anaesthesia {
  id: string;
  ipd?: {
    ipd_number?: string;
    patient_name?: string;
    patient_age?: string;
    patient?: {
      gender?: string;
    };
  };
  surgery?: {
    surgery_name?: string;
    surgeon?: string;
    surgery_date?: string;
    anaesthetist?: string;
  };
}

export interface AnaesthesiaDetails extends Anaesthesia, AnaesthesiaList {
  diagnosis?: string;
  position?: string;
  created_at: Date;
  updated_at?: string;
}

export interface AnaesthesiaListResponse extends ListResponse {
  data: AnaesthesiaList[];
}

export interface AnaesthesiaState {
  anaesthesiaDetailData: AnaesthesiaDetails | {} | null;
  anaesthesiaListData: AnaesthesiaListResponse | null;
  anaesthesiaDropdownData: AnaesthesiaList[] | [] | null;
}
