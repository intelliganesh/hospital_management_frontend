// interface ObservationsData {}
export interface anaesthesiaRecoveryObservationAdd {
  ipd_id: string;
  ipd_surgery_id: string;
  ipd_anaesthesia_id?: string;
  surgical_procedure?: string;
  time_patient_received?: string;
  monitors?: string[];
  post_operative_complications?: string[];
  post_operative_medications?: string[];
  patient_score_on_admission?: string;
  patient_score_before_transfer?: string;
  vital_monitoring?: string[];
  transfer_to?: string;
  time_of_transfer?: string;
  pulse_at_shifting?: string;
  sbp_at_shifting?: string;
  dbp_at_shifting?: string;
  rr_at_shifting?: string;
  post_operative_instructions?: string;
  upload_pdf_path?: string;
  summary?: string;
  // datetime?: Date;
}

export interface anaesthesiaRecoveryObservationDetails extends anaesthesiaRecoveryObservationAdd {
  id: string;
  created_at: Date;
}

export interface anaesthesiaRecoveryObservationState {
  AnaesthesiaRecoveryObservationDetails:
    | anaesthesiaRecoveryObservationDetails
    | {}
    | null;
}
