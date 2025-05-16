
import * as React from "react"
import { cn } from "@/lib/utils"

const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-spin h-5 w-5 border-2 border-current border-t-transparent text-primary rounded-full", className)}
    {...props}
  >
    <span className="sr-only">Loading</span>
  </div>
))
Spinner.displayName = "Spinner"

export { Spinner }
