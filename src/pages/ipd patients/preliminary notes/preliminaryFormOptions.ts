import { Gender, MeasurementUnit } from "@/interfaces";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";

// vital fields that are sent to backend along with their unit
export const vitalUnitFields: Partial<Record<keyof PreliminaryNotes, MeasurementUnit>> = {
  bp: MeasurementUnit.MMHG,
  pulse: MeasurementUnit.BPM,
  temperature: MeasurementUnit.FAHRENHEIT,
  spo2: MeasurementUnit.PERCENTAGE,
};

export enum ReactiveOptions {
  REACTIVE = "Reactive",
  NON_REACTIVE = "Non Reactive",
}

export const genderOptions = Object.values(Gender).map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export const reactiveOptions = Object.values(ReactiveOptions).map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));
