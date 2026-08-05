import { forwardRef } from "react";
import { ViewProps } from "@/interfaces/components/text";

const View = forwardRef<HTMLDivElement, ViewProps>(
  ({ children, className = "", style, ...props }, ref) => {
    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    );
  }
);

View.displayName = "View";
export default View;
