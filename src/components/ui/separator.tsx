import * as React from "react"
import type { SeparatorProps } from "@/interfaces/components/separator"
import View from "../view"


const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      orientation = "horizontal",
      decorative = true,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === "horizontal"

    return (
      <View
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation}
        className={`shrink-0 bg-border ${isHorizontal ? "h-[1px] w-full" : "h-full w-[1px]"} ${className}`}
        style={style}
        {...props}
      />
    )
  }
)

Separator.displayName = "Separator"

export { Separator }
