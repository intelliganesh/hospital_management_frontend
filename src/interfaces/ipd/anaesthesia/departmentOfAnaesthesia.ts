interface IVAccess {
  id: string;
  site: string;
  size: string;
  location: string;
}

interface Regional_Drugs {
  name?: string;
  conc?: string;
  vol?: string;
}

export interface departmentOfAnaesthesiaAdd {
  ipd_id: string;
  ipd_surgery_id: string;
  ipd_anaesthesia_id?: string;
  pre_anaesthesia_state?: string[];
  ventilated_patient?: string[];
  npo_status?: string;
  patient_safety?: string[];
  pre_oxygenation?: string[];
  induction?: string;
  laryngoscopy?: string[];
  difficult_intubation?: boolean;
  mask_anaesthesia?: string[];
  throat_pack?: string;
  nasogastric_tube?: string;
  maintenance?: string[];
  iv_access?: IVAccess[];
  central_blocks_spinal?: string[];
  central_blocks_spinal_needle_g?: string;
  central_blocks_epidural?: string[];
  central_blocks_epidural_g?: string;
  regional_blocks?: string[];
  nerve_stimulator?: string[];
  drugs_regional?: string[];
  regional_supplements?: Regional_Drugs[];
  endotracheal_tube?: string[];
  endotracheal_tube_size?: string;
  endotracheal_tube_fixed_at?: string;
  endotracheal_tube_type?: string[];
  airway?: string[];
  airway_size?: string;
  monitoring?: string[];
  temperature?: string;
  crystalloids_ml?: number;
  colloids_ml?: number;
  blood_ml?: number;
  anaesthesia_technique_brief?: string;
  abp_details?: string;
  cvp_details?: string;
  upload_pdf_path?: string;
  summary?: string;
  // datetime?: Date;
}

export interface departmentOfAnaesthesiaDetails extends departmentOfAnaesthesiaAdd {
  id: string;
  created_at: Date;
}

export interface departmentOfAnaesthesiaState {
  DepartmentOfAnaesthesiaDetails: departmentOfAnaesthesiaDetails | {} | null;
}
