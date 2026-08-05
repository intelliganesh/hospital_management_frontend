import View from "../view"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <View
      className={`animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  )
}

export { Skeleton }