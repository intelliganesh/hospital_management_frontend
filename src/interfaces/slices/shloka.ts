import { GenericStatus } from "..";

export interface Shloka {
  id: number;
  title: string;
  verse_text: string;
  status: GenericStatus.ACTIVE | GenericStatus.INACTIVE;
}

export interface ShlokaState {
  loading: boolean;
  shlokaListData: Shloka[] | any;
  shlokaDetailData: any;
  shlokaDropdownData: any;
}
