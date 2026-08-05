// Common interfaces
export interface ListResponse {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export enum MaratalStatus {
  SINGLE = "Single",
  MARRIED = "Married",
  DIVORCED = "Divorced",
}

export enum Ids {
  PASSPORT = "passport",
  ADHAR = "aadhaar",
  VOTER_ID = "voter_id",
  DRIVING_LICENSE = "driving_license",
  RATION_CARD = "ration_card",
}

export type LoadingStatus = "pending" | "success" | "failed";

export enum BloodGroups {
  // ABO + Rh Blood Groups
  A_POS = "A+",
  A_NEG = "A-",
  B_POS = "B+",
  B_NEG = "B-",
  AB_POS = "AB+",
  AB_NEG = "AB-",
  O_POS = "O+",
  O_NEG = "O-",

  // Rare Blood Groups
  // BOMBAY = "Oh", // Bombay Blood Group (hh phenotype)
  // DUFFY_A = "Fya", // Duffy Antigen A
  // DUFFY_B = "Fyb", // Duffy Antigen B
  // KIDD_A = "Jka", // Kidd Antigen A
  // KIDD_B = "Jkb", // Kidd Antigen B
  // KELL = "K", // Kell Antigen
  // KELL_CELLANO = "k", // Cellano Antigen (Kell system)
  // KELL_KPA = "Kpa", // Kell subgroup (Kpa)
  // KELL_KPB = "Kpb", // Kell subgroup (Kpb)
  // KELL_JSA = "Jsa", // Kell subgroup (Jsa)
  // KELL_JSB = "Jsb", // Kell subgroup (Jsb)
  // MNS_M = "M", // MNS system M antigen
  // MNS_N = "N", // MNS system N antigen
  // MNS_S = "S", // MNS system S antigen
  // MNS_s = "s", // MNS system lowercase s antigen
  // MNS_U = "U", // U-negative (rare in African descent)
  // LUTHERAN_A = "Lua", // Lutheran A antigen
  // LUTHERAN_B = "Lub", // Lutheran B antigen

  // //Uncommon Blood Groups
  // UNKNOWN = "Unknown",
}

export enum GenericStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  STARTED = "Started",
  ONGOING = "Ongoing",
  PAUSED = "Paused",
  PENDING = "Pending",
  CANCELLED = "Cancelled",
  RECALL = "Recall",
  REJECTED = "Rejected",
  COMPLETED = "Completed",
  ENDED = "Ended",
  CLOSED = "Closed",
  OPEN = "Open",
  TRUE = "True",
  FALSE = "False",
  RESCHEDULED = "Rescheduled",
  RESOLVED = "Resolved",
  UNRESOLVED = "Unresolved",
  IN_PROGRESS = "In Progress",
  TRANSFERRED = "Transferred",
  IN_REVIEW = "In Review",
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  ADMITTED = "Admitted", // When a patient is admitted to the hospital
  DISCHARGED = "Discharged", // When a patient is discharged after treatment
  UNDER_DIAGNOSIS = "Under Diagnosis", // Patient under medical examination
  TEST_PENDING = "Test Pending", // Medical tests are pending
  TEST_COMPLETED = "Test Completed", // Lab test results are available
  PRESCRIBED = "Prescribed", // Medicine prescribed by a doctor
  MEDICATION_DISPENSED = "Medication Dispensed", // Pharmacy dispensed medication
  PAYMENT_PENDING = "Payment Pending", // Pending payment for services
  PAYMENT_COMPLETED = "Payment Completed", // Payment done
  WAITING = "Waiting", // Patient waiting for consultation
  IN_TREATMENT = "In Treatment", // Patient receiving treatment
  SURGERY_SCHEDULED = "Surgery Scheduled", // Surgery appointment confirmed
  SURGERY_IN_PROGRESS = "Surgery In Progress", // Surgery currently happening
  SURGERY_COMPLETED = "Surgery Completed", // Surgery finished successfully
  FOLLOW_UP_REQUIRED = "Follow-up Required", // Patient requires a follow-up appointment
  CRITICAL = "Critical", // Patient in critical condition
  STABLE = "Stable", // Patient's condition is stable
  DECEASED = "Deceased", // Unfortunately, patient has passed away
  REFERRED = "Referred", // Patient referred to another specialist/hospital
  NOT_REFERRED = "Not Referred", // Patient not referred
  UNDER_OBSERVATION = "Under Observation", // Patient under observation before further treatment
  EMERGENCY = "Emergency", // Emergency case status
  ADMISSION_PENDING = "Admission Pending", // Admission formalities in progress
  DISCHARGE_PENDING = "Discharge Pending", // Discharge process not yet completed
  FOLLOW_UP = "Follow-up", // Patient scheduled for a follow-up visit
  FIRST_VISIT = "First Visit", // Patient's first visit
  POST_FOLLOW_UP = "Post Surgery Follow up", // Patient's first visit
  CONVERTED_TO_IPD = "Converted to IPD", // Patient converted to IPD
  MEDICAL = "Medical",
  SURGICAL = "Surgical",
  BOTH = "both",
  STANDARD_FEE_TYPE = "standard",
  EMERGENCY_FEE_TYPE = "emergency",
  HOME_COLLECTION_FEE_TYPE = "Home collection",
  PAYMENT_STATUS_PAID = "paid",
  PAYMENT_STATUS_UNPAID = "unpaid",
  ROOM_AVAILABLE = "Available",
  ROOM_OCCUPIED = "Occupied",
  ROOM_MAINTAINANCE = "Maintainance",
  UNDER_MAINTAINANCE = "Under Maintenance",
  UNDER_CLEANING = "Under Cleaning",
  RESERVED = "Reserved",
  PAYMENT_LINK_SENT = "Payment Link Sent",
  PAYMENT_REJECTED = "Payment Rejected",
  CONFIRMED = "Confirmed",
  OPD = "OPD",
  IPD = "IPD",
  YES = "Yes",
  NO = "No",
  RUNNING = "Running",
  PAID = "Paid",
}

export enum PaymentType {
  UPI = "UPI",
  EMI = "EMI",
  Card = "Card",
  CASH = "Cash",
  ONLINE = "Online",
  WALLET = "Wallet",
  CHEQUE = "Cheque",
  "By Insurance" = "By Insurance",
  "Bank Transfer" = "Bank Transfer",
}

export enum AmountFor {
  Medicine = "Medicine",
  Enrollment = "Enrollment",
  Appointment = "Appointment",
  Test = "Test",
  Surgery = "Surgery",
  Consultation = "Consultation",
  RoomRent = "Room Rent",
  ICUCharges = "ICU Charges",
  Ambulance = "Ambulance",
  AdmissionFee = "Admission Fee",
  DischargeFee = "Discharge Fee",
  LabCharges = "Lab Charges",
  OperationTheatre = "Operation Theatre",
  EquipmentCharges = "Equipment Charges",
  NursingCharges = "Nursing Charges",
  Miscellaneous = "Miscellaneous",
}

// department types
export enum DepartmentTypeEnum {
  PROCTOLOGY = "Proctology",
  NON_PROCTOLOGY = "Non Proctology",
  ALLOPATHY = "Allopathy",
}

// case types
export enum CaseType {
  OPD = "OPD",
  IPD = "IPD",
}
