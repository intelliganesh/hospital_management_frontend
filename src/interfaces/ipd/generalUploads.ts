export type IpdUploadCategory =
  | "external_test_report"
  | "previous_hospital_records"
  | "other";

export interface IpdGeneralUpload {
  id: string;
  ipd_id: string;
  category: IpdUploadCategory | string;
  category_label: string;
  title: string | null;
  description: string | null;
  original_name: string | null;
  mime_type: string | null;
  file_size: number | null;
  uploaded_by: number | null;
  uploaded_by_name: string | null;
  document_path: string;
  document_url: string;
  created_at: string | null;
}
