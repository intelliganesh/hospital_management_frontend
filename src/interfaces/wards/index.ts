import { GenericStatus } from "@/interfaces/index";

export type WardStatus =
  | GenericStatus.ACTIVE
  | GenericStatus.INACTIVE
  | GenericStatus.UNDER_MAINTAINANCE;

export enum WardType {
  GENERAL = "General",
  ICU = "ICU",
  EMERGENCY = "Emergency",
  NEUROLOGY = "Neurology",
  SURGICAL = "Surgical",
  PEDIATRIC = "Pediatric",
  MATERNITY = "Maternity",
  PSYCHIATRIC = "Psychiatric",
  ONCOLOGY = "Oncology",
  OBSERVATION = "Observation",
  CARDIOLOGY = "Cardiology",
  ORTHOPEDIC = "Orthopedic",
}

// export type WardType_ = WardType.GENERAL | WardType.ICU  | WardType.EMERGENCY | WardType.NEUROLOGY | WardType.SURGICAL | WardType.PEDIATRIC | WardType.MATERNITY | WardType.PSYCHIATRIC | WardType.ONCOLOGY | WardType.OBSERVATION | WardType.CARDIOLOGY | WardType.ORTHOPEDIC;

export interface Ward {
    name: string;
    type: WardType;
    ward_number?: string;
    floor: string;
    description?: string;
    status: WardStatus;
}

export interface WardState {
  wardDetailData: any;
  wardListData: Ward[] | any;
  wardDropdownData: any[];
}
