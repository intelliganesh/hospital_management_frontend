import { CSSProperties } from "react";

export interface DropdownProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  dropdownSize?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "filled" | "error";
  fullWidth?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  style?: CSSProperties;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}