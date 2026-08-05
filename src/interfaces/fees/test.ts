import { GenericStatus } from "@/interfaces/index";

  export type FeeType =
  | GenericStatus.STANDARD_FEE_TYPE
  | GenericStatus.EMERGENCY_FEE_TYPE
  | GenericStatus.HOME_COLLECTION_FEE_TYPE;

export type Status = GenericStatus.ACTIVE | GenericStatus.INACTIVE;

export interface TestFees {
  testId: number; 
  hospitalId: number; 

  feeType: FeeType; // standard|emergency|homecollection
  price: number; 

  effectiveDate: Date; //default current date
  status: Status; //default active
}
