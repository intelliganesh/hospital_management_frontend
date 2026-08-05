import { CSSProperties } from "react";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  radioSize?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "filled" | "error";
  id?: string;
  "aria-label"?: string;
  style?: CSSProperties;
  className?: string;
}

export interface RadioProps {
  value: string;
  label: string;
  name: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  radioSize?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "filled" | "error";
  id?: string;
  style?: CSSProperties;
  className?: string;
}