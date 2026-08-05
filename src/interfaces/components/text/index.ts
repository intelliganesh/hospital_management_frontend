import { CSSProperties } from "react";

export type TagName =
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "label";

export type FontWeight =
  | "font-bold"
  | "font-medium"
  | "font-semibold"
  | "font-normal"
  | "font-light"
  | "font-extralight"
  | "font-thin";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export type VariantTypes ="heading" | "subheading" | "body" | "caption" | "label" | "span" | 'p';

export interface TextBaseProps extends TextProps {
  weight?: FontWeight;
  as?: TagName;
  align?: "left" | "center" | "right" | "justify";
  variant?: VariantTypes;
  
}
export type TextCompleteProp = TextBaseProps | TextProps;

export interface ViewProps extends TextProps {}
