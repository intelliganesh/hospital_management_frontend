import { GenericStatus } from "@/interfaces";
import { DifficultyLevel } from "@/interfaces/slices/yogaAsana";

export const yogaAsanaLevelOptions = [
  DifficultyLevel.BEGINNER,
  DifficultyLevel.INTERMEDIATE,
  DifficultyLevel.ADVANCED,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export const yogaAsanaStatusOptions = [
  GenericStatus.ACTIVE,
  GenericStatus.INACTIVE,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
