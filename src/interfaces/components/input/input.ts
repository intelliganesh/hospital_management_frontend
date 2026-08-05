// Interface for InputProps
import { CSSProperties } from "react";

interface AllInputFieldsProps {
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string | boolean | number;
  // defaultValue?: string;
  label?: React.ReactNode | string | null;
  labelClassName?: string;
  inputSize?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "filled" | "error";
  fullWidth?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  style?: CSSProperties;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  required?: boolean;
}

export interface InputProps
  extends AllInputFieldsProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      keyof AllInputFieldsProps
    > {
  ref?: React.Ref<HTMLInputElement>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface textareaProps extends AllInputFieldsProps {
  ref?: React.Ref<HTMLTextAreaElement>;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}
