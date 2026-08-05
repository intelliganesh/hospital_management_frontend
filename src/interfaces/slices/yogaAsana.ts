import { GenericStatus } from "..";

export enum DifficultyLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

export interface YogaAsana {
  id: number;
  asana_name: string;
  description?: string;
  benefits?: string;
  contraindications?: string;
  difficulty_level:
    | DifficultyLevel.BEGINNER
    | DifficultyLevel.INTERMEDIATE
    | DifficultyLevel.ADVANCED;
  recommended_duration?: number; // in seconds
  status: GenericStatus.ACTIVE | GenericStatus.INACTIVE;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface YogaAsanaState {
  loading: boolean;
  yogaAsanaListData: YogaAsana[] | any;
  yogaAsanaDetailData: any;
  yogaAsanaDropdownData: any;
}
