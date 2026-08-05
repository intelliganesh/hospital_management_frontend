import { CSSProperties } from "react";

export type BtnVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text"
  | "ghost"
  | "danger"
  | "outline";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  htmlType?: "submit" | "button" | "reset";
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
  variant?: BtnVariant;
  fullWidth?: boolean;
  "aria-label"?: string;
  style?: CSSProperties;
  className?: string;
}
export interface SetButtonSizeProps {
  large: string;
  medium: string;
  small: string;
  icon: string;
}
