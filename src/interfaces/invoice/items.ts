export interface InvoiceItems {
  patientId: string;
  medicineId: string;

  itemDescription: string;
  quantity: number;
  unitPrice: number; 
  subTotal: number; 
}
