import { Gender } from "@/interfaces";

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
