import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "gaming-badge inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all overflow-hidden shadow-sm backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-accent text-primary-foreground border border-primary/20 [a&]:hover:shadow-primary/20",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground border border-secondary/20 [a&]:hover:shadow-secondary/20",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/80 text-white border border-destructive/20 [a&]:hover:shadow-destructive/20",
        outline:
          "border-2 border-primary/20 bg-background/80 text-foreground [a&]:hover:bg-accent/10 [a&]:hover:border-primary/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
