import { CSSProperties } from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  label?: string; 
  placeholder?: string;
  value?: string | readonly string[] | number | undefined|any;
  defaultValue?: string;
  selectSize?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "filled" | "error";
  fullWidth?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  style?: CSSProperties;
  className?: string;
  options: Array<{
    value: string | readonly string[] | number | undefined;
    label: string;
    disabled?: boolean;
  }>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
}

export interface SizeClassesProps {
  small: string;
  medium: string;
  large: string;
  default: string;
}

export interface VariantProps {
  default: string;
  filled: string;
  error: string;
  outlined: string;
}
