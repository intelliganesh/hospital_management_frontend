import { GenericStatus } from "..";

export enum FoodTimings {
  LUNCH = "Lunch",
  DINNER = "Dinner",
  BREAKFAST = "Breakfast",
}

export interface FoodAdvice {
  advice_text: string;
  meal_times: string;
  status: string;
  department_type: string;
}

export interface FoodAdviceState {
  loading: boolean;
  foodAdviceDetails: any;
  foodAdviceList: FoodAdvice[];
  foodAdviceDropdownList: any[];
}

export const foodAdviceStatusOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const foodAdviceTimingsOptions = [
  FoodTimings.LUNCH,
  FoodTimings.DINNER,
  FoodTimings.BREAKFAST,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
