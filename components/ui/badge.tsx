import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-3 py-1 text-xs uppercase tracking-[0.1em] font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-emerald text-white",
        secondary: "bg-charcoal-100 text-charcoal-700",
        outline: "border border-charcoal-200 text-charcoal",
        gold: "bg-champagne text-charcoal",
        success: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
        destructive: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
