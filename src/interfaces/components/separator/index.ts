import { CSSProperties } from "react";

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "solid" | "dashed" | "dotted";


export interface SeparatorBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: CSSProperties;
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  variant?: SeparatorVariant;
}

export type SeparatorProps = SeparatorBaseProps;
