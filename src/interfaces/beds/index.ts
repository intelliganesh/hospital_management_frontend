import { GenericStatus } from "@/interfaces/index";

// import { GenericStatus } from "..";

export enum BedType {
  SINGLE = "Single",
  DOUBLE = "Double",
  TRIPLE = "Triple",
}
// export enum Size {
//   TWIN = "twin",
//   FULL = "full",
//   QUEEN = "queen",
// }
export type Bed_Type = BedType.DOUBLE | BedType.SINGLE;

// export type BedSize = Size.FULL | Size.TWIN | Size.QUEEN;
export interface Bed {
  // ward_id?: string;
  room_id?: string;
  bed_number: string;
  bed_type: Bed_Type;
  // size: BedSize;
  status: GenericStatus.ROOM_AVAILABLE | GenericStatus.ROOM_OCCUPIED | GenericStatus.UNDER_MAINTAINANCE;
  description?: string;
}

export interface BedState {
  bedDetailData: any;
  bedListData: Bed[] | any;
  bedDropdownData: any[];
}
