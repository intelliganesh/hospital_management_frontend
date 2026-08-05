export interface SurgeryReportData {
  ipd_id?: string;
  surgery_name?: string;
  surgery_type?: string;
  surgery_date?: string;
  status?: string;
  surgeon?: string;
  anaesthetist?: string;
  department?: string;
  surgery_start_datetime?: string;
  surgery_end_datetime?: string;
  assistant_surgeon?: string;
  scrub_nurse?: string;
  specimen_for_hpe?: string;
  operative_notes?: string;
  operative_findings?: string;
  post_operative_instructions?: string;
  summary?: string;
  consent_summary?: string;
  uploaded_consent_path?: File[] | string[] | null | string;
  uploaded_report_path?: File[] | string[] | null | string;
}

export interface SurgeryReport {
  surgeryReportDetailData: any;
  surgeryList: SurgeryReportData[] | any;
  surgeryDropdownData: any;
}
