export type OnlineAppointmentStatus =
  | "PENDING"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "PAYMENT_REJECTED";

export type OnlineAppointmentSource =
  | "WEBSITE"
  | "APP"
  | "WALK_IN"
  | "REFERRAL";

export interface TimelineEvent {
  id: string;
  type:
    | "APPOINTMENT_REQUESTED"
    | "PAYMENT_LINK_SENT"
    | "PAYMENT_VERIFIED"
    | "APPOINTMENT_CONFIRMED"
    | "APPOINTMENT_REJECTED"
    | "DETAILS_UPDATED"
    | "MESSAGE_SENT";
  timestamp: string;
  description: string;
  performedBy?: string;
}

export interface OnlineAppointment {
  id: string;
  appointment_reference_number: string;
  name: string; // was patientName
  phone: string;
  doctor: {
    id: number;
    name: string;
    department_name: string;
    phone?: string;
  };
  consultation: any;
  doctor_id: number;
  appointment_datetime: string; // was appointmentDate
  status: string;
  source?: string; // not in API response, may be optional
  age: number;
  gender: string;
  email: string;
  symptoms: string;
  amount: string;
  // currency: string;
  payment_type: string;
  payment_info: string;
  meeting_link: string;
  appointment_type: string;
  alternate_date: string;
  visti_type?: string; // Backend typo for Visit Type
  visit_type?: string; // Corrected Visit Type
  transaction_id?: string;
  payment_date?: string;
  payment_screenshot?: string;
  paidAmount?: string;
  currency?: string;
  timeline?: TimelineEvent[];
}

export interface SendPaymentPayload {
  bankDetailsId: string;
  amount: number;
  waMessage: string;
}
