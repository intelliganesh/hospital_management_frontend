export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export type ColorFormat = `#${string}` | `rgb(${number},${number},${number})`;

export interface SystemSettings {
  hospital_logo: URL | string | File;
  //   hospital_logo: URL | File;
  hospital_name: string;
  letter_header?: string;
  qr_code?: URL | string | File;
  address: string;
  billing_letter_header?: string;
  footer_content?: string;
  hospital_prefix: string; // Example: "HOS-"
  patient_prefix: string; // Example: "PAT-"
  patient_start_number: number;
  patient_status: boolean;
  ipd_prefix: string; // Example: "IPD-"
  ipd_start_number: number;
  ipd_status: boolean;
  opd_prefix: string; // Example: "OPD-"
  opd_start_number: number;
  opd_status: boolean;
  appointment_prefix: string; // Example: "APT-"
  appointment_start_number: number;
  appointment_status: boolean;
  payment_prefix: string; // Example: "PAY-"
  payment_start_number: number;
  payment_status: boolean;
  test_prefix: string; // Example: "TEST-"
  test_start_number: number;
  test_status: boolean;
  findings_prefix: string; // Example: "FIN-"
  findings_start_number: number;
  findings_status: boolean;
  invoice_prefix: string; // Example: "INV-"
  voucher_prefix: string; // Example: "VOU-"
  voucher_start_number: number;
  voucher_status: boolean;
  ward_prefix: string; // Example: "WAD-"
  room_prefix: string; // Example: "ROM-"
  bed_prefix: string; // Example: "BED-"

  primary_color: ColorFormat;
  bg_primary_color: ColorFormat;
  text_primary_color: ColorFormat;
  secondary_color: ColorFormat;
  bg_secondary_color: ColorFormat;
  text_secondary_color: ColorFormat;
  tertiary_color: ColorFormat;
  bg_tertiary_color: ColorFormat;
  text_tertiary_color: ColorFormat;
  currency_symbol: string;
  currency: string;
  theme: Theme;

  invoice_status: boolean;
  invoice_start_number: number;
  // hospital_prefix: string; // Example: "HOS-"
  // patient_prefix: string; // Example: "PAT-"
  // ipd_prefix: string; // Example: "IPD-"
  // opd_prefix: string; // Example: "OPD-"
  // appointment_prefix: string; // Example: "APT-"
  // payment_prefix: string; // Example: "PAY-"
  // findings_prefix: string; // Example: "FIN-"
  // test_prefix: string; // Example: "TEST-"

  email_notification: boolean;
  whatsapp_notification: boolean;
}
