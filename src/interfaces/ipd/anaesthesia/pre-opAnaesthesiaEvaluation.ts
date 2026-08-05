type denturesValue = "Yes" | "No";

export interface PreOpAnaesthesiaEvalAdd {
  ipd_id: string;
  ipd_surgery_id: string;
  ipd_anaesthesia_id?: string;
  previous_anaesthesia_surgery?: string;
  current_medication?: string;
  allergies?: string;
  asa_grading?: string;
  mouth_opening?: string;
  tmd?: string;
  teeth?: string;
  neck_movement?: string;
  mallampati_score?: string;
  dentures_check?: denturesValue;
  summary?: string;
  upload_pdf_path?: File;
  datetime?: Date;
}

export interface PreOpAnaesthesiaEvalDetails extends PreOpAnaesthesiaEvalAdd {
  id: string;
  created_at: Date;
}

export interface PreOpAnaesthesiaEvalState {
  PreOpAnaesthesiaEvalDetails: PreOpAnaesthesiaEvalDetails | {} | null;
}
