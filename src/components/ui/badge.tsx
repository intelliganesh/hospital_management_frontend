import * as React from "react";
import View from "../view";

const badgeBaseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

const badgeVariantClasses: Record<string, string> = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  success: "border-transparent bg-success text-success-foreground hover:bg-success/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariantClasses; 
  className?: string;
  style?: React.CSSProperties;
}

function Badge({ className = '', variant = 'default', style, ...props }: BadgeProps) {
  const variantClass = badgeVariantClasses[variant] || badgeVariantClasses.default;

  return (
    <View className={`${badgeBaseClasses} ${variantClass} ${className}`} style={style}{...props} />
  );
}

export { Badge };
