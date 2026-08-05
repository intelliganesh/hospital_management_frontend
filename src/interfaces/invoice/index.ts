import { GenericStatus } from "../index";

export type PaymentStatus =
  | GenericStatus.PAYMENT_STATUS_PAID
  | GenericStatus.PAYMENT_STATUS_UNPAID;

export interface Invoice {
  patientId: string; 
  doctorId: number; 

  invoiceDate: Date; 
  description: string; 
  totalAmount: number; 
  paymentStatus: PaymentStatus;
  nextVisitDate?: Date;
}
