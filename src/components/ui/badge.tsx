import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2 focus:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        soft: "border-primary/15 bg-primary/10 text-primary",
        info: "border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]",
        success:
          "border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]",
        warning:
          "border-[color:var(--warning)]/25 bg-[color:var(--warning)]/12 text-[color:var(--warning)]",
        danger:
          "border-destructive/20 bg-destructive/10 text-destructive",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border-border/80 bg-background/50 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
