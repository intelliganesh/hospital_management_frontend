export enum BedType {
  SINGLE = "single",
  DOUBLE = "double",
}
export enum Size {
  TWIN = "twin",
  FULL = "full",
  QUEEN = "queen",
}
export type Bed_Type = BedType.DOUBLE | BedType.SINGLE;

export type BedSize = Size.FULL | Size.TWIN | Size.QUEEN;

export interface Bed {
  roomId: number;
  bedType: Bed_Type;
  bedSize: BedSize;
}
